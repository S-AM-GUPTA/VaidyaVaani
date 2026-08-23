import os
import sys
import json
import time
import argparse
import numpy as np
from PIL import Image
import torch
from torch.utils.data import DataLoader
from transformers import AutoImageProcessor, AutoModelForImageClassification
import shutil
from collections import defaultdict

# Ensure parent path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from training.train_region_router import PrescriptionRegionDataset, CLASS_MAP, compute_metrics

def evaluate_region_router(args):
    device = torch.device(args.device if args.device != "auto" else ("cuda" if torch.cuda.is_available() else "cpu"))
    print(f"===================================================================")
    print(f"  EVALUATING REGION ROUTER ON HELD-OUT TEST SET")
    print(f"===================================================================")
    print(f"Model Path: {args.model_path}")
    print(f"Splits File: {args.splits_file}")
    print(f"Device: {device}")

    # Load Model & Processor
    model = AutoModelForImageClassification.from_pretrained(args.model_path)
    processor = AutoImageProcessor.from_pretrained(args.model_path)
    model.to(device)
    model.eval()

    # Load Test Split
    with open(args.splits_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    test_samples = manifest["splits"]["test"]
    print(f"Loaded {len(test_samples)} held-out test samples.")

    test_dataset = PrescriptionRegionDataset(test_samples, processor, is_train=False)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, shuffle=False)

    all_preds = []
    all_targets = []
    all_probs = []
    all_filenames = []
    all_paths = [s["file_path"] for s in test_samples]

    latencies = []

    print("\nRunning inference over test set...")
    with torch.no_grad():
        for batch in test_loader:
            inputs = batch["pixel_values"].to(device)
            labels = batch["label"]
            fnames = batch["filename"]

            t0 = time.perf_counter()
            outputs = model(pixel_values=inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1).cpu().numpy()
            t1 = time.perf_counter()

            batch_latency_ms = ((t1 - t0) / inputs.size(0)) * 1000
            latencies.extend([batch_latency_ms] * inputs.size(0))

            preds = np.argmax(probs, axis=-1)
            all_preds.extend(preds)
            all_targets.extend(labels.numpy())
            all_probs.extend(probs)
            all_filenames.extend(fnames)

    # Compute Metrics
    metrics = compute_metrics(all_preds, all_targets)
    avg_latency_ms = float(np.mean(latencies))

    print("\n--- TEST SET PERFORMANCE METRICS ---")
    print(f"Overall Accuracy:  {metrics['accuracy']*100:.2f}%")
    print(f"Macro Precision:   {metrics['macro_precision']*100:.2f}%")
    print(f"Macro Recall:      {metrics['macro_recall']*100:.2f}%")
    print(f"Macro F1-Score:    {metrics['macro_f1']*100:.2f}%")
    print(f"Avg Latency/Patch: {avg_latency_ms:.2f} ms")

    print("\n--- PER-CLASS BREAKDOWN ---")
    for cid, cname in CLASS_MAP.items():
        p = metrics["per_class_precision"][cid] * 100
        r = metrics["per_class_recall"][cid] * 100
        f = metrics["per_class_f1"][cid] * 100
        total_in_class = sum(1 for t in all_targets if t == cid)
        print(f"  Class {cid} ({cname:12s}) [N={total_in_class:4d}] -> Precision: {p:6.2f}% | Recall: {r:6.2f}% | F1: {f:6.2f}%")

    # Confusion Matrix Visualization
    cm = metrics["confusion_matrix"]
    print("\n--- CONFUSION MATRIX ---")
    print(f"{'Actual \\ Predicted':<18} | {'Handwritten':<11} | {'Printed':<8} | {'Mixed':<6} | {'Other':<6}")
    print("-" * 60)
    for row_idx, cname in CLASS_MAP.items():
        row_str = f"{cname:<18} | " + " | ".join(f"{cm[row_idx][col_idx]:<8}" for col_idx in range(4))
        print(row_str)

    # Error Analysis: Organize misclassified images
    error_analysis_dir = os.path.join(args.output_dir, "error_analysis")
    if os.path.exists(error_analysis_dir):
        shutil.rmtree(error_analysis_dir)
    os.makedirs(error_analysis_dir, exist_ok=True)

    misclassifications = []
    error_counts = defaultdict(int)

    for i in range(len(all_targets)):
        actual = int(all_targets[i])
        pred = int(all_preds[i])
        if actual != pred:
            actual_name = CLASS_MAP[actual]
            pred_name = CLASS_MAP[pred]
            pair_folder = os.path.join(error_analysis_dir, f"{actual_name}_to_{pred_name}")
            os.makedirs(pair_folder, exist_ok=True)

            src_img = all_paths[i]
            dst_img = os.path.join(pair_folder, os.path.basename(src_img))
            if os.path.exists(src_img) and not os.path.exists(dst_img):
                shutil.copy2(src_img, dst_img)

            error_counts[f"{actual_name} -> {pred_name}"] += 1
            if len(misclassifications) < 50:
                misclassifications.append({
                    "filename": all_filenames[i],
                    "actual": actual_name,
                    "predicted": pred_name,
                    "confidence": float(np.max(all_probs[i])),
                    "probabilities": {CLASS_MAP[j]: float(all_probs[i][j]) for j in range(4)}
                })

    print(f"\nTotal Misclassified Test Images: {sum(error_counts.values())} / {len(all_targets)}")
    print("Top Error Types:")
    for err_type, count in sorted(error_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {err_type:30s}: {count} samples")

    # Save Full Evaluation Report
    report = {
        "evaluation_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model_path": args.model_path,
        "test_sample_count": len(test_samples),
        "overall_accuracy": metrics["accuracy"],
        "macro_precision": metrics["macro_precision"],
        "macro_recall": metrics["macro_recall"],
        "macro_f1": metrics["macro_f1"],
        "average_latency_ms": avg_latency_ms,
        "per_class_metrics": {
            CLASS_MAP[cid]: {
                "precision": metrics["per_class_precision"][cid],
                "recall": metrics["per_class_recall"][cid],
                "f1": metrics["per_class_f1"][cid],
                "test_count": sum(1 for t in all_targets if t == cid)
            }
            for cid in range(4)
        },
        "confusion_matrix": {
            "classes": [CLASS_MAP[i] for i in range(4)],
            "matrix": cm
        },
        "error_summary": dict(error_counts),
        "sample_misclassifications": misclassifications
    }

    eval_json_path = os.path.join(args.output_dir, "test_evaluation_report.json")
    with open(eval_json_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\n[Test Evaluation Report Saved] {eval_json_path}")
    print(f"[Error Analysis Images Saved] {error_analysis_dir}")
    print("===================================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Region Router on Held-Out Test Set")
    parser.add_argument("--model-path", type=str, default="models/region-router/best", help="Trained model path")
    parser.add_argument("--splits-file", type=str, default="data/datasets/ieee_hp_prescription/splits.json", help="Path to splits.json")
    parser.add_argument("--output-dir", type=str, default="models/region-router", help="Evaluation output directory")
    parser.add_argument("--batch-size", type=int, default=32, help="Inference batch size")
    parser.add_argument("--device", type=str, default="auto", help="Device (cpu, cuda, auto)")

    args = parser.parse_args()
    evaluate_region_router(args)

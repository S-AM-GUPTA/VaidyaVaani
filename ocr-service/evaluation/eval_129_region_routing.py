import os
import sys
import json
import glob
import time
import numpy as np
from PIL import Image
from collections import defaultdict
import argparse

# Include parent path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from router.region_router import RegionRouter, CLASS_MAP

def evaluate_129_prescriptions(args):
    print("===================================================================")
    print("  QUALITATIVE EVALUATION: REGION ROUTER ON 129 KAGGLE PRESCRIPTIONS")
    print("===================================================================")
    print("IMPORTANT: The 129 dataset has no verified ground truth yet.")
    print("This evaluation is strictly qualitative generalization testing.\n")

    router = RegionRouter(model_dir=args.model_dir, confidence_threshold=args.confidence_threshold)
    router.load_model()

    # Load 129 annotations DB
    db_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "annotations", "annotations_db.json"))
    if not os.path.exists(db_file):
        raise FileNotFoundError(f"Annotations DB file not found: {db_file}")

    with open(db_file, "r", encoding="utf-8") as f:
        db_data = json.load(f)

    total_regions_processed = 0
    class_distribution = defaultdict(int)
    routing_distribution = defaultdict(int)
    confidence_scores = []
    qualitative_samples = []

    per_prescription_summary = []

    for image_id, item in db_data.items():
        img_path = item.get("image_path", "")
        if not os.path.exists(img_path):
            # Fallback search in cache
            fname = item.get("filename", f"{image_id}.jpg")
            cached = os.path.expanduser(f"~/.cache/kagglehub/datasets/mehaksingal/illegible-medical-prescription-images-dataset/versions/1/data/{fname}")
            if os.path.exists(cached):
                img_path = cached
            else:
                continue

        try:
            full_img = Image.open(img_path).convert("RGB")
            w_full, h_full = full_img.size
        except Exception:
            continue

        regions = item.get("regions", [])
        presc_preds = []

        for r_idx, reg in enumerate(regions):
            bbox = reg.get("bbox", [])
            if len(bbox) == 4:
                if isinstance(bbox[0], list):
                    xs = [pt[0] for pt in bbox]
                    ys = [pt[1] for pt in bbox]
                    x1, y1, x2, y2 = min(xs), min(ys), max(xs), max(ys)
                else:
                    x1, y1, x2, y2 = bbox

                # Crop region
                x1 = max(0, min(w_full, int(x1)))
                y1 = max(0, min(h_full, int(y1)))
                x2 = max(0, min(w_full, int(x2)))
                y2 = max(0, min(h_full, int(y2)))

                if (x2 - x1) > 4 and (y2 - y1) > 4:
                    crop = full_img.crop((x1, y1, x2, y2))
                    pred = router.predict_region(crop)
                    decision = router.get_routing_decision(pred)

                    pred_class = pred["predicted_class"]
                    conf = pred["confidence"]
                    route = decision["route"]

                    class_distribution[pred_class] += 1
                    routing_distribution[route] += 1
                    confidence_scores.append(conf)
                    total_regions_processed += 1

                    suggs = reg.get("suggestions", {})
                    paddle_sugg = suggs.get("paddleocr", {}).get("text", "")
                    trocr_sugg = suggs.get("pretrained_trocr", {}).get("text", "")
                    rxhandbd_sugg = suggs.get("rxhandbd_v1", {}).get("text", "")

                    region_record = {
                        "prescription_id": image_id,
                        "region_id": reg.get("region_id", f"reg_{r_idx}"),
                        "paddleocr_pred": paddle_sugg,
                        "trocr_pred": trocr_sugg,
                        "rxhandbd_pred": rxhandbd_sugg,
                        "router_prediction": pred_class,
                        "confidence": conf,
                        "route_decision": route,
                        "is_fallback": decision["is_fallback"]
                    }
                    presc_preds.append(region_record)

                    if len(qualitative_samples) < 25:
                        qualitative_samples.append(region_record)

        per_prescription_summary.append({
            "image_id": image_id,
            "region_count": len(presc_preds),
            "regions": presc_preds
        })

    # Summary Statistics
    conf_arr = np.array(confidence_scores) if confidence_scores else np.array([0.0])

    print("--- QUALITATIVE GENERALIZATION SUMMARY (129 PRESCRIPTIONS) ---")
    print(f"Total Prescriptions Evaluated: {len(per_prescription_summary)}")
    print(f"Total Candidate Regions Routed: {total_regions_processed}")
    print(f"\nRouter Predicted Class Distribution:")
    for cname in ["Handwritten", "Printed", "Mixed", "Other"]:
        cnt = class_distribution[cname]
        pct = (cnt / max(1, total_regions_processed)) * 100
        print(f"  {cname:14s}: {cnt:4d} regions ({pct:.2f}%)")

    print(f"\nRouter Execution Routing Decision Distribution:")
    for rname in ["RXHANDBD", "PADDLEOCR", "BOTH", "IGNORE"]:
        cnt = routing_distribution[rname]
        pct = (cnt / max(1, total_regions_processed)) * 100
        print(f"  {rname:14s}: {cnt:4d} regions ({pct:.2f}%)")

    print(f"\nRouter Confidence Statistics:")
    print(f"  Mean Confidence:   {np.mean(conf_arr):.4f}")
    print(f"  Median Confidence: {np.median(conf_arr):.4f}")
    print(f"  Min Confidence:    {np.min(conf_arr):.4f}")
    print(f"  Max Confidence:    {np.max(conf_arr):.4f}")
    print(f"  High Confidence (>=0.80): {np.sum(conf_arr >= 0.80)} ({np.sum(conf_arr >= 0.80)/max(1, len(conf_arr))*100:.2f}%)")
    print(f"  Low Confidence (<0.80, Fallback Triggered): {np.sum(conf_arr < 0.80)} ({np.sum(conf_arr < 0.80)/max(1, len(conf_arr))*100:.2f}%)")

    # Save Qualitative Report
    out_report = {
        "evaluation_type": "QUALITATIVE_GENERALIZATION (No Ground Truth Assumed)",
        "total_prescriptions": len(per_prescription_summary),
        "total_regions_processed": total_regions_processed,
        "class_distribution": dict(class_distribution),
        "routing_decision_distribution": dict(routing_distribution),
        "confidence_metrics": {
            "mean": float(np.mean(conf_arr)),
            "median": float(np.median(conf_arr)),
            "min": float(np.min(conf_arr)),
            "max": float(np.max(conf_arr)),
            "high_confidence_ratio": float(np.sum(conf_arr >= 0.80) / max(1, len(conf_arr))),
            "fallback_ratio": float(np.sum(conf_arr < 0.80) / max(1, len(conf_arr)))
        },
        "sample_routed_regions": qualitative_samples
    }

    out_path = os.path.abspath(os.path.join(args.output_dir, "eval_129_prescriptions_routing.json"))
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out_report, f, indent=2)

    print(f"\n[Qualitative Generalization Report Saved] {out_path}")
    print("===================================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Region Router Qualitatively on 129 Kaggle Prescriptions")
    parser.add_argument("--model-dir", type=str, default="models/region-router/best", help="Trained model path")
    parser.add_argument("--confidence-threshold", type=float, default=0.80, help="Confidence gate threshold")
    parser.add_argument("--output-dir", type=str, default="models/region-router", help="Output directory")

    args = parser.parse_args()
    evaluate_129_prescriptions(args)

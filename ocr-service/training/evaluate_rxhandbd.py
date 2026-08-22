import os
import sys
import argparse
import time
import json
from typing import Dict, Any, List, Tuple
import numpy as np
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from training.datasets.rxhandbd import RxHandBDDataset
from training.finetune_trocr import compute_cer_wer
from models.trocr_model import get_device

def evaluate_trocr_checkpoint(model, processor, test_samples: List[Dict[str, Any]], device, name: str) -> Dict[str, Any]:
    print(f"Evaluating {name} on {len(test_samples)} test samples...", flush=True)
    model.eval()
    model.to(device)
    
    predictions = []
    references = []
    latencies = []
    exact_matches = 0
    
    with torch.no_grad():
        for item in test_samples:
            img = item["image"]
            ref_text = item["text"]
            
            t0 = time.time()
            pixel_values = processor(img, return_tensors="pt").pixel_values.to(device)
            generated_ids = model.generate(pixel_values, max_new_tokens=32)
            pred_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
            lat = round((time.time() - t0) * 1000, 2)
            
            latencies.append(lat)
            predictions.append(pred_text)
            references.append(ref_text)
            
            if pred_text.lower() == ref_text.lower():
                exact_matches += 1
                
    cer, wer = compute_cer_wer(predictions, references)
    em_rate = round(exact_matches / len(test_samples) * 100, 2) if test_samples else 0.0
    avg_latency = round(float(np.mean(latencies)), 2) if latencies else 0.0
    
    return {
        "model_name": name,
        "test_samples_count": len(test_samples),
        "cer_percent": cer,
        "wer_percent": wer,
        "exact_match_percent": em_rate,
        "avg_latency_ms": avg_latency,
        "sample_predictions": [
            {"ref": r, "pred": p} for r, p in zip(references[:10], predictions[:10])
        ]
    }

def evaluate_paddleocr(test_samples: List[Dict[str, Any]]) -> Dict[str, Any]:
    print(f"Evaluating PaddleOCR baseline on {len(test_samples)} test samples...", flush=True)
    try:
        from ocr.paddle_engine import recognize_paddle
    except Exception as e:
        print(f"PaddleOCR not loadable: {e}", flush=True)
        return {"model_name": "PaddleOCR", "status": "UNAVAILABLE", "cer_percent": 0.0, "wer_percent": 0.0}
        
    predictions = []
    references = []
    latencies = []
    exact_matches = 0
    
    for item in test_samples:
        img_np = np.array(item["image"].convert("RGB"))
        ref_text = item["text"]
        
        t0 = time.time()
        res = recognize_paddle(img_np)
        lat = round((time.time() - t0) * 1000, 2)
        
        pred_text = res.get("raw_text", "").strip() if isinstance(res, dict) else ""
        latencies.append(lat)
        predictions.append(pred_text)
        references.append(ref_text)
        
        if pred_text.lower() == ref_text.lower():
            exact_matches += 1
            
    cer, wer = compute_cer_wer(predictions, references)
    em_rate = round(exact_matches / len(test_samples) * 100, 2) if test_samples else 0.0
    avg_latency = round(float(np.mean(latencies)), 2) if latencies else 0.0
    
    return {
        "model_name": "PaddleOCR (Baseline)",
        "test_samples_count": len(test_samples),
        "cer_percent": cer,
        "wer_percent": wer,
        "exact_match_percent": em_rate,
        "avg_latency_ms": avg_latency,
        "sample_predictions": [
            {"ref": r, "pred": p} for r, p in zip(references[:10], predictions[:10])
        ]
    }

def run_full_benchmark(
    max_test_samples: int = 25,
    finetuned_dir: str = "models/rxhandbd/best",
    pretrained_name: str = "microsoft/trocr-base-handwritten"
):
    print("===================================================================", flush=True)
    print("  RxHandBD Held-Out Test Evaluation & Baseline Benchmark", flush=True)
    print("===================================================================\n", flush=True)
    
    device_str = get_device()
    device = torch.device(device_str)
    
    # Load test dataset
    test_ds = RxHandBDDataset(split="test", max_samples=max_test_samples)
    test_samples = [test_ds[i] for i in range(len(test_ds))]
    
    results = {}
    
    # 1. Pretrained TrOCR
    print("\n[1/3] Benchmarking Pretrained TrOCR...", flush=True)
    p_processor = TrOCRProcessor.from_pretrained(pretrained_name)
    p_model = VisionEncoderDecoderModel.from_pretrained(pretrained_name)
    results["pretrained_trocr"] = evaluate_trocr_checkpoint(p_model, p_processor, test_samples, device, "Pretrained TrOCR")
    
    # 2. Fine-Tuned TrOCR (if exists)
    if os.path.exists(finetuned_dir):
        print("\n[2/3] Benchmarking RxHandBD Fine-Tuned TrOCR...", flush=True)
        try:
            ft_processor = TrOCRProcessor.from_pretrained(finetuned_dir)
            ft_model = VisionEncoderDecoderModel.from_pretrained(finetuned_dir)
            results["finetuned_trocr"] = evaluate_trocr_checkpoint(ft_model, ft_processor, test_samples, device, "RxHandBD Fine-Tuned TrOCR (v1)")
        except Exception as e:
            print(f"Could not load fine-tuned checkpoint: {e}", flush=True)
            results["finetuned_trocr"] = {"status": "NOT_TRAINED", "error": str(e)}
    else:
        results["finetuned_trocr"] = {"status": "NOT_YET_TRAINED"}
        
    # 3. PaddleOCR
    print("\n[3/3] Benchmarking PaddleOCR...", flush=True)
    results["paddleocr"] = evaluate_paddleocr(test_samples)
    
    # Summary Table
    print("\n======================= BENCHMARK SUMMARY =======================", flush=True)
    print(f"{'Model':<32} | {'CER (%)':<10} | {'WER (%)':<10} | {'Exact Match (%)':<15} | {'Latency (ms)':<12}", flush=True)
    print("-" * 90, flush=True)
    
    for k, v in results.items():
        if "cer_percent" in v:
            print(f"{v['model_name']:<32} | {v['cer_percent']:<10} | {v['wer_percent']:<10} | {v['exact_match_percent']:<15} | {v['avg_latency_ms']:<12}", flush=True)
        else:
            print(f"{k:<32} | {'N/A':<10} | {'N/A':<10} | {'N/A':<15} | {'N/A':<12}", flush=True)
    print("=================================================================\n", flush=True)
    
    with open("rxhandbd_evaluation_report.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    return results

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Evaluate TrOCR on RxHandBD Test Set")
    parser.add_argument("--samples", type=int, default=25)
    parser.add_argument("--finetuned-dir", type=str, default="models/rxhandbd/best")
    args = parser.parse_args()
    
    run_full_benchmark(max_test_samples=args.samples, finetuned_dir=args.finetuned_dir)

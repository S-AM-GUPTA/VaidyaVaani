import os
import time
import json
from typing import List, Dict, Any, Optional
import numpy as np

from .dataset_loader import KagglePrescriptionDataset
from main import process_prescription_pipeline

class PrescriptionBenchmark:
    """
    ML Evaluation & Benchmark Harness for VaidyaVaani Prescription OCR.
    Evaluates extraction throughput, confidence distributions, and clinical entity yields.
    """
    def __init__(self, dataset: Optional[KagglePrescriptionDataset] = None):
        self.dataset = dataset or KagglePrescriptionDataset()

    def run_benchmark(self, max_samples: int = 20, output_json: Optional[str] = None) -> Dict[str, Any]:
        """
        Runs benchmark on a subset of the Kaggle dataset.
        """
        n_samples = min(len(self.dataset), max_samples) if max_samples > 0 else len(self.dataset)
        print(f"[Benchmark] Starting benchmark on {n_samples} real-world Kaggle prescriptions...")
        
        results = []
        timings = []
        med_counts = []
        confidences = []
        tier_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
        total_lines_extracted = 0

        for i in range(n_samples):
            item = self.dataset[i]
            file_path = item["file_path"]
            filename = item["filename"]
            
            t0 = time.time()
            try:
                rx_result = process_prescription_pipeline(file_path, is_pdf=False)
                latency = round((time.time() - t0) * 1000, 2)
                timings.append(latency)
                
                meds = rx_result.get("prescription", {}).get("medicines", [])
                lines = rx_result.get("extracted_lines", [])
                overall_conf = rx_result.get("overall_confidence", 0.0)
                tier = rx_result.get("prescription", {}).get("confidence_tier", "LOW")
                
                total_lines_extracted += len(lines)
                med_counts.append(len(meds))
                confidences.append(overall_conf)
                tier_counts[tier] = tier_counts.get(tier, 0) + 1
                
                results.append({
                    "filename": filename,
                    "status": "SUCCESS",
                    "lines_count": len(lines),
                    "medicines_count": len(meds),
                    "medicines": [m.get("name") for m in meds],
                    "confidence": overall_conf,
                    "confidence_tier": tier,
                    "latency_ms": latency
                })
            except Exception as e:
                print(f"[Benchmark Error on {filename}]: {e}")
                results.append({
                    "filename": filename,
                    "status": "FAILED",
                    "error": str(e)
                })

        # Calculate aggregate metrics
        successful = [r for r in results if r["status"] == "SUCCESS"]
        success_rate = round(len(successful) / n_samples * 100, 2) if n_samples > 0 else 0
        avg_latency = round(np.mean(timings), 2) if timings else 0.0
        avg_lines = round(total_lines_extracted / len(successful), 2) if successful else 0.0
        prescriptions_with_meds = sum(1 for r in successful if r["medicines_count"] > 0)
        clinical_yield_rate = round(prescriptions_with_meds / len(successful) * 100, 2) if successful else 0.0
        avg_confidence = round(np.mean(confidences) * 100, 2) if confidences else 0.0

        summary = {
            "dataset_name": "mehaksingal/illegible-medical-prescription-images-dataset",
            "total_images_in_dataset": len(self.dataset),
            "evaluated_samples": n_samples,
            "success_rate_percent": success_rate,
            "avg_latency_per_page_ms": avg_latency,
            "avg_lines_extracted_per_page": avg_lines,
            "clinical_medicine_yield_rate_percent": clinical_yield_rate,
            "avg_composite_confidence_percent": avg_confidence,
            "tier_distribution": tier_counts,
            "sample_results": results
        }

        if output_json:
            with open(output_json, "w", encoding="utf-8") as f:
                json.dump(summary, f, indent=2)
            print(f"[Benchmark] Results saved to {output_json}")

        return summary

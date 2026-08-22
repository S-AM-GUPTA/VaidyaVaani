import sys
import os
import argparse

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from evaluation.dataset_loader import KagglePrescriptionDataset
from evaluation.evaluator import PrescriptionBenchmark
from evaluation.pseudo_labeler import generate_pseudo_annotations

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="VaidyaVaani Prescription OCR Benchmark")
    parser.add_argument("--samples", type=int, default=5, help="Number of samples to evaluate")
    parser.add_argument("--export-annotations", action="store_true", help="Export pseudo annotations")
    parser.add_argument("--output", type=str, default="benchmark_results.json", help="Output JSON results")
    args = parser.parse_args()

    ds = KagglePrescriptionDataset()
    print(f"Loaded Kaggle dataset with {len(ds)} images.")
    
    benchmark = PrescriptionBenchmark(ds)
    results = benchmark.run_benchmark(max_samples=args.samples, output_json=args.output)
    
    print("\n================ BENCHMARK SUMMARY ================")
    print(f"Evaluated Samples: {results['evaluated_samples']}")
    print(f"Success Rate: {results['success_rate_percent']}%")
    print(f"Average Latency: {results['avg_latency_per_page_ms']} ms/page")
    print(f"Average Lines Extracted: {results['avg_lines_extracted_per_page']}")
    print(f"Clinical Medicine Yield: {results['clinical_medicine_yield_rate_percent']}%")
    print(f"Confidence Distribution: {results['tier_distribution']}")
    print("===================================================\n")
    
    if args.export_annotations:
        generate_pseudo_annotations(ds, max_images=args.samples, output_path="kaggle_pseudo_annotations.json")

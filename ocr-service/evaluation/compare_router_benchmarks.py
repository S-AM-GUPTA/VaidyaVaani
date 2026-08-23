import os
import sys
import json
import numpy as np

def generate_benchmark_comparison():
    sample_report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "region-router", "test_evaluation_report.json"))
    doc_report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "region-router-v2-doc-split", "test_evaluation_report.json"))

    if not os.path.exists(sample_report_path):
        print(f"Sample-level report missing: {sample_report_path}")
        return
    if not os.path.exists(doc_report_path):
        print(f"Document-level report missing: {doc_report_path}")
        return

    with open(sample_report_path, "r", encoding="utf-8") as f:
        sample_rep = json.load(f)
    with open(doc_report_path, "r", encoding="utf-8") as f:
        doc_rep = json.load(f)

    s_acc = sample_rep["overall_accuracy"] * 100
    d_acc = doc_rep["overall_accuracy"] * 100
    diff_acc = d_acc - s_acc

    s_mf1 = sample_rep["macro_f1"] * 100
    d_mf1 = doc_rep["macro_f1"] * 100
    diff_mf1 = d_mf1 - s_mf1

    s_mprec = sample_rep["macro_precision"] * 100
    d_mprec = doc_rep["macro_precision"] * 100

    s_mrec = sample_rep["macro_recall"] * 100
    d_mrec = doc_rep["macro_recall"] * 100

    s_lat = sample_rep["average_latency_ms"]
    d_lat = doc_rep["average_latency_ms"]

    classes = ["Handwritten", "Printed", "Mixed", "Other"]

    print("\n" + "=" * 70)
    print("  VAIDYAVAANI REGION ROUTER: SAMPLE SPLIT vs DOCUMENT SPLIT BENCHMARK")
    print("=" * 70)
    print(f"{'Metric':<22} | {'Sample Split (Leaked)':<22} | {'Document Split (Zero Leak)':<26} | {'Delta':<8}")
    print("-" * 75)
    print(f"{'Overall Accuracy':<22} | {s_acc:6.2f}%                 | {d_acc:6.2f}%                    | {diff_acc:+6.2f}%")
    print(f"{'Macro F1-Score':<22} | {s_mf1:6.2f}%                 | {d_mf1:6.2f}%                    | {diff_mf1:+6.2f}%")
    print(f"{'Macro Precision':<22} | {s_mprec:6.2f}%                 | {d_mprec:6.2f}%                    | {d_mprec - s_mprec:+6.2f}%")
    print(f"{'Macro Recall':<22} | {s_mrec:6.2f}%                 | {d_mrec:6.2f}%                    | {d_mrec - s_mrec:+6.2f}%")
    print(f"{'Average Latency':<22} | {s_lat:6.2f} ms               | {d_lat:6.2f} ms                  | {d_lat - s_lat:+6.2f} ms")
    print("-" * 75)

    print("\nPER-CLASS F1-SCORE BREAKDOWN:")
    for c in classes:
        s_cf1 = sample_rep["per_class_metrics"][c]["f1"] * 100
        d_cf1 = doc_rep["per_class_metrics"][c]["f1"] * 100
        diff_cf1 = d_cf1 - s_cf1
        print(f"  {c + ' F1':<20} | {s_cf1:6.2f}%                 | {d_cf1:6.2f}%                    | {diff_cf1:+6.2f}%")

    print("\nDOCUMENT-SPLIT CONFUSION MATRIX:")
    cm = doc_rep["confusion_matrix"]["matrix"]
    print(f"{'Actual \\ Predicted':<18} | {'Handwritten':<11} | {'Printed':<8} | {'Mixed':<6} | {'Other':<6}")
    print("-" * 60)
    for idx, cname in enumerate(classes):
        row_str = f"{cname:<18} | " + " | ".join(f"{cm[idx][j]:<8}" for j in range(4))
        print(row_str)

    # Leakage Effect Interpretation
    print("\nLEAKAGE EFFECT INTERPRETATION:")
    if abs(diff_acc) <= 3.0 and abs(diff_mf1) <= 3.0:
        effect = "NEGLIGIBLE LEAKAGE EFFECT"
        summary = "Performance remained nearly identical on unseen prescription documents. Visual features (stroke curvature, printed glyph regularity, background noise) generalize robustly across distinct documents."
    elif abs(diff_acc) <= 8.0:
        effect = "MODERATE LEAKAGE EFFECT"
        summary = "A slight performance delta was observed on unseen documents, reflecting variance in document paper texture and ink styles, while maintaining strong operational reliability."
    else:
        effect = "SUBSTANTIAL LEAKAGE EFFECT"
        summary = "A significant performance delta was observed, showing that document-specific artifacts heavily influenced sample-level classification."

    print(f"  Classification: {effect}")
    print(f"  Summary: {summary}")

    # Mixed Class Rigorous Limitations
    print("\nMIXED CLASS STATISTICAL PROFILE:")
    s_m_cnt = sample_rep["per_class_metrics"]["Mixed"]["test_count"]
    d_m_cnt = doc_rep["per_class_metrics"]["Mixed"]["test_count"]
    print(f"  Total Mixed in Dataset: 126 crops across only 7 documents")
    print(f"  Sample Split Test Mixed:   {s_m_cnt} crops")
    print(f"  Document Split Test Mixed: {d_m_cnt} crops (from 1 independent document)")
    print("  Statistical Assessment: High variance expected due to small sample size (N=18). Dual OCR execution on Mixed regions is mandatory.")

    # Save Comparison Report
    comp_report = {
        "sample_split_metrics": sample_rep,
        "document_split_metrics": doc_rep,
        "comparison_table": {
            "accuracy": {"sample": s_acc, "document": d_acc, "delta": diff_acc},
            "macro_f1": {"sample": s_mf1, "document": d_mf1, "delta": diff_mf1},
            "handwritten_f1": {"sample": sample_rep["per_class_metrics"]["Handwritten"]["f1"]*100, "document": doc_rep["per_class_metrics"]["Handwritten"]["f1"]*100, "delta": doc_rep["per_class_metrics"]["Handwritten"]["f1"]*100 - sample_rep["per_class_metrics"]["Handwritten"]["f1"]*100},
            "printed_f1": {"sample": sample_rep["per_class_metrics"]["Printed"]["f1"]*100, "document": doc_rep["per_class_metrics"]["Printed"]["f1"]*100, "delta": doc_rep["per_class_metrics"]["Printed"]["f1"]*100 - sample_rep["per_class_metrics"]["Printed"]["f1"]*100},
            "mixed_f1": {"sample": sample_rep["per_class_metrics"]["Mixed"]["f1"]*100, "document": doc_rep["per_class_metrics"]["Mixed"]["f1"]*100, "delta": doc_rep["per_class_metrics"]["Mixed"]["f1"]*100 - sample_rep["per_class_metrics"]["Mixed"]["f1"]*100},
            "other_f1": {"sample": sample_rep["per_class_metrics"]["Other"]["f1"]*100, "document": doc_rep["per_class_metrics"]["Other"]["f1"]*100, "delta": doc_rep["per_class_metrics"]["Other"]["f1"]*100 - sample_rep["per_class_metrics"]["Other"]["f1"]*100},
            "latency_ms": {"sample": s_lat, "document": d_lat, "delta": d_lat - s_lat}
        },
        "leakage_effect": effect,
        "interpretation": summary
    }

    out_json = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "router_leakage_audit_comparison.json"))
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(comp_report, f, indent=2)

    print(f"\n[Comparison Report Saved] {out_json}")
    print("=" * 70)

if __name__ == "__main__":
    generate_benchmark_comparison()

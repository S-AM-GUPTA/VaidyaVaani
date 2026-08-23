# VaidyaVaani — Prescription Text Region Router: Model Card & Scientific Benchmark

## Executive Summary

The **VaidyaVaani Region Router** is a 4-class image patch classifier designed to categorize cropped regions of medical prescriptions into:
- **Class 0**: `Handwritten`
- **Class 1**: `Printed`
- **Class 2**: `Mixed` (combining printed headers with handwritten values)
- **Class 3**: `Other` (ruling lines, decorative logos, stamps, noise)

This model card details the architecture, training dataset, dataset leakage discovery, and the official zero-leakage document-level benchmark.

---

## 1. Dataset Provenance & Structure

- **Dataset**: IEEE DataPort *"Dataset for classification of handwritten and printed text in a Doctor's prescription"* (DOI: `10.21227/5ZBC-8G23`).
- **Total Samples**: 11,340 cropped text regions (0 corrupted).
- **Original Prescription Documents**: Exactly 630 documents.
- **Crops per Document**: Exactly 18 crops per document across all 630 documents ($630 \times 18 = 11,340$).
- **Class Breakdown**:
  - `Handwritten`: 173 documents (3,114 crops, 27.46%)
  - `Printed`: 160 documents (2,880 crops, 25.40%)
  - `Mixed`: 7 documents (126 crops, 1.11%)
  - `Other`: 290 documents (5,220 crops, 46.03%)
- **Multi-Class Purity**: 0 / 630 documents contain multi-class crops (each document belongs exclusively to one class in this source dataset).

---

## 2. Dataset Leakage Audit & Benchmark Dual-Report

### Leakage Discovery in Sample-Level Split
In the naive 70/15/15 split randomly shuffled at the crop level:
- **100% of validation documents** were present in the training set (597 / 630 docs).
- **100% of test documents** were present in the training set (588 / 630 docs).
- The model memorized document-level visual artifacts (paper tint, lighting, camera sensor noise) rather than invariant script geometry.

### Official Benchmark Comparison

| Metric | Sample-Level Leaked Benchmark | Document-Level Zero-Leakage Benchmark (Official) | Status / Delta |
|---|---|---|---|
| **Overall Accuracy** | **96.25%** | **62.06%** | **-34.19%** (True generalization) |
| **Macro F1-Score** | **95.45%** | **46.03%** | **-49.42%** |
| **Macro Precision** | **95.57%** | **48.58%** | **-46.99%** |
| **Macro Recall** | **95.39%** | **47.33%** | **-48.06%** |
| **Handwritten F1** | **94.17%** | **62.37%** | **-31.80%** |
| **Printed F1** | **93.70%** | **47.07%** | **-46.63%** |
| **Mixed F1** | **95.00%** | **0.00%** | **-95.00%** (Severe sample limitation) |
| **Other F1** | **98.92%** | **74.68%** | **-24.24%** (High precision, limited recall) |
| **Inference Latency**| **18.28 ms** | **19.88 ms** | +1.60 ms (CPU) |

---

## 3. Detailed Class-Level Performance Analysis (Zero-Leakage Benchmark)

Held-out test set ($N=1,692$ crops across 94 unseen documents):

| Class ID | Class Name | Test Samples ($N$) | Precision | Recall | F1-Score | Operational Interpretation |
|---|---|---|---|---|---|---|
| `0` | **Handwritten** | 468 | 52.65% | **76.50%** | **62.37%** | Captures 76.5% of handwriting, but receives false positives from printed/other. |
| `1` | **Printed** | 432 | 42.33% | **53.01%** | **47.07%** | Substantial confusion with handwriting on unconstrained document fonts. |
| `2` | **Mixed** | 18 | **0.00%** | **0.00%** | **0.00%** | **Severely underrepresented** ($N=18$ from 1 doc). Model predicted 0 mixed. |
| `3` | **Other** | 774 | **99.36%** | **59.82%** | **74.68%** | **High precision, limited recall**: Filters noise accurately when confident, but misses 40.18% of noise. |

### Document-Level Confusion Matrix

```
Actual \ Predicted | Handwritten | Printed  | Mixed  | Other 
------------------------------------------------------------
Handwritten        | 358         | 110      | 0      | 0       
Printed            | 200         | 229      | 0      | 3       
Mixed              | 3           | 15       | 0      | 0       
Other              | 119         | 187      | 5      | 463     
```

---

## 4. Key Limitations & Operational Constraints

1. **Mixed Class is Unreliable for Autonomous Routing**:
   - Total dataset contains only 7 Mixed documents (126 crops).
   - Test set contains only 18 crops from 1 single document.
   - Resulting F1 is 0.00%. Mixed regions MUST NOT rely on single-engine routing.
2. **Other-Class Behavior**:
   - Other-class has high precision (99.36%) but limited recall (59.82%).
   - Only discard regions if Other confidence is $\ge 0.90$.
3. **Production Feature Flag**:
   - `REGION_ROUTER_ENABLED=false` is enforced in production.
   - All uncertain or mixed regions MUST default to dual-engine execution (`PADDLEOCR` + `RxHandBD-v1`).

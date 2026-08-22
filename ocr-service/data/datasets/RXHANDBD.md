# RxHandBD: Handwritten Medical Prescription Word Recognition Dataset

## 1. Dataset Provenance & Metadata

| Attribute | Details |
| :--- | :--- |
| **Dataset Name** | **RxHandBD** (Handwritten Medical Prescription Words Dataset) |
| **Primary Domain** | Healthcare Optical Character Recognition (OCR) / Handwritten Text Recognition (HTR) |
| **Dataset Format** | Cropped word-level handwritten prescription images with ground-truth transcriptions |
| **Kaggle Source** | `roronaozoro007/rxhandbd` |
| **Publisher / Author** | Rafi Ahamed / Mendeley Data Contributors |
| **License** | **MIT License** |
| **Attribution** | RxHandBD Dataset (Rafi Ahamed, Mendeley Data / Kaggle) |
| **Download Date** | August 2026 |

---

## 2. Dataset Architecture & Split

- **Total Labeled Samples:** 5,578 cropped word images
  - **Official Training Set (`train/`):** 4,463 samples (`P1116.jpg` to `P5578.jpg`)
  - **Official Held-Out Test Set (`test/`):** 1,115 samples (`P0001.jpg` to `P1115.jpg`)
  - **Vocabulary File:** `vocabulary.txt` (1,559 unique medical words/terms)
- **Annotations Available:** `train/labels.csv` and `test/labels.csv` with `image` and `label` pairs.

---

## 3. Logical Separation in VaidyaVaani

VaidyaVaani maintains strict dataset isolation:
1. **Dataset A (`kaggle_129`):** 129 full-page difficult doctor prescription scans (unlabeled benchmark / human review set).
2. **Dataset B (`rxhandbd`):** 5,578 labeled word crops used for word-level handwriting recognition fine-tuning.
3. **Annotations DB (`annotations_db.json`):** Dedicated exclusively to human-verified full-prescription clinical data.

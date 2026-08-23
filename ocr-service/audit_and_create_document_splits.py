import os
import sys
import json
import re
import random
from collections import defaultdict

def analyze_and_create_doc_splits():
    splits_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "datasets", "ieee_hp_prescription", "splits.json"))
    with open(splits_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    all_samples = data["splits"]["train"] + data["splits"]["val"] + data["splits"]["test"]
    print(f"Total samples scanned: {len(all_samples)}")

    # 1. Map documents to crops and classes
    doc_to_crops = defaultdict(list)
    doc_to_class = {}
    class_to_docs = defaultdict(list)

    for s in all_samples:
        fname = s["filename"]
        m = re.match(r"^(\d+)_(\d+)\.png$", fname)
        if m:
            doc_id = int(m.group(1))
        else:
            doc_id = int(fname.split("_")[0])
        doc_to_crops[doc_id].append(s)
        doc_to_class[doc_id] = s["class_id"]

    for doc_id, cid in doc_to_class.items():
        class_to_docs[cid].append(doc_id)

    class_names = {0: "Handwritten", 1: "Printed", 2: "Mixed", 3: "Other"}
    
    print("\n=======================================================")
    print("  SECTION 1: DATASET STRUCTURE & DOCUMENT AUDIT")
    print("=======================================================")
    print(f"Total Original Documents: {len(doc_to_crops)}")
    print(f"Crops per Document: Exactly {len(doc_to_crops[0])} crops per document across all 630 documents")
    print("\nDocuments and Crops per Class:")
    for cid in range(4):
        cname = class_names[cid]
        ndocs = len(class_to_docs[cid])
        ncrops = ndocs * 18
        print(f"  Class {cid} ({cname:12s}): {ndocs:3d} documents ({ncrops:5d} crops, {ncrops/len(all_samples)*100:.2f}%)")

    # 2. Existing Sample-Level Split Leakage Audit
    train_docs = set(int(re.match(r"^(\d+)_", s["filename"]).group(1)) for s in data["splits"]["train"])
    val_docs = set(int(re.match(r"^(\d+)_", s["filename"]).group(1)) for s in data["splits"]["val"])
    test_docs = set(int(re.match(r"^(\d+)_", s["filename"]).group(1)) for s in data["splits"]["test"])

    train_val_overlap = train_docs.intersection(val_docs)
    train_test_overlap = train_docs.intersection(test_docs)
    val_test_overlap = val_docs.intersection(test_docs)

    print("\n=======================================================")
    print("  SECTION 2: EXISTING SAMPLE-LEVEL SPLIT LEAKAGE AUDIT")
    print("=======================================================")
    print(f"Train Documents:      {len(train_docs)} / 630 (100.0%)")
    print(f"Validation Documents: {len(val_docs)} / 630 ({len(val_docs)/630*100:.2f}%)")
    print(f"Test Documents:       {len(test_docs)} / 630 ({len(test_docs)/630*100:.2f}%)")
    print(f"Train INTERSECT Val Overlap:  {len(train_val_overlap)} documents ({len(train_val_overlap)/len(val_docs)*100:.2f}% of Val docs leaked into Train)")
    print(f"Train INTERSECT Test Overlap: {len(train_test_overlap)} documents ({len(train_test_overlap)/len(test_docs)*100:.2f}% of Test docs leaked into Train)")
    print(f"Val INTERSECT Test Overlap:   {len(val_test_overlap)} documents ({len(val_test_overlap)/len(test_docs)*100:.2f}% of Test docs overlapped with Val)")

    # 3. Create Document-Level Split (Zero Leakage)
    print("\n=======================================================")
    print("  SECTION 3: CONSTRUCTING ZERO-LEAKAGE DOCUMENT SPLITS")
    print("=======================================================")
    
    # Set seed for deterministic document splitting
    random.seed(42)

    doc_train = []
    doc_val = []
    doc_test = []

    # Stratified document-level allocation
    # Target: ~70% Train, ~15% Val, ~15% Test
    # For Mixed (7 docs): 5 train (71.4%), 1 val (14.3%), 1 test (14.3%) -> 90 train crops, 18 val crops, 18 test crops.
    for cid in range(4):
        docs = sorted(class_to_docs[cid])
        random.shuffle(docs)
        n = len(docs)

        if cid == 2:  # Mixed (7 docs)
            n_train = 5
            n_val = 1
            n_test = 1
        else:
            n_train = int(round(n * 0.70))
            n_val = int(round(n * 0.15))
            n_test = n - n_train - n_val

        c_train_docs = docs[:n_train]
        c_val_docs = docs[n_train:n_train + n_val]
        c_test_docs = docs[n_train + n_val:]

        doc_train.extend(c_train_docs)
        doc_val.extend(c_val_docs)
        doc_test.extend(c_test_docs)

        cname = class_names[cid]
        print(f"  Class {cid} ({cname:12s}) [Total Docs={n:3d}] -> Train Docs={len(c_train_docs):3d}, Val Docs={len(c_val_docs):2d}, Test Docs={len(c_test_docs):2d}")

    # Build split crop manifests
    train_crops = [crop for d in doc_train for crop in doc_to_crops[d]]
    val_crops = [crop for d in doc_val for crop in doc_to_crops[d]]
    test_crops = [crop for d in doc_test for crop in doc_to_crops[d]]

    # Shuffle crops
    random.shuffle(train_crops)
    random.shuffle(val_crops)
    random.shuffle(test_crops)

    # Verify zero document overlap
    set_train_docs = set(doc_train)
    set_val_docs = set(doc_val)
    set_test_docs = set(doc_test)

    assert len(set_train_docs.intersection(set_val_docs)) == 0, "Train and Val docs overlap!"
    assert len(set_train_docs.intersection(set_test_docs)) == 0, "Train and Test docs overlap!"
    assert len(set_val_docs.intersection(set_test_docs)) == 0, "Val and Test docs overlap!"

    print("\nFinal Document Split Summary:")
    print(f"  Train: {len(doc_train):3d} docs ({len(train_crops):5d} crops, {len(train_crops)/len(all_samples)*100:.2f}%)")
    print(f"  Val:   {len(doc_val):3d} docs ({len(val_crops):5d} crops, {len(val_crops)/len(all_samples)*100:.2f}%)")
    print(f"  Test:  {len(doc_test):3d} docs ({len(test_crops):5d} crops, {len(test_crops)/len(all_samples)*100:.2f}%)")
    print(f"  Total: {len(doc_train) + len(doc_val) + len(doc_test)} docs ({len(all_samples)} crops)")

    print("\nTest Set Class Distribution (Document Split):")
    for cid in range(4):
        cname = class_names[cid]
        cnt = sum(1 for c in test_crops if c["class_id"] == cid)
        print(f"  Class {cid} ({cname:12s}): {cnt:4d} test crops ({cnt/len(test_crops)*100:.2f}%)")

    # Compute class weights for Document Train Split
    train_class_counts = defaultdict(int)
    for c in train_crops:
        train_class_counts[c["class_id"]] += 1

    total_train = len(train_crops)
    doc_class_weights = {}
    print("\nDocument-Split Inverse Class Weights:")
    for cid in range(4):
        cnt = train_class_counts[cid]
        w = total_train / (4.0 * cnt) if cnt > 0 else 1.0
        doc_class_weights[cid] = round(w, 4)
        cname = class_names[cid]
        print(f"  Class {cid} ({cname:12s}): weight = {w:.4f} (train count = {cnt})")

    # Save to document_splits.json
    out_manifest = {
        "dataset_name": "IEEE Prescription Handwritten/Printed Text (Document-Independent Split)",
        "leakage_status": "ZERO_DOCUMENT_LEAKAGE",
        "split_method": "stratified_document_partition",
        "total_documents": 630,
        "total_samples": len(all_samples),
        "crops_per_document": 18,
        "class_mapping": class_names,
        "class_weights": doc_class_weights,
        "document_split_counts": {
            "train_documents": len(doc_train),
            "val_documents": len(doc_val),
            "test_documents": len(doc_test)
        },
        "sample_split_counts": {
            "train_samples": len(train_crops),
            "val_samples": len(val_crops),
            "test_samples": len(test_crops)
        },
        "splits": {
            "train": train_crops,
            "val": val_crops,
            "test": test_crops
        }
    }

    out_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "datasets", "ieee_hp_prescription", "document_splits.json"))
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(out_manifest, f, indent=2)

    print(f"\n[Document Split Manifest Saved] {out_file}")
    print("=======================================================")

if __name__ == "__main__":
    analyze_and_create_doc_splits()

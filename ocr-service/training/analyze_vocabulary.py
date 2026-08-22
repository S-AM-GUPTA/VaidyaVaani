import os
import json
import re
from collections import Counter
import pandas as pd
import kagglehub

def analyze_rxhandbd_vocabulary():
    print("===================================================================")
    print("  RxHandBD Medical Vocabulary & Category Analysis")
    print("===================================================================\n")
    
    base_path = kagglehub.dataset_download("roronaozoro007/rxhandbd")
    rx_dir = os.path.join(base_path, "RxHandBD") if os.path.exists(os.path.join(base_path, "RxHandBD")) else base_path
    
    train_csv = os.path.join(rx_dir, "train", "labels.csv")
    test_csv = os.path.join(rx_dir, "test", "labels.csv")
    
    train_df = pd.read_csv(train_csv)
    test_df = pd.read_csv(test_csv)
    
    all_labels = train_df["label"].dropna().astype(str).tolist() + test_df["label"].dropna().astype(str).tolist()
    
    # 1. Frequency Analysis
    label_counts = Counter(all_labels)
    total_labels = len(all_labels)
    unique_labels = len(label_counts)
    
    # 2. Medical Classification Heuristics
    dosage_form_keywords = ["tab", "cap", "syr", "inj", "susp", "drop", "oint", "gel", "cream", "supp", "iv", "im", "solution", "spray", "tablet", "capsule", "syrup"]
    instruction_keywords = ["daily", "bd", "tds", "qid", "od", "hs", "sos", "prn", "ac", "pc", "stat", "after", "before", "meal", "food", "morning", "night", "times", "days", "week", "month", "1-0-1", "1-1-1", "0-0-1", "1-0-0", "0-1-0"]
    strength_pattern = re.compile(r'\d+\s*(?:mg|gm|g|ml|mcg|iu|%|\bmg\b|\bml\b)', re.IGNORECASE)
    
    dosage_labels = []
    instruction_labels = []
    strength_labels = []
    medicine_candidates = []
    other_labels = []
    
    for label, count in label_counts.items():
        l_lower = label.lower().strip()
        
        is_dosage = any(re.search(rf'\b{kw}\b', l_lower) for kw in dosage_form_keywords)
        is_instruction = any(re.search(rf'\b{kw}\b', l_lower) for kw in instruction_keywords)
        is_strength = bool(strength_pattern.search(l_lower))
        
        if is_dosage:
            dosage_labels.append({"label": label, "count": count})
        elif is_instruction:
            instruction_labels.append({"label": label, "count": count})
        elif is_strength:
            strength_labels.append({"label": label, "count": count})
        elif len(label) >= 3 and not re.match(r'^[\d\W_]+$', label):
            medicine_candidates.append({"label": label, "count": count})
        else:
            other_labels.append({"label": label, "count": count})
            
    # Sort top entities
    top_medicines = sorted(medicine_candidates, key=lambda x: x["count"], reverse=True)[:30]
    top_overall = label_counts.most_common(25)
    
    analysis_results = {
        "dataset_name": "RxHandBD",
        "total_label_occurrences": total_labels,
        "unique_vocabulary_terms": unique_labels,
        "top_25_most_frequent_labels": [{"label": k, "frequency": v} for k, v in top_overall],
        "category_breakdown": {
            "medicine_name_candidates_count": len(medicine_candidates),
            "dosage_form_labels_count": len(dosage_labels),
            "instruction_frequency_labels_count": len(instruction_labels),
            "strength_measurement_labels_count": len(strength_labels),
            "other_or_unclassified_count": len(other_labels)
        },
        "sample_medicine_names": [m["label"] for m in top_medicines],
        "sample_dosage_forms": [d["label"] for d in dosage_labels[:15]],
        "sample_clinical_instructions": [i["label"] for i in instruction_labels[:15]]
    }
    
    with open("rxhandbd_vocabulary_analysis.json", "w", encoding="utf-8") as f:
        json.dump(analysis_results, f, indent=2)
        
    print(f"Vocabulary Analysis:")
    print(f" - Total Samples:                {total_labels}")
    print(f" - Unique Vocabulary Words:      {unique_labels}")
    print(f" - Medicine Name Candidates:     {len(medicine_candidates)}")
    print(f" - Dosage Form Terms:            {len(dosage_labels)}")
    print(f" - Instruction / Timing Terms:   {len(instruction_labels)}")
    print(f" - Strength Formats:             {len(strength_labels)}")
    print(f" - Top Medicine Samples:         {', '.join([m['label'] for m in top_medicines[:8]])}")
    print("===================================================================\n")
    return analysis_results

if __name__ == '__main__':
    analyze_rxhandbd_vocabulary()

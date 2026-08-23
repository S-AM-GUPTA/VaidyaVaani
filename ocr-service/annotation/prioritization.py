import re
import difflib
from typing import List, Dict, Any, Optional
from .schema import AnnotationPriority, OCREngineProposal

def clean_ocr_text(text: Optional[str]) -> str:
    """
    Normalizes OCR string for robust semantic similarity comparison.
    """
    if not text:
        return ""
    # Strip trailing punctuation, extra spaces, and lowercase
    t = text.strip().lower()
    t = re.sub(r'[\.\,\:\;\-\_\/\|\\]+$', '', t).strip()
    t = re.sub(r'\s+', ' ', t)
    return t

def calculate_region_priority(proposals: List[Dict[str, Any]]) -> AnnotationPriority:
    """
    Calculates annotation priority from multi-engine OCR proposals.
    Categories:
      - HIGH_AGREEMENT: All three engines produce substantially similar text.
      - PARTIAL_AGREEMENT: Two engines produce similar text while one differs.
      - DISAGREEMENT: All engines produce substantially different outputs.
      - NO_USEFUL_OUTPUT: All engines produce empty, nonsensical, or unusable output.
    """
    if not proposals:
        return AnnotationPriority.NO_USEFUL_OUTPUT

    # Extract text per engine
    paddle_text = ""
    trocr_text = ""
    rx_text = ""

    for prop in proposals:
        engine = prop.get("engine", "").lower()
        txt = clean_ocr_text(prop.get("text", ""))
        if "paddle" in engine:
            paddle_text = txt
        elif "pretrained" in engine or engine == "trocr":
            trocr_text = txt
        elif "rxhandbd" in engine or "finetuned" in engine:
            rx_text = txt
        elif not paddle_text:
            paddle_text = txt

    texts = [t for t in [paddle_text, trocr_text, rx_text] if t]
    
    # Check if all outputs are empty or unusable noise
    valid_texts = [t for t in texts if len(t) >= 2 and not t.isdigit()]
    if not valid_texts:
        return AnnotationPriority.NO_USEFUL_OUTPUT

    # If only 1 engine produced valid output and others are empty
    if len(valid_texts) == 1:
        return AnnotationPriority.DISAGREEMENT

    # Calculate pairwise similarities
    sim_pt = difflib.SequenceMatcher(None, paddle_text, trocr_text).ratio() if (paddle_text and trocr_text) else 0.0
    sim_pr = difflib.SequenceMatcher(None, paddle_text, rx_text).ratio() if (paddle_text and rx_text) else 0.0
    sim_tr = difflib.SequenceMatcher(None, trocr_text, rx_text).ratio() if (trocr_text and rx_text) else 0.0

    threshold = 0.70

    # Check 3-engine agreement
    if sim_pt >= threshold and sim_pr >= threshold and sim_tr >= threshold:
        return AnnotationPriority.HIGH_AGREEMENT

    # Check 2-engine partial agreement
    if sim_pt >= threshold or sim_pr >= threshold or sim_tr >= threshold:
        return AnnotationPriority.PARTIAL_AGREEMENT

    # All engines produce substantially different outputs
    return AnnotationPriority.DISAGREEMENT

def enrich_annotations_with_priorities(annotations_db: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Computes and populates annotation_priority and field defaults across the database.
    Strictly preserves UNREVIEWED status (0 promoted to ground truth).
    """
    for item in annotations_db.values():
        for reg in item.get("regions", []):
            proposals = reg.get("raw_ocr", [])
            priority = calculate_region_priority(proposals)
            reg["annotation_priority"] = priority.value
            
            # Ensure separate visual and normalized medicine fields exist
            if "normalized_medicine" not in reg:
                med = reg.get("medicine", {})
                reg["normalized_medicine"] = med.get("name") if med else None
                reg["strength"] = med.get("strength") if med else None
                reg["dosage_form"] = med.get("dosage") if med else None
                reg["frequency"] = med.get("frequency") if med else None
                reg["timing"] = med.get("timing") if med else None
                reg["duration"] = med.get("duration") if med else None

            if "context_used" not in reg or isinstance(reg["context_used"], str):
                # Convert string context to boolean flag
                reg["context_used"] = False
                
            if "reviewer_confidence" not in reg:
                reg["reviewer_confidence"] = "HIGH"

    return annotations_db

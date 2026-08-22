import re
from typing import List, Dict, Any, Optional
from .abbreviations import normalize_frequency, normalize_timing, extract_duration, DOSAGE_FORMS
from .medicine_matcher import match_medicine

def extract_strength(text: str) -> Optional[str]:
    """
    Extracts medicine strength (e.g. 500mg, 650 mg, 40mg, 25 mcg, 5ml).
    """
    patterns = [
        r'\b(\d+(?:\.\d+)?\s*(?:mg|g|mcg|iu|ml|%))\b',
        r'\b(\d+(?:\/\d+)?\s*mg)\b',
        r'\b([2-9]\d{1,3})\b'  # Bare numeric strength e.g. "650", "500", "40"
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            val = m.group(0).strip()
            if val.isdigit():
                # If only number e.g. 650, format as 650 mg
                if int(val) in [25, 40, 50, 75, 100, 200, 250, 300, 375, 400, 500, 625, 650, 850, 1000]:
                    return f"{val} mg"
            return val
    return None

def extract_form(text: str) -> Optional[str]:
    """
    Extracts dosage form (Tab, Cap, Syrup, Inj, etc.).
    """
    text_lower = text.lower()
    for f in DOSAGE_FORMS:
        if re.search(rf'\b{re.escape(f)}\b', text_lower):
            if f in ['tab', 'tablet', 'tablets']:
                return 'tablet'
            elif f in ['cap', 'capsule', 'capsules']:
                return 'capsule'
            elif f in ['syr', 'syrup']:
                return 'syrup'
            elif f in ['inj', 'injection']:
                return 'injection'
            return f
    return None

def parse_prescription_line(line_text: str, ocr_confidence: float = 0.8) -> Optional[Dict[str, Any]]:
    """
    Parses a single prescription line using deterministic rules, regex, and fuzzy matching.
    """
    if not line_text.strip() or len(line_text.strip()) < 3:
        return None
        
    raw = line_text.strip()
    
    # 1. Extract Form
    form = extract_form(raw) or 'tablet'
    
    # 2. Extract Strength
    strength = extract_strength(raw)
    
    # 3. Extract Frequency
    freq_res = normalize_frequency(raw)
    frequency = freq_res[0] if freq_res else 'as prescribed'
    freq_conf = freq_res[1] if freq_res else 0.5
    
    # 4. Extract Timing
    timing = normalize_timing(raw)
    
    # 5. Extract Duration
    duration = extract_duration(raw)
    
    # 6. Extract Medicine Name Candidates
    # Remove dosage numbers, frequencies, and durations from medicine search query
    clean_med_query = raw
    if strength:
        clean_med_query = clean_med_query.replace(strength, ' ')
    clean_med_query = re.sub(r'\b(?:1-0-1|1-1-1|1-0-0|0-0-1|od|bd|tds|qid|hs|sos)\b', ' ', clean_med_query, flags=re.I)
    clean_med_query = re.sub(r'\b\d+\s*(?:days?|weeks?|months?|d|w)\b', ' ', clean_med_query, flags=re.I)
    clean_med_query = re.sub(r'\b(?:tab|cap|syr|inj|tablets?|capsules?)\b', ' ', clean_med_query, flags=re.I)
    clean_med_query = re.sub(r'[^a-zA-Z0-9\s\-]', ' ', clean_med_query).strip()
    
    matches = match_medicine(clean_med_query if len(clean_med_query) >= 3 else raw)
    
    if not matches:
        # If no fuzzy match found, do not hallucinate a medicine
        return None
        
    top_match = matches[0]
    matched_med_name = top_match['name']
    matched_generic = top_match['generic_name']
    match_similarity = top_match['similarity']
    
    # Default strength from DB if not detected in line
    if not strength and top_match.get('strengths'):
        strength = top_match['strengths'][0]
        
    # Compute composite recognition confidence
    composite_confidence = round((ocr_confidence * 0.4) + (match_similarity * 0.45) + (freq_conf * 0.15), 4)
    needs_verification = composite_confidence < 0.85
    
    return {
        "raw_text": line_text,
        "name": matched_med_name,
        "generic_name": matched_generic,
        "matched_term": top_match['matched_term'],
        "strength": strength or "Standard",
        "form": form,
        "dosage": f"1 {form}",
        "frequency": frequency,
        "timing": timing,
        "duration": duration,
        "purpose": top_match.get('indications', ['Prescribed medical therapy'])[0] if top_match.get('indications') else 'Prescribed medical therapy',
        "similarity": match_similarity,
        "ocr_confidence": ocr_confidence,
        "confidence": composite_confidence,
        "needs_verification": needs_verification,
        "candidates": [
            {"name": m["name"], "generic": m["generic_name"], "similarity": m["similarity"]} 
            for m in matches[:3]
        ]
    }

def parse_prescription_document(extracted_lines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Parses full document extracted lines into structured medication list.
    """
    medicines = []
    seen_generics = set()
    
    for line in extracted_lines:
        text = line.get('text', '')
        conf = float(line.get('confidence', 0.8))
        
        parsed = parse_prescription_line(text, conf)
        if parsed:
            generic = parsed['generic_name']
            if generic not in seen_generics:
                seen_generics.add(generic)
                medicines.append(parsed)
                
    return medicines

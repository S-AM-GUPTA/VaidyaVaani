import re
from typing import Dict, Optional, Tuple

FREQUENCY_MAP: Dict[str, str] = {
    'od': 'once daily',
    'o.d.': 'once daily',
    'qd': 'once daily',
    'q.d.': 'once daily',
    'once daily': 'once daily',
    'once a day': 'once daily',
    
    'bd': 'twice daily',
    'b.d.': 'twice daily',
    'bid': 'twice daily',
    'b.i.d.': 'twice daily',
    'twice daily': 'twice daily',
    'twice a day': 'twice daily',
    
    'tds': 'three times daily',
    't.d.s.': 'three times daily',
    'tid': 'three times daily',
    't.i.d.': 'three times daily',
    'thrice daily': 'three times daily',
    'three times a day': 'three times daily',
    
    'qid': 'four times daily',
    'q.i.d.': 'four times daily',
    'four times daily': 'four times daily',
    
    'sos': 'as needed (when required)',
    's.o.s.': 'as needed (when required)',
    'prn': 'as needed',
    'p.r.n.': 'as needed',
    
    'hs': 'at bedtime',
    'h.s.': 'at bedtime',
    'qhs': 'at bedtime',
    'bedtime': 'at bedtime',
    'at night': 'at bedtime',
    
    'stat': 'immediately (single dose)',
    'q4h': 'every 4 hours',
    'q6h': 'every 6 hours',
    'q8h': 'every 8 hours',
    'q12h': 'every 12 hours',
    'weekly': 'once weekly',
    'alternate day': 'alternate days'
}

NUMERIC_PATTERN_MAP: Dict[str, str] = {
    '1-0-0': 'once daily (morning)',
    '0-1-0': 'once daily (afternoon)',
    '0-0-1': 'once daily (night)',
    '1-0-1': 'twice daily (morning & night)',
    '1-1-0': 'twice daily (morning & afternoon)',
    '0-1-1': 'twice daily (afternoon & night)',
    '1-1-1': 'three times daily (morning, afternoon & night)',
    '1-1-1-1': 'four times daily',
    '1/2-0-0': 'half tablet once daily (morning)',
    '0-0-1/2': 'half tablet once daily (night)',
    '1/2-0-1/2': 'half tablet twice daily',
    '2-0-2': '2 tablets twice daily'
}

TIMING_MAP: Dict[str, str] = {
    'ac': 'before food (empty stomach)',
    'a.c.': 'before food (empty stomach)',
    'empty stomach': 'before food (empty stomach)',
    'bbf': 'before breakfast',
    'before meal': 'before meals',
    'before food': 'before food',
    
    'pc': 'after food',
    'p.c.': 'after food',
    'after meal': 'after food',
    'after food': 'after food',
    'post meal': 'after food',
    
    'wf': 'with food',
    'with meals': 'with meals',
    'with food': 'with food'
}

DOSAGE_FORMS = [
    'tab', 'tablet', 'tablets',
    'cap', 'capsule', 'capsules',
    'syr', 'syrup',
    'inj', 'injection',
    'oint', 'ointment',
    'gel', 'cream',
    'drop', 'drops', 'eye drops', 'ear drops',
    'susp', 'suspension',
    'inhaler', 'respule', 'rotacap',
    'granules', 'sachet', 'powder'
]

def normalize_frequency(text: str) -> Optional[Tuple[str, float]]:
    """
    Normalizes Latin or numeric dosage frequencies.
    Returns (normalized_frequency, confidence).
    """
    text_lower = text.lower().strip()
    
    # Check numeric dosage shorthand (e.g. 1-0-1, 1-1-1)
    num_match = re.search(r'\b([012]|1/2)\s*-\s*([012]|1/2)\s*-\s*([012]|1/2)(?:\s*-\s*([012]|1/2))?\b', text_lower)
    if num_match:
        pattern = num_match.group(0).replace(' ', '')
        if pattern in NUMERIC_PATTERN_MAP:
            return NUMERIC_PATTERN_MAP[pattern], 0.95
            
    # Check Latin abbreviations (e.g. BD, TDS, OD)
    tokens = re.findall(r'\b[a-zA-Z\.]+\b', text_lower)
    for tok in tokens:
        if tok in FREQUENCY_MAP:
            return FREQUENCY_MAP[tok], 0.92
            
    return None

def normalize_timing(text: str) -> Optional[str]:
    """
    Normalizes meal and timing instructions.
    """
    text_lower = text.lower()
    for key, val in TIMING_MAP.items():
        if re.search(rf'\b{re.escape(key)}\b', text_lower):
            return val
    return None

def extract_duration(text: str) -> Optional[str]:
    """
    Extracts duration if present (e.g. "x 5 days", "for 7 days", "10 d", "1 month", "2 weeks").
    """
    patterns = [
        r'(?:x|for|duration)?\s*(\d+\s*(?:days?|d|weeks?|wks?|w|months?|m))\b',
        r'(\d+)\s*(?:days?|d\b)',
        r'(\d+)\s*(?:weeks?|wks?|w\b)',
        r'(\d+)\s*(?:months?|m\b)'
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            dur = m.group(0).strip().lower()
            dur = re.sub(r'^(?:x|for)\s*', '', dur)
            # Expand single-letter abbreviations
            dur = re.sub(r'\b(\d+)\s*d\b', r'\1 days', dur)
            dur = re.sub(r'\b(\d+)\s*w(?:ks?)?\b', r'\1 weeks', dur)
            dur = re.sub(r'\b(\d+)\s*m\b', r'\1 months', dur)
            return dur
    return None

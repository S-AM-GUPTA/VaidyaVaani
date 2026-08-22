import json
import os
from typing import List, Dict, Any, Optional

try:
    from rapidfuzz import fuzz
except ImportError:
    # Fallback to difflib
    import difflib
    class FuzzFallback:
        @staticmethod
        def ratio(s1: str, s2: str) -> float:
            return difflib.SequenceMatcher(None, s1.lower(), s2.lower()).ratio() * 100
        @staticmethod
        def token_sort_ratio(s1: str, s2: str) -> float:
            t1 = " ".join(sorted(s1.lower().split()))
            t2 = " ".join(sorted(s2.lower().split()))
            return difflib.SequenceMatcher(None, t1, t2).ratio() * 100
    fuzz = FuzzFallback()

_MEDICINES_DB: List[Dict[str, Any]] = []

def load_medicines_db() -> List[Dict[str, Any]]:
    global _MEDICINES_DB
    if _MEDICINES_DB:
        return _MEDICINES_DB
        
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'medicines.json')
    try:
        if os.path.exists(data_path):
            with open(data_path, 'r', encoding='utf-8') as f:
                _MEDICINES_DB = json.load(f)
                print(f"[Medicine Matcher] Loaded {len(_MEDICINES_DB)} reference medicines.")
    except Exception as e:
        print(f"[Medicine Matcher] Error loading medicines database: {e}")
        
    return _MEDICINES_DB

def match_medicine(query: str, threshold: float = 0.68) -> List[Dict[str, Any]]:
    """
    Fuzzy matches an OCR extracted text candidate against the medical database.
    """
    db = load_medicines_db()
    if not db or not query.strip():
        return []
        
    query_clean = query.lower().strip()
    # Remove form prefixes like "Tab", "Cap", "Syr"
    for prefix in ['tab ', 'tab. ', 'cap ', 'cap. ', 'syr ', 'syr. ', 'inj ', 'inj. ']:
        if query_clean.startswith(prefix):
            query_clean = query_clean[len(prefix):].strip()
            
    matches = []
    
    for item in db:
        generic = item.get('generic_name', '')
        brands = item.get('brand_names', [])
        aliases = item.get('common_spellings', [])
        
        all_terms = [generic] + brands + aliases
        best_score = 0.0
        best_term = generic
        
        for term in all_terms:
            t_clean = term.lower().strip()
            # Calculate token sort & ratio scores
            score_ratio = fuzz.ratio(query_clean, t_clean) / 100.0
            score_token = fuzz.token_sort_ratio(query_clean, t_clean) / 100.0
            
            # Exact substring bonus
            bonus = 0.0
            if len(query_clean) >= 3 and query_clean in t_clean:
                bonus = 0.1
            elif len(t_clean) >= 3 and t_clean in query_clean:
                bonus = 0.1
                
            score = max(score_ratio, score_token) + bonus
            score = min(1.0, score)
            
            if score > best_score:
                best_score = score
                best_term = term
                
        if best_score >= threshold:
            matches.append({
                "name": item.get('brand_names', [generic])[0] if item.get('brand_names') else generic,
                "generic_name": generic,
                "matched_term": best_term,
                "similarity": round(best_score, 4),
                "strengths": item.get('strengths', []),
                "forms": item.get('forms', []),
                "indications": item.get('indications', [])
            })
            
    # Sort descending by similarity
    matches.sort(key=lambda x: x['similarity'], reverse=True)
    return matches

from typing import Dict, Any, List

def calculate_overall_confidence(medicines: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes overall document recognition confidence and verification necessity.
    """
    if not medicines:
        return {
            "overall_confidence": 0.0,
            "needs_verification": True,
            "confidence_tier": "LOW",
            "medicine_count": 0
        }
        
    scores = [m.get('confidence', 0.5) for m in medicines]
    avg_score = sum(scores) / len(scores)
    
    # Check if any single critical medication has low confidence (< 0.75)
    has_uncertain_med = any(m.get('confidence', 0.5) < 0.75 or m.get('needs_verification', False) for m in medicines)
    
    tier = "HIGH" if avg_score >= 0.90 and not has_uncertain_med else ("MEDIUM" if avg_score >= 0.70 else "LOW")
    needs_verification = avg_score < 0.85 or has_uncertain_med
    
    return {
        "overall_confidence": round(avg_score, 4),
        "needs_verification": needs_verification,
        "confidence_tier": tier,
        "medicine_count": len(medicines)
    }

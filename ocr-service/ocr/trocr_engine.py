import numpy as np
from typing import List, Dict, Any, Optional
from models.trocr_model import recognize_handwriting, is_trocr_available
from preprocessing.image_processor import crop_box

def recognize_trocr_lines(image: np.ndarray, detected_boxes: List[Any]) -> List[Dict[str, Any]]:
    """
    Runs TrOCR inference on detected region crops.
    """
    if not is_trocr_available():
        return []
        
    trocr_results = []
    
    for idx, box in enumerate(detected_boxes):
        crop = crop_box(image, box)
        if crop is None or crop.size == 0:
            continue
            
        h, w = crop.shape[:2]
        # Ignore very small artifacts
        if h < 8 or w < 12:
            continue
            
        text, confidence = recognize_handwriting(crop)
        if text.strip():
            trocr_results.append({
                "text": text.strip(),
                "confidence": confidence,
                "box": box if not isinstance(box, np.ndarray) else box.tolist(),
                "engine": "trocr",
                "line_index": idx
            })
            
    return trocr_results

import numpy as np
from typing import List, Dict, Any, Union, Optional
from paddleocr import PaddleOCR
import cv2

_paddle_ocr_instance: Optional[PaddleOCR] = None

def get_paddle_ocr() -> PaddleOCR:
    global _paddle_ocr_instance
    if _paddle_ocr_instance is None:
        print("[PaddleOCR Engine] Initializing PaddleOCR instance...")
        try:
            _paddle_ocr_instance = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)
        except Exception:
            _paddle_ocr_instance = PaddleOCR(use_textline_orientation=True, lang='en', enable_mkldnn=False)
        print("[PaddleOCR Engine] PaddleOCR initialized successfully.")
    return _paddle_ocr_instance

def is_paddle_available() -> bool:
    try:
        return get_paddle_ocr() is not None
    except Exception:
        return False

def recognize_paddle(image_input: Union[str, np.ndarray]) -> Dict[str, Any]:
    """
    Executes PaddleOCR on image input and returns structured line candidates with bounding boxes.
    """
    ocr = get_paddle_ocr()
    lines: List[Dict[str, Any]] = []
    
    try:
        # If numpy array passed, save temporary or pass directly
        result = ocr.ocr(image_input)
        
        if result:
            for res in result:
                if not res:
                    continue
                # Handle PaddleX dictionary format
                if isinstance(res, dict) and 'rec_texts' in res:
                    texts = res.get('rec_texts', [])
                    scores = res.get('rec_scores', [0.8] * len(texts))
                    boxes = res.get('dt_polys', res.get('rec_polys', res.get('rec_boxes', [])))
                    
                    for idx, (txt, score) in enumerate(zip(texts, scores)):
                        if txt.strip():
                            box_data = None
                            if idx < len(boxes):
                                b = boxes[idx]
                                box_data = b.tolist() if isinstance(b, np.ndarray) else b
                            lines.append({
                                "text": txt.strip(),
                                "confidence": round(float(score), 4),
                                "box": box_data,
                                "engine": "paddleocr"
                            })
                # Handle classic list format [[box, (text, score)], ...]
                elif isinstance(res, list):
                    for item in res:
                        if isinstance(item, (list, tuple)) and len(item) == 2:
                            box = item[0]
                            text_score = item[1]
                            if isinstance(text_score, (list, tuple)) and len(text_score) >= 2:
                                txt = text_score[0]
                                score = text_score[1]
                                if txt.strip():
                                    box_data = box.tolist() if isinstance(box, np.ndarray) else box
                                    lines.append({
                                        "text": txt.strip(),
                                        "confidence": round(float(score), 4),
                                        "box": box_data,
                                        "engine": "paddleocr"
                                    })
    except Exception as e:
        print(f"[PaddleOCR Engine] Recognition failed: {e}")

    full_text = "\n".join(l["text"] for l in lines)
    return {
        "engine": "paddleocr",
        "lines": lines,
        "raw_text": full_text
    }

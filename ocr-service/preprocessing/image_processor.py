import cv2
import numpy as np
import os
import fitz  # PyMuPDF
from typing import Dict, List, Tuple, Optional, Union

def load_image(image_input: Union[str, bytes, np.ndarray]) -> Optional[np.ndarray]:
    """
    Safely loads an image from a file path, raw bytes, or existing numpy array.
    """
    try:
        if isinstance(image_input, np.ndarray):
            return image_input
        elif isinstance(image_input, bytes):
            nparr = np.frombuffer(image_input, np.uint8)
            return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        elif isinstance(image_input, str):
            if not os.path.exists(image_input):
                return None
            return cv2.imread(image_input)
    except Exception as e:
        print(f"[Preprocessing] Failed to load image: {e}")
        return None

def deskew_image(gray: np.ndarray) -> np.ndarray:
    """
    Corrects slight skew in scanned prescription documents.
    """
    try:
        coords = np.column_stack(np.where(gray < 240))
        if len(coords) < 100:
            return gray
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        if abs(angle) > 20 or abs(angle) < 0.5:
            return gray
        (h, w) = gray.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated
    except Exception:
        return gray

def generate_variants(img: np.ndarray) -> Dict[str, np.ndarray]:
    """
    Generates tailored image preprocessing variants for both printed OCR and handwriting recognition.
    """
    variants: Dict[str, np.ndarray] = {'original': img}
    
    try:
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
            
        variants['grayscale'] = gray
        
        # 1. CLAHE Enhancement (High Local Contrast for light ink/pencil)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        clahe_enhanced = clahe.apply(gray)
        variants['clahe'] = clahe_enhanced
        
        # 2. Mild Denoised (Removes scanner paper noise while preserving thin strokes)
        denoised = cv2.fastNlMeansDenoising(clahe_enhanced, None, h=10, templateWindowSize=7, searchWindowSize=21)
        variants['denoised'] = denoised
        
        # 3. Adaptive Threshold (Good for faded background prescription pads)
        adaptive_thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 11
        )
        variants['threshold'] = adaptive_thresh
        
        # 4. Deskewed
        deskewed = deskew_image(gray)
        variants['deskewed'] = deskewed
        
    except Exception as e:
        print(f"[Preprocessing] Error generating variants: {e}")
        
    return variants

def crop_box(img: np.ndarray, box: Union[List, np.ndarray]) -> Optional[np.ndarray]:
    """
    Crops a bounding box/polygon region from the image with small padding.
    """
    try:
        if isinstance(box, np.ndarray):
            box = box.tolist()
            
        # If polygon of 4 points [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
        if len(box) == 4 and isinstance(box[0], (list, tuple)):
            xs = [pt[0] for pt in box]
            ys = [pt[1] for pt in box]
            xmin, xmax = int(max(0, min(xs))), int(min(img.shape[1], max(xs)))
            ymin, ymax = int(max(0, min(ys))), int(min(img.shape[0], max(ys)))
        elif len(box) == 4:
            # [xmin, ymin, xmax, ymax]
            xmin, ymin, xmax, ymax = int(box[0]), int(box[1]), int(box[2]), int(box[3])
        else:
            return None
            
        # Add small 2px padding
        h, w = img.shape[:2]
        xmin = max(0, xmin - 2)
        ymin = max(0, ymin - 2)
        xmax = min(w, xmax + 2)
        ymax = min(h, ymax + 2)
        
        if xmax <= xmin or ymax <= ymin:
            return None
            
        return img[ymin:ymax, xmin:xmax]
    except Exception as e:
        print(f"[Preprocessing] Crop box error: {e}")
        return None

def render_pdf_pages(pdf_path: str, max_pages: int = 3, zoom: float = 2.0) -> List[np.ndarray]:
    """
    Renders PDF pages to high-resolution OpenCV images for OCR.
    """
    images = []
    try:
        doc = fitz.open(pdf_path)
        mat = fitz.Matrix(zoom, zoom)
        for i in range(min(len(doc), max_pages)):
            page = doc.load_page(i)
            pix = page.get_pixmap(matrix=mat)
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
            if pix.n == 4:  # RGBA to BGR
                img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
            elif pix.n == 3:  # RGB to BGR
                img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            images.append(img)
    except Exception as e:
        print(f"[Preprocessing] PDF rendering failed: {e}")
    return images

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from paddleocr import PaddleOCR
import os
import cv2
import numpy as np
import fitz

app = FastAPI()

print("Initializing PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)
print("PaddleOCR Initialized.")

class OCRRequest(BaseModel):
    file_path: str

def enhance_image(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            return image_path
            
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply mild CLAHE
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # Denoise (mild)
        enhanced = cv2.fastNlMeansDenoising(enhanced, None, 10, 7, 21)
        
        enhanced_path = image_path + "_enhanced.jpg"
        cv2.imwrite(enhanced_path, enhanced)
        return enhanced_path
    except Exception as e:
        print(f"Enhancement failed: {e}")
        return image_path

@app.post("/extract")
async def extract_text(request: OCRRequest):
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        extracted_lines = []
        
        if request.file_path.lower().endswith('.pdf'):
            try:
                doc = fitz.open(request.file_path)
                for page in doc:
                    text = page.get_text()
                    if text:
                        for line in text.split('\n'):
                            if line.strip():
                                extracted_lines.append({"text": line.strip(), "confidence": 1.0})
            except Exception as e:
                print(f"PyMuPDF direct extraction failed: {e}")
                
        # If it is an image, or a scanned PDF with no embedded digital text
        if len(extracted_lines) < 5:
            extracted_lines = []
            
            enhanced_path = request.file_path
            if not request.file_path.lower().endswith('.pdf'):
                enhanced_path = enhance_image(request.file_path)
                
            result = ocr.ocr(enhanced_path)
            
            if result:
                for res in result:
                    if not res: continue
                    # Handle if it's PaddleX dict format
                    if isinstance(res, dict) and 'rec_texts' in res:
                        scores = res.get('rec_scores', [0.8] * len(res['rec_texts']))
                        for txt, score in zip(res['rec_texts'], scores):
                            if txt.strip():
                                extracted_lines.append({"text": txt.strip(), "confidence": float(score)})
                    # Handle normal PaddleOCR list of tuples format: [[box, (text, score)], ...]
                    elif isinstance(res, list):
                        for line in res:
                            if isinstance(line, (list, tuple)) and len(line) == 2:
                                txt, score = line[1]
                                if txt.strip():
                                    extracted_lines.append({"text": txt.strip(), "confidence": float(score)})
                        
        return {"extracted_lines": extracted_lines}
    except Exception as e:
        print(f"OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "paddleocr"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

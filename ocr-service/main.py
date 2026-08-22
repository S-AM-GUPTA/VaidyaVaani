import os
import time
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import fitz

# Modular pipeline imports
from preprocessing.image_processor import load_image, generate_variants, render_pdf_pages
from ocr.paddle_engine import recognize_paddle, is_paddle_available
from ocr.trocr_engine import recognize_trocr_lines
from models.trocr_model import is_trocr_available, get_device
from medical.prescription_parser import parse_prescription_document
from confidence.scorer import calculate_overall_confidence

app = FastAPI(
    title="VaidyaVaani Intelligent Prescription OCR Service",
    version="2.0.0",
    description="Hybrid PaddleOCR + TrOCR Handwriting Recognition & Medical Normalization Pipeline"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OCRRequest(BaseModel):
    file_path: str

def process_prescription_pipeline(file_path_or_bytes, is_pdf: bool = False) -> Dict[str, Any]:
    """
    Core hybrid OCR + handwriting + medical normalization pipeline.
    """
    start_time = time.time()
    
    extracted_lines: List[Dict[str, Any]] = []
    
    # 1. Handle PDF
    if is_pdf:
        # Check if direct digital text exists in PDF
        if isinstance(file_path_or_bytes, str) and os.path.exists(file_path_or_bytes):
            try:
                doc = fitz.open(file_path_or_bytes)
                for page in doc:
                    text = page.get_text()
                    if text:
                        for line in text.split('\n'):
                            if line.strip():
                                extracted_lines.append({
                                    "text": line.strip(),
                                    "confidence": 1.0,
                                    "engine": "digital_pdf",
                                    "box": None
                                })
            except Exception as e:
                print(f"[OCR Pipeline] PyMuPDF digital extract failed: {e}")
                
        # If scanned PDF with no digital text, render pages to images
        if len(extracted_lines) < 3 and isinstance(file_path_or_bytes, str):
            pdf_images = render_pdf_pages(file_path_or_bytes)
            for page_img in pdf_images:
                paddle_res = recognize_paddle(page_img)
                extracted_lines.extend(paddle_res.get('lines', []))
    else:
        # 2. Handle Image
        img = load_image(file_path_or_bytes)
        if img is None:
            raise ValueError("Invalid or unreadable image input")
            
        variants = generate_variants(img)
        
        # Run PaddleOCR on enhanced/original image
        paddle_target = variants.get('clahe', variants.get('original', img))
        paddle_res = recognize_paddle(paddle_target)
        paddle_lines = paddle_res.get('lines', [])
        extracted_lines.extend(paddle_lines)
        
        # Run TrOCR handwriting recognition on detected boxes if TrOCR is available
        if is_trocr_available() and paddle_lines:
            boxes = [l.get('box') for l in paddle_lines if l.get('box') is not None]
            # Prioritize ambiguous lines or sample lines
            if boxes:
                trocr_lines = recognize_trocr_lines(img, boxes[:5])
                for tr in trocr_lines:
                    extracted_lines.append({
                        "text": tr["text"],
                        "confidence": tr["confidence"],
                        "engine": "trocr",
                        "box": tr.get("box")
                    })
                    
    # 3. Medical Parsing & Normalization
    medicines = parse_prescription_document(extracted_lines)
    
    # 4. Multi-signal Confidence Scoring
    confidence_data = calculate_overall_confidence(medicines)
    
    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    
    return {
        "success": True,
        "extracted_lines": extracted_lines,
        "raw_text": "\n".join(l["text"] for l in extracted_lines),
        "prescription": {
            "medicines": medicines,
            "overall_confidence": confidence_data["overall_confidence"],
            "needs_verification": confidence_data["needs_verification"],
            "confidence_tier": confidence_data["confidence_tier"]
        },
        "overall_confidence": confidence_data["overall_confidence"],
        "needs_verification": confidence_data["needs_verification"],
        "timing_ms": elapsed_ms
    }

@app.post("/extract")
async def extract_text(request: OCRRequest):
    """
    Backward-compatible endpoint for existing Node.js backend.
    """
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        is_pdf = request.file_path.lower().endswith('.pdf')
        result = process_prescription_pipeline(request.file_path, is_pdf=is_pdf)
        return {
            "extracted_lines": result["extracted_lines"],
            "prescription": result["prescription"],
            "overall_confidence": result["overall_confidence"],
            "needs_verification": result["needs_verification"]
        }
    except Exception as e:
        print(f"[OCR Service Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

class AnalyzeRequest(BaseModel):
    file_path: Optional[str] = None

@app.post("/prescription/analyze")
async def analyze_prescription(
    request: Optional[AnalyzeRequest] = None,
    file_path: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Dedicated intelligent prescription analysis endpoint supporting JSON payload, form data, and multipart uploads.
    """
    try:
        target_path = (request.file_path if request and request.file_path else file_path)
        
        if file is not None:
            contents = await file.read()
            is_pdf = file.filename.lower().endswith('.pdf') if file.filename else False
            result = process_prescription_pipeline(contents, is_pdf=is_pdf)
            return result
        elif target_path:
            if not os.path.exists(target_path):
                raise HTTPException(status_code=404, detail="File path not found")
            is_pdf = target_path.lower().endswith('.pdf')
            result = process_prescription_pipeline(target_path, is_pdf=is_pdf)
            return result
        else:
            raise HTTPException(status_code=400, detail="Must provide either file upload or file_path in body/form")
    except Exception as e:
        print(f"[Prescription Analyze Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """
    Health check reporting status of all subcomponents.
    """
    return {
        "status": "ok",
        "service": "prescription-ocr",
        "version": "2.0.0",
        "device": get_device(),
        "components": {
            "paddleocr": is_paddle_available(),
            "trocr": is_trocr_available(),
            "medical_parser": True,
            "preprocessing": True
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

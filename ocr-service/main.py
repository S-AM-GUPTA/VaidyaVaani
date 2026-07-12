from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from paddleocr import PaddleOCR
import os

app = FastAPI()

# Initialize PaddleOCR
# use_angle_cls=True helps with rotated text
# lang="en" for English, you can add "hi" for Hindi if needed, though English is usually standard for reports
print("Initializing PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en')
print("PaddleOCR Initialized.")

class OCRRequest(BaseModel):
    file_path: str

@app.post("/extract")
async def extract_text(request: OCRRequest):
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # Run OCR
        result = ocr.ocr(request.file_path, cls=True)
        
        # Extract just the text from the result
        # result is a list of lines, where each line is a list of [box, (text, score)]
        extracted_text = ""
        
        if result and result[0]:
            for line in result[0]:
                text = line[1][0]
                extracted_text += text + "\n"
                
        return {"extracted_text": extracted_text.strip()}
    except Exception as e:
        print(f"OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "paddleocr"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

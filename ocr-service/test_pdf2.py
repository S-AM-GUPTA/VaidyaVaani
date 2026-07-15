import fitz
import cv2
import numpy as np
from paddleocr import PaddleOCR

print("Init PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)

pdf_path = r"E:\vaidyavaani\server\uploads\file-1783933142075-810272937.pdf"
extracted_text = ""

try:
    doc = fitz.open(pdf_path)
    print(f"Opened PDF, {len(doc)} pages.")
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        if pix.n == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_BGRA2BGR)
        elif pix.n == 1:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
            
        print(f"Running OCR on image shape {img_array.shape}...")
        result = ocr.ocr(img_array)
        
        print(f"Raw Result Type: {type(result)}")
        if result:
            print(f"Raw Result Len: {len(result)}")
            
        if result and result[0]:
            print(f"Result[0] type: {type(result[0])}")
            for line in result[0]:
                extracted_text += line[1][0] + "\n"
        print("Done page", page_num)
except Exception as e:
    print("ERROR:", e)

print("--- EXTRACTED TEXT ---")
print(extracted_text)

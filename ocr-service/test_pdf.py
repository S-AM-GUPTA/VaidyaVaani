from paddleocr import PaddleOCR
import json

print("Initializing PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)
print("PaddleOCR Initialized.")

pdf_path = r"E:\vaidyavaani\server\uploads\file-1783933142075-810272937.pdf"

print("Running OCR on PDF...")
result = ocr.ocr(pdf_path)

print("--- RAW RESULT TYPE ---")
print(type(result))
print("--- RAW RESULT LENGTH ---")
print(len(result) if result else 0)

extracted_text = ""
if result:
    for i, page in enumerate(result):
        print(f"--- PAGE {i} TYPE ---")
        print(type(page))
        if page:
            for j, line in enumerate(page):
                print(f"  Line {j} type: {type(line)}")
                try:
                    text = line[1][0]
                    extracted_text += text + "\n"
                except Exception as e:
                    print(f"  Error on line {j}: {e}, Content: {line}")

print("--- EXTRACTED TEXT ---")
print(extracted_text)

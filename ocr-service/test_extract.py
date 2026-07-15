import sys
import traceback
from paddleocr import PaddleOCR

try:
    print("Init PaddleOCR...")
    ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)
    
    file_path = r"E:\vaidyavaani\server\uploads\file-1783954854043-377971479.jpeg"
    extracted_text = ""
    
    print("Running OCR...")
    result = ocr.ocr(file_path)
    
    if result:
        print("Iterating result...")
        for res in result:
            if res:
                print("res type:", type(res))
                # print("res dict:", getattr(res, '__dict__', res))
                
                # Check how to access rec_texts safely
                if hasattr(res, 'get'):
                    print("has get")
                if 'rec_texts' in res:
                    print("rec_texts in res")
                    extracted_text += "\n".join(res['rec_texts']) + "\n"
                elif hasattr(res, 'rec_texts'):
                    print("hasattr rec_texts")
                    extracted_text += "\n".join(res.rec_texts) + "\n"
                elif isinstance(res, dict) and 'rec_texts' in res:
                    print("is dict and rec_texts in res")
                    extracted_text += "\n".join(res['rec_texts']) + "\n"
                else:
                    print("Could not find rec_texts. Available keys/attrs:", dir(res))
                    
    print("Final Extracted Text:")
    print(extracted_text)
except Exception as e:
    print("CRASHED:", e)
    traceback.print_exc()

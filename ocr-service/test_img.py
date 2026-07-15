from paddleocr import PaddleOCR

print("Init PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)

img_path = r"E:\vaidyavaani\server\uploads\file-1783953900263-663283158.jpeg"
print("Running OCR...")
result = ocr.ocr(img_path)

print(f"Result type: {type(result)}")
if result:
    print(f"Result length: {len(result)}")
    print(f"Result[0] type: {type(result[0])}")
    
    # Try different extraction methods
    try:
        text = ""
        for page in result:
            if page:
                for line in page:
                    text += line[1][0] + "\n"
        print("--- PAGE LOOP METHOD SUCCESS ---")
    except Exception as e:
        print("PAGE LOOP ERROR:", e)
        
    try:
        text = ""
        for res in result:
            text += res['text'] + "\n"
        print("--- DICT METHOD SUCCESS ---")
    except Exception as e:
        print("DICT ERROR:", e)

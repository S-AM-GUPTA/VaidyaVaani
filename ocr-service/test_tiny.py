import numpy as np
import cv2
from paddleocr import PaddleOCR

# Create tiny 100x100 white image
img = np.ones((100, 100, 3), dtype=np.uint8) * 255
cv2.putText(img, "TEST", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)
cv2.imwrite("tiny.jpg", img)

print("Init PaddleOCR...")
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)

print("Running OCR...")
result = ocr.ocr("tiny.jpg")
print("RESULT DUMP:", result)
if result:
    res = result[0]
    print("KEYS/ATTRS:", dir(res))
    if hasattr(res, 'keys'):
        print("DICT KEYS:", res.keys())

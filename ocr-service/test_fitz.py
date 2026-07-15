import fitz

pdf_path = r"E:\vaidyavaani\server\uploads\file-1783933142075-810272937.pdf"

try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    print("--- EXTRACTED PDF TEXT ---")
    print(text)
    print("--- TEXT LENGTH ---")
    print(len(text.strip()))
except Exception as e:
    print("ERROR:", e)

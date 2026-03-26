import sys

def extract_text(pdf_path):
    try:
        import fitz  # PyMuPDF
        print("Using PyMuPDF")
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except ImportError:
        try:
            from PyPDF2 import PdfReader
            print("Using PyPDF2")
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except ImportError:
            print("Please install PyMuPDF (pip install pymupdf) or PyPDF2 (pip install PyPDF2)")
            return None

if __name__ == "__main__":
    import json
    import os
    
    docs_dir = "documentos"
    output_dir = "recursos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    extracted_data = {}
    
    for filename in os.listdir(docs_dir):
        if filename.endswith(".pdf"):
            filepath = os.path.join(docs_dir, filename)
            print(f"Extracting {filepath}...")
            text = extract_text(filepath)
            
            if text:
                basename = os.path.splitext(filename)[0]
                out_path = os.path.join(output_dir, f"{basename}.txt")
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(text)
                print(f"Saved to {out_path}")
                extracted_data[basename] = ""
            else:
                sys.exit(1)
    
    # We could also export a JS variable if needed:
    with open(os.path.join(output_dir, "content.js"), "w", encoding="utf-8") as js_file:
        js_file.write("const pdfContent = {};\n")
        # I'll just skip the full js payload for now until I confirm extraction works.

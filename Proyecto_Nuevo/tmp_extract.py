import sys
import PyPDF2

def extract_text(pdf_path, out_path):
    print(f"Reading {pdf_path}...")
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"\n\n--- Page {i+1} ---\n\n" + page_text
        
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extracted {len(text)} characters to {out_path}.")
        if len(text.strip()) < 100:
            print("WARNING: Extracted text is very short. Might be an image-based PDF requiring OCR.")
    except Exception as e:
        print(f"Failed to read {pdf_path}: {e}")

if __name__ == "__main__":
    extract_text("c:/Users/Harold Ordoñez/Documents/GitHub/FisicaIII_Cuaderno3/documentos/OndasEstacionarias.pdf", "c:/Users/Harold Ordoñez/Documents/GitHub/FisicaIII_Cuaderno3/Proyecto_Nuevo/ondas_ext.md")
    extract_text("c:/Users/Harold Ordoñez/Documents/GitHub/FisicaIII_Cuaderno3/documentos/interferencias de ondas.pdf", "c:/Users/Harold Ordoñez/Documents/GitHub/FisicaIII_Cuaderno3/Proyecto_Nuevo/interf_ext.md")

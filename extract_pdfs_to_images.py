import fitz  # PyMuPDF
import os

docs_dir = "documentos"
output_dir = "recursos"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename in os.listdir(docs_dir):
    if filename.endswith(".pdf"):
        filepath = os.path.join(docs_dir, filename)
        print(f"Extracting images from {filepath}...")
        
        doc = fitz.open(filepath)
        basename = os.path.splitext(filename)[0]
        
        # Create a specific folder for this PDF's images
        pdf_output_dir = os.path.join(output_dir, basename)
        if not os.path.exists(pdf_output_dir):
            os.makedirs(pdf_output_dir)
            
        zoom_x = 2.0  # horizontal zoom
        zoom_y = 2.0  # vertical zoom
        mat = fitz.Matrix(zoom_x, zoom_y)  # zoom factor 2 in each dimension

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(matrix=mat)
            output_filepath = os.path.join(pdf_output_dir, f"page_{page_num + 1}.png")
            pix.save(output_filepath)
            print(f"Saved {output_filepath}")

print("Extraction complete.")

import os
import sys
import json
import urllib.request

API_KEY = "AIzaSyC2uOo0JrbhEhv9ZRx1r4KMh4TMc0v6RY0"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def analyze_document_with_rest(pdf_path, prompt):
    print(f"Uploading and analyzing {pdf_path}...")
    
    # Check if we should upload it through v1beta/files API first.
    # Actually, base64 encoding the PDF inline is simpler for REST if it's small,
    # but Gemini doesn't support inlineData for application/pdf directly in the standard text endpoint
    # without using the File API. Let's try base64 inline with inlineData.
    import base64
    with open(pdf_path, "rb") as f:
        pdf_data = f.read()
    b64_pdf = base64.b64encode(pdf_data).decode('utf-8')
    
    payload = {
        "contents": [{
            "parts": [
                {
                    "inlineData": {
                        "mimeType": "application/pdf",
                        "data": b64_pdf
                    }
                },
                {"text": prompt}
            ]
        }],
        "generationConfig": {"temperature": 0.2}
    }
    
    req = urllib.request.Request(API_URL, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Error calling Gemini for {pdf_path}: {e}")
        try:
           err_response = e.read().decode('utf-8')
           print(err_response)
        except:
           pass
        return None

if __name__ == "__main__":
    prompt = "Extrae todo el texto, fórmulas y contenido educativo de este PDF y formatea la salida exhaustivamente en Markdown estructurado. Asegúrate de rodear las ecuaciones matemáticas con $$ para bloques y \\( \\) para inline (LaTeX). Extrae absolutamente toda la información, no omitas párrafos. Esto es para crear un cuaderno web estructurado."
    
    pdf1 = "../documentos/OndasEstacionarias.pdf"
    res1 = analyze_document_with_rest(pdf1, prompt)
    if res1:
        with open("ondas_ext.md", "w", encoding="utf-8") as f: f.write(res1)
        print("Written ondas_ext.md")
        
    pdf2 = "../documentos/interferencias de ondas.pdf"
    res2 = analyze_document_with_rest(pdf2, prompt)
    if res2:
        with open("interf_ext.md", "w", encoding="utf-8") as f: f.write(res2)
        print("Written interf_ext.md")

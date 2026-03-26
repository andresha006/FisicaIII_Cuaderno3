import os
import base64
import json
import urllib.request
import time

API_KEY = "AIzaSyC2uOo0JrbhEhv9ZRx1r4KMh4TMc0v6RY0"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def transcribe(image_path):
    base64_img = encode_image(image_path)
    # The prompt explicitly asks to transcribe the handwritten/scanned text EXACTLY, without omitting anything.
    prompt = "Transcribe todo el texto, fórmulas y contenido de esta página de un cuaderno de física de ondas exactamente como aparece. Usa formato Markdown. Las fórmulas enciérralas en $ o $$. Si hay gráficos, solo descríbelos brevemente en corchetes [Ejemplo: gráfico de una onda]."
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {
                    "mime_type": "image/png",
                    "data": base64_img
                }}
            ]
        }],
        "generationConfig": {
            "temperature": 0.2
        }
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    
    try:
        with urllib.request.urlopen(req) as f:
            resp = json.loads(f.read().decode('utf-8'))
            return resp['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Error transcribing {image_path}: {e}")
        return "\n[Error en transcripción de página]\n"

folders = [
    {"name": "OndasEstacionarias", "path": "recursos/OndasEstacionarias", "count": 10},
    {"name": "interferencias", "path": "recursos/interferencias de ondas", "count": 11}
]

for folder in folders:
    output_md = f"recursos/{folder['name']}.md"
    print(f"Iniciando transcripción para {folder['name']}...")
    
    content_acum = f"# {folder['name'].replace('Ondas', ' Ondas ')}\n\n"
    
    # Iterate through pages 1 to count
    for i in range(1, folder['count'] + 1):
        img_file = os.path.join(folder['path'], f"page_{i}.png")
        if os.path.exists(img_file):
            print(f" - Transcribing {img_file}...")
            text = transcribe(img_file)
            content_acum += f"\n\n<!-- PAGE {i} -->\n\n{text}\n\n---\n"
            time.sleep(1) # simple rate limit pause
            
    with open(output_md, "w", encoding="utf-8") as out_file:
        out_file.write(content_acum)
    print(f"Escrito: {output_md}")
    
print("Transcripcion completa!")

import json, os

files = {
    "ondas": "recursos/OndasEstacionarias.md",
    "interferencias": "recursos/interferencias.md"
}

js_out = "const NOTEBOOK_CONTENT = {};\n"

for key, path in files.items():
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    js_out += 'NOTEBOOK_CONTENT["' + key + '"] = ' + json.dumps(text) + ";\n"

with open("content.js", "w", encoding="utf-8") as out:
    out.write(js_out)

print("content.js generated successfully")

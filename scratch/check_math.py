import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
M = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"

for idx in [80, 81, 82, 83, 84, 85, 86, 87]:
    p = root.findall(f".//{W}p")[idx]
    math_els = p.findall(f".//{M}oMath") + p.findall(f".//{M}oMathPara")
    drawings = p.findall(f".//{W}drawing")
    texts = "".join([t.text for t in p.findall(f".//{W}t") if t.text])
    math_texts = "".join([t.text for t in p.findall(f".//{M}t") if t.text])
    print(f"P{idx}: texts='{texts}' | math_texts='{math_texts}' | has_math={len(math_els) > 0} | has_drawing={len(drawings) > 0}")

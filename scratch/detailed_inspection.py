import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

print("=== HEADINGS ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    if txt in ["INTRODUCTION", "METHOD", "RESULTS AND DISCUSSION", "CONCLUSION", "REFERENCES"] or (len(txt) > 3 and txt[0].isdigit() and txt[1] in [".", " "]):
        pPr = p.find(f"{W}pPr")
        ind = {k: pPr.find(f"{W}ind").attrib.get(f"{W}{k}") for k in ["left", "right", "firstLine", "hanging"]} if pPr is not None and pPr.find(f"{W}ind") is not None else {}
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        sp = {k: pPr.find(f"{W}spacing").attrib.get(f"{W}{k}") for k in ["before", "after", "line"]} if pPr is not None and pPr.find(f"{W}spacing") is not None else {}
        print(f"P{i:03d}: '{txt}' | align={jc} | ind={ind} | sp={sp}")

print("\n=== EQUATIONS ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    if "(" in txt and ")" in txt and len(txt) <= 6:
        print(f"P{i:03d}: '{txt}'")
        for j in range(max(0, i-2), min(len(root.findall(f".//{W}p")), i+3)):
            pj = root.findall(f".//{W}p")[j]
            tj = "".join([t.text for t in pj.findall(f".//{W}t") if t.text]).strip()
            print(f"   P{j:03d}: '{tj[:60]}'")

print("\n=== FIGURES & CAPTIONS ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    if txt.startswith("Figure") or txt.startswith("Fig."):
        pPr = p.find(f"{W}pPr")
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        print(f"P{i:03d}: '{txt}' | align={jc}")

print("\n=== TABLES & CAPTIONS ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    if txt.startswith("Table") or txt.startswith("Tabel"):
        pPr = p.find(f"{W}pPr")
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        print(f"P{i:03d}: '{txt}' | align={jc}")

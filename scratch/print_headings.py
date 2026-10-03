import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

print("=== HEADINGS LIST ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if txt in ["INTRODUCTION", "METHOD", "RESULTS AND DISCUSSION", "CONCLUSION", "REFERENCES"] or (len(txt) > 3 and txt[0].isdigit() and (txt[1] in [".", " "] or (len(txt) > 2 and txt[1].isdigit() and txt[2] in [".", " "]))):
        pPr = p.find(f"{W}pPr")
        ind = {k: pPr.find(f"{W}ind").attrib.get(f"{W}{k}") for k in ["left", "hanging", "firstLine"]} if pPr is not None and pPr.find(f"{W}ind") is not None else {}
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        sp = {k: pPr.find(f"{W}spacing").attrib.get(f"{W}{k}") for k in ["before", "after", "line"]} if pPr is not None and pPr.find(f"{W}spacing") is not None else {}
        print(f"P{i:03d}: '{txt}' | jc={jc} | ind={ind} | sp={sp}")

print("\n=== EQUATIONS CLOSE INSPECTION ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if txt in ["(1)", "(2)", "(3)", "(4)", "(5)"]:
        pPr = p.find(f"{W}pPr")
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        print(f"Equation Num P{i:03d}: '{txt}' | jc={jc}")
        for offset in [-2, -1, 0, 1]:
            curr_p = root.findall(f".//{W}p")[i+offset]
            ctext = "".join([t.text for t in curr_p.findall(f".//{W}t") if t.text]).strip()
            print(f"   offset {offset} (P{i+offset:03d}): '{ctext}'")

print("\n=== REFERENCES CLOSE INSPECTION ===")
ref_started = False
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if txt == "REFERENCES":
        ref_started = True
        continue
    if ref_started and txt.startswith("["):
        pPr = p.find(f"{W}pPr")
        ind = {k: pPr.find(f"{W}ind").attrib.get(f"{W}{k}") for k in ["left", "hanging", "firstLine"]} if pPr is not None and pPr.find(f"{W}ind") is not None else {}
        jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
        sp = {k: pPr.find(f"{W}spacing").attrib.get(f"{W}{k}") for k in ["before", "after", "line"]} if pPr is not None and pPr.find(f"{W}spacing") is not None else {}
        print(f"Ref P{i:03d}: '{txt[:70]}...' | jc={jc} | ind={ind} | sp={sp}")
        if i > 220:
            break

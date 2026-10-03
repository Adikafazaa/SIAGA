import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")
    styles_xml = z.read("word/styles.xml")

root = ET.fromstring(doc_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

def print_p_details(p, label=""):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    pPr = p.find(f"{W}pPr")
    jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
    sp = {k: pPr.find(f"{W}spacing").attrib.get(f"{W}{k}") for k in ["before", "after", "line", "lineRule"]} if pPr is not None and pPr.find(f"{W}spacing") is not None else {}
    ind = {k: pPr.find(f"{W}ind").attrib.get(f"{W}{k}") for k in ["left", "right", "firstLine", "hanging"]} if pPr is not None and pPr.find(f"{W}ind") is not None else {}
    
    runs = p.findall(f".//{W}r")
    fonts = set()
    sizes = set()
    bolds = set()
    italics = set()
    for r in runs:
        rPr = r.find(f"{W}rPr")
        if rPr is not None:
            rf = rPr.find(f"{W}rFonts")
            if rf is not None:
                f = rf.attrib.get(f"{W}ascii") or rf.attrib.get(f"{W}hAnsi")
                if f: fonts.add(f)
            sz = rPr.find(f"{W}sz")
            if sz is not None:
                sizes.add(int(sz.attrib.get(f"{W}val")) / 2)
            if rPr.find(f"{W}b") is not None and rPr.find(f"{W}b").attrib.get(f"{W}val") != "0":
                bolds.add(True)
            if rPr.find(f"{W}i") is not None and rPr.find(f"{W}i").attrib.get(f"{W}val") != "0":
                italics.add(True)
    print(f"[{label}] text: '{txt[:70]}'")
    print(f"   align: {jc}, spacing: {sp}, ind: {ind}")
    print(f"   fonts: {list(fonts)}, sizes: {list(sizes)}, bold: {bool(bolds)}, italic: {bool(italics)}")

print("=== 1. TITLE & AUTHORS ===")
for i in range(5):
    print_p_details(root.findall(f".//{W}p")[i], f"P{i}")

print("\n=== 2. TABLES IN DOCUMENT ===")
tables = root.findall(f".//{W}tbl")
print(f"Total tables: {len(tables)}")
for idx, tbl in enumerate(tables):
    tblPr = tbl.find(f"{W}tblPr")
    tblW = tblPr.find(f"{W}tblW") if tblPr is not None else None
    tblBorders = tblPr.find(f"{W}tblBorders") if tblPr is not None else None
    borders_info = {}
    if tblBorders is not None:
        for b_name in ["top", "left", "bottom", "right", "insideH", "insideV"]:
            b_el = tblBorders.find(f"{W}{b_name}")
            if b_el is not None:
                borders_info[b_name] = b_el.attrib.get(f"{W}val")
    print(f"Table {idx+1}: width={tblW.attrib if tblW is not None else 'auto'}, borders={borders_info}")
    
    # print first row / cells
    rows = tbl.findall(f".//{W}tr")
    print(f"  Rows count: {len(rows)}")
    if rows:
        r0 = rows[0]
        cells = r0.findall(f".//{W}tc")
        cell_texts = ["".join([t.text for t in c.findall(f".//{W}t") if t.text]).strip() for c in cells]
        print(f"  Row 0 cells ({len(cells)}): {cell_texts[:5]}")

print("\n=== 3. CAPTIONS & FIGURES ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if txt.startswith("Figure") or txt.startswith("Table") or txt.startswith("Gambar") or txt.startswith("Tabel"):
        print_p_details(p, f"Caption P{i}")

print("\n=== 4. HEADINGS DETAIL ===")
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if txt in ["INTRODUCTION", "METHOD", "RESEARCH METHOD", "RESULTS AND DISCUSSION", "CONCLUSION", "REFERENCES", "ACKNOWLEDGEMENTS"] or any(txt.startswith(f"{n}.") for n in range(1, 10)):
        print_p_details(p, f"Heading P{i}")

print("\n=== 5. REFERENCES SAMPLES ===")
ref_started = False
count = 0
for i, p in enumerate(root.findall(f".//{W}p")):
    txt = "".join([t.text for t in p.findall(f".//{W}t") if t.text]).strip()
    if "REFERENCES" in txt:
        ref_started = True
        continue
    if ref_started and txt and count < 5:
        print_p_details(p, f"Ref {count+1}")
        count += 1

import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")
    styles_xml = z.read("word/styles.xml")

root = ET.fromstring(doc_xml)
styles_root = ET.fromstring(styles_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

paragraphs = root.findall(f".//{W}p")
print(f"Total paragraphs: {len(paragraphs)}")

# Let's inspect all tables
tables_el = root.findall(f".//{W}tbl")
print(f"Total tables: {len(tables_el)}")

# Inspect drawing/images
drawings = root.findall(f".//{W}drawing")
print(f"Total drawings: {len(drawings)}")

print("\n--- DETAILED PARAGRAPH ANALYSIS ---")
for i, p in enumerate(paragraphs):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    if not txt:
        # Check if there is an image in this paragraph
        if p.find(f".//{W}drawing") is not None:
            print(f"P{i:03d} [IMAGE/DRAWING HERE]")
        continue
    
    pPr = p.find(f"{W}pPr")
    style_val = "Normal"
    if pPr is not None:
        pStyle = pPr.find(f"{W}pStyle")
        if pStyle is not None:
            style_val = pStyle.attrib.get(f"{W}val", "Normal")
            
    jc = pPr.find(f"{W}jc") if pPr is not None else None
    align = jc.attrib.get(f"{W}val") if jc is not None else "left"
    
    sp = pPr.find(f"{W}spacing") if pPr is not None else None
    sp_dict = {}
    if sp is not None:
        for k in ["before", "after", "line", "lineRule"]:
            v = sp.attrib.get(f"{W}{k}")
            if v:
                sp_dict[k] = v
                
    ind = pPr.find(f"{W}ind") if pPr is not None else None
    ind_dict = {}
    if ind is not None:
        for k in ["left", "right", "firstLine", "hanging"]:
            v = ind.attrib.get(f"{W}{k}")
            if v:
                ind_dict[k] = v
                
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
            if rPr.find(f"{W}b") is not None:
                bolds.add(True)
            if rPr.find(f"{W}i") is not None:
                italics.add(True)
                
    # Print interesting paragraphs
    is_interesting = (
        i < 30 or
        style_val != "Normal" or
        "Figure" in txt or "Table" in txt or "Gambar" in txt or "Tabel" in txt or
        any(txt.startswith(f"{n}.") for n in range(1, 10)) or
        any(txt.startswith(f"{n} ") for n in range(1, 10)) or
        txt.isupper() or
        "INTRODUCTION" in txt or "METHOD" in txt or "RESULT" in txt or "CONCLUSION" in txt or "REFERENCES" in txt
    )
    if is_interesting:
        print(f"P{i:03d} [{style_val}] (align={align}, sp={sp_dict}, ind={ind_dict}, sz={list(sizes)}, font={list(fonts)}, b={bool(bolds)}, i={bool(italics)}): {txt[:80]}")

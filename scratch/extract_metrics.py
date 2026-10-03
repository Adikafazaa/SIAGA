import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")
    styles_xml = z.read("word/styles.xml")

root = ET.fromstring(doc_xml)
styles_root = ET.fromstring(styles_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

def get_p_info(p):
    texts = [t.text for t in p.findall(f".//{W}t") if t.text]
    txt = "".join(texts).strip()
    pPr = p.find(f"{W}pPr")
    jc = pPr.find(f"{W}jc").attrib.get(f"{W}val") if pPr is not None and pPr.find(f"{W}jc") is not None else "left"
    sp = {k: pPr.find(f"{W}spacing").attrib.get(f"{W}{k}") for k in ["before", "after", "line", "lineRule"]} if pPr is not None and pPr.find(f"{W}spacing") is not None else {}
    ind = {k: pPr.find(f"{W}ind").attrib.get(f"{W}{k}") for k in ["left", "right", "firstLine", "hanging"]} if pPr is not None and pPr.find(f"{W}ind") is not None else {}
    
    runs = p.findall(f".//{W}r")
    fonts, sizes, bolds, italics = set(), set(), set(), set()
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
    return {
        "txt": txt,
        "jc": jc,
        "sp": sp,
        "ind": ind,
        "fonts": list(fonts),
        "sizes": list(sizes),
        "bold": bool(bolds),
        "italic": bool(italics)
    }

print("=== CHECKING SECTIONS & PARAGRAPHS ===")
# 1. Title
p0 = root.findall(f".//{W}p")[0]
print("TITLE:", get_p_info(p0))

# 2. Authors
p1 = root.findall(f".//{W}p")[1]
print("AUTHORS:", get_p_info(p1))

# 3. Affiliation
p2 = root.findall(f".//{W}p")[2]
print("AFFILIATION:", get_p_info(p2))

# 4. Standard Body Paragraphs
for i, p in enumerate(root.findall(f".//{W}p")):
    info = get_p_info(p)
    if "The development of Artificial Intelligence" in info["txt"]:
        print("BODY P1 (Intro):", info)
    elif "Figure 6. SanitiX-AI" in info["txt"]:
        print("FIG 6 CAPTION:", info)
    elif "Figure 7. Text Extraction" in info["txt"]:
        print("FIG 7 CAPTION:", info)
    elif "Table 1. Computational" in info["txt"]:
        print("TABLE 1 CAPTION:", info)
    elif "Table 2. Computational" in info["txt"]:
        print("TABLE 2 CAPTION:", info)
    elif info["txt"] == "INTRODUCTION":
        print("HEADING 1 (Intro):", info)
    elif info["txt"] == "METHOD":
        print("HEADING 1 (Method):", info)
    elif "3.1.  VLM Text Extraction" in info["txt"]:
        print("HEADING 2 (3.1):", info)
    elif info["txt"] == "CONCLUSION":
        print("HEADING 1 (Conclusion):", info)
    elif info["txt"] == "REFERENCES":
        print("HEADING 1 (References):", info)

# 5. Check Table 2 properties
tbl2 = root.findall(f".//{W}tbl")[1]
tblPr = tbl2.find(f"{W}tblPr")
tblBorders = tblPr.find(f"{W}tblBorders") if tblPr is not None else None
borders = {}
if tblBorders is not None:
    for b in tblBorders:
        tag = b.tag.split("}")[-1]
        borders[tag] = {k.split("}")[-1]: v for k, v in b.attrib.items()}
print("TABLE 2 BORDERS:", borders)

# Check cell fonts in Table 2
tc_runs = tbl2.findall(f".//{W}tc/{W}p/{W}r")
t_fonts, t_sizes, t_bolds = set(), set(), set()
for r in tc_runs:
    rPr = r.find(f"{W}rPr")
    if rPr is not None:
        rf = rPr.find(f"{W}rFonts")
        if rf is not None: t_fonts.add(rf.attrib.get(f"{W}ascii"))
        sz = rPr.find(f"{W}sz")
        if sz is not None: t_sizes.add(int(sz.attrib.get(f"{W}val")) / 2)
        if rPr.find(f"{W}b") is not None: t_bolds.add(True)
print("TABLE 2 CELL RUNS: fonts=", t_fonts, "sizes=", t_sizes, "bold=", t_bolds)

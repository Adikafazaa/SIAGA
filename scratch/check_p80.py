import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\references\Draft JURNAL PII - Eng Version.docx"
with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
M = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"

p80 = root.findall(f".//{W}p")[80]
for child in p80:
    tag = child.tag.split("}")[-1]
    print(tag, child.attrib)
    if tag == "pPr":
        for c in child:
            print("  pPr child:", c.tag.split("}")[-1], c.attrib)
    elif tag == "r":
        t = child.find(f"{W}t")
        print("  r text:", t.text if t is not None else None)
    elif "Math" in tag:
        print("  math:", ET.tostring(child, encoding='unicode')[:100])

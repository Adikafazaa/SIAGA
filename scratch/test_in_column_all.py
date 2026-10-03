import docx
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import win32com.client
import pypdf
import pypdfium2 as pdfium
import re
from pathlib import Path

BASE_DIR = Path(r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal")
SOURCE_MD = BASE_DIR / "PROPOSAL_SIAGA_DRAFT.md"

# Test script to see how the entire document looks when ALL elements are in-column (no section breaks in body)
# Column width = 8.1 cm

raw_md = SOURCE_MD.read_text(encoding="utf-8")
lines = raw_md.splitlines()

doc = Document()

# Cover
sec1 = doc.sections[0]
sec1.page_width = Cm(21.0)
sec1.page_height = Cm(29.7)
sec1.top_margin = Cm(2.5)
sec1.bottom_margin = Cm(2.5)
sec1.left_margin = Cm(2.5)
sec1.right_margin = Cm(2.5)

p = doc.add_paragraph("PROPOSAL INOVASI SIAGA")
p.runs[0].bold = True

# Body
sec2 = doc.add_section()
sec2.top_margin = Cm(2.0)
sec2.bottom_margin = Cm(2.0)
sec2.left_margin = Cm(2.0)
sec2.right_margin = Cm(2.0)
cols = parse_xml(r'<w:cols %s w:num="2" w:space="397"/>' % nsdecls('w'))
sec2._sectPr.append(cols)

# We want usable column width = 8.1 cm
COL_W = 8.1

table_col_widths = {
    1: [1.8, 2.0, 2.1, 2.2],      # Table 1: 4 cols (8.1 cm)
    2: [2.0, 1.8, 4.3],           # Table 2: 3 cols (8.1 cm)
    3: [2.2, 3.2, 2.7],           # Table 3: 3 cols (8.1 cm)
    4: [2.1, 1.6, 1.4, 1.6, 1.4], # Table 4: 5 cols (8.1 cm)
    5: [1.8, 1.4, 0.9, 0.9, 1.4, 1.0, 0.7], # Table 5: 7 cols (8.1 cm)
    6: [1.6, 2.1, 1.1, 1.1, 1.1, 1.1],      # Table 6: 6 cols (8.1 cm)
    7: [2.2, 2.9, 3.0],           # Table 7: 3 cols (8.1 cm)
    8: [1.8, 3.5, 2.8],           # Table 8: 3 cols (8.1 cm)
}

print("Testing in-column configuration...")

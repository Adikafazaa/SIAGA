import docx
from docx import Document
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import win32com.client
import pypdf
import pypdfium2 as pdfium

doc = Document()

# Cover (1-column)
sec1 = doc.sections[0]
sec1.top_margin = Cm(2.5)
sec1.bottom_margin = Cm(2.5)
sec1.left_margin = Cm(2.0)
sec1.right_margin = Cm(2.0)
p = doc.add_paragraph("COVER PAGE (1 Column)")
p.runs[0].bold = True

# Body (2-column continuous section)
sec2 = doc.add_section()
sec2.top_margin = Cm(2.0)
sec2.bottom_margin = Cm(2.0)
sec2.left_margin = Cm(2.0)
sec2.right_margin = Cm(2.0)
cols = parse_xml(r'<w:cols %s w:num="2" w:space="397"/>' % nsdecls('w'))
sec2._sectPr.append(cols)

# Column 1 text
for i in range(4):
    p = doc.add_paragraph(f"Paragraph {i+1} in 2-column section. " * 8)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

# Add image inside column (width = 7.8 cm)
p_img = doc.add_paragraph()
p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_img.add_run().add_picture(r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\figures\figure_4_crescendo_trajectory.png", width=Cm(7.8))

p_cap = doc.add_paragraph("Gambar 4. Kurva trajektori momentum CIM (Mt).")
p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Add table inside column (total width = 7.8 cm)
table = doc.add_table(rows=3, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
col_w = [2.2, 2.8, 2.8]
for r_idx, row in enumerate(table.rows):
    for c_idx, cell in enumerate(row.cells):
        cell.width = Cm(col_w[c_idx])
        cell.paragraphs[0].text = f"R{r_idx}C{c_idx}"

for i in range(12):
    p = doc.add_paragraph(f"Paragraph after table {i+1} in 2-column section. " * 8)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

out_docx = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\scratch\test_in_column.docx"
out_pdf = r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\scratch\test_in_column.pdf"
doc.save(out_docx)

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
wb = word.Documents.Open(out_docx)
wb.SaveAs(out_pdf, FileFormat=17)
wb.Close()
word.Quit()

pdf = pdfium.PdfDocument(out_pdf)
print(f"Total pages: {len(pdf)}")
img = pdf[1].render(scale=2.0).to_pil()
img.save(r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\scratch\preview_pages\test_in_col_p2.png")
print("Rendered test_in_col_p2.png successfully!")

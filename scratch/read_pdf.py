import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader(r"D:\KULIAH-1\ITENAS\HackNusa\Prototype\SIAGA\Knowledge\Docs\proposal\PROPOSAL_SIAGA_FINAL.pdf")
print("Total pages:", len(reader.pages))
for i, page in enumerate(reader.pages):
    print(f"\n=== PAGE {i+1} ===")
    lines = page.extract_text().split("\n")
    for line in lines[:8]:
        if line.strip():
            print("  ", line.strip())

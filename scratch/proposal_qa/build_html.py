from pathlib import Path
import base64
import html
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SOURCE = HERE / "revised.md"
FIGURE = ROOT / "Knowledge/Docs/proposal/figures/figure_1_verified_architecture.png"
OUT = HERE / "proposal.html"

md = SOURCE.read_text(encoding="utf-8").replace("\\pagebreak", "")
md = re.sub(r"figures/[^)]+\.png", lambda m: f"data:image/png;base64,{base64.b64encode((ROOT / 'Knowledge/Docs/proposal' / m.group()).read_bytes()).decode()}", md)
tmp = HERE / "html_source.md"
tmp.write_text(md, encoding="utf-8")
pandoc = "C:/Users/Adika/AppData/Local/Pandoc/pandoc.exe"
body = subprocess.check_output([pandoc, "-f", "markdown", "-t", "html5", str(tmp)], text=True, encoding="utf-8")
match = re.search(r'<h1[^>]*id="chapter-1[^"]*"[^>]*>', body)
if not match:
    raise SystemExit("chapter 1 not found")
body = '<div class="cover">' + body[:match.start()] + '</div>' + body[match.start():]
css = """
@page { size: A4; margin: 19mm 20mm 18mm 20mm; }
html, body { margin:0; padding:0; }
body { font-family: Arial, sans-serif; color:#1c2b36; font-size:10.2pt; line-height:1.16; }
.cover { height:235mm; text-align:center; display:flex; flex-direction:column; justify-content:center; }
.cover h1 { font-size:25pt; line-height:1.12; color:#152d44; margin:0 0 12mm; break-before:auto; }
.cover h2 { font-size:13pt; font-weight:normal; color:#485766; margin:0 0 25mm; }
.cover p { font-size:11pt; line-height:1.45; margin:5mm 0; }
h1 { color:#152d44; font-size:14pt; line-height:1.12; margin:0 0 5mm; break-before:auto; break-after:avoid; }
h1[id^="chapter-"] { break-before:page; }
h2 { color:#244c6e; font-size:10.8pt; margin:4.5mm 0 2mm; break-after:avoid; }
p { margin:0 0 2.6mm; text-align:justify; orphans:2; widows:2; }
strong { font-weight:700; }
table { border-collapse:collapse; width:100%; font-size:8.6pt; line-height:1.11; margin:2mm 0 3mm; table-layout:fixed; break-inside:avoid; }
th,td { border:0.35pt solid #d9d9d9; padding:1.8mm 2mm; vertical-align:middle; overflow-wrap:anywhere; }
th { background:#dce9f2; text-align:left; }
tr { break-inside:avoid; }
tr:nth-child(odd) td { background:#f8fafc; }
figure { margin:3mm 0 2mm; text-align:center; break-inside:avoid; }
figure img { max-width:100%; width:100%; height:auto; }
p > img { display:block; width:100%; max-width:100%; height:auto; object-fit:contain; }
figcaption { font-size:8.5pt; line-height:1.1; margin-top:1mm; text-align:center; }
p:has(+ table) { margin-bottom:1.5mm; break-after:avoid; }
h2#referensi ~ p { font-size:9pt; line-height:1.08; margin-bottom:2mm; text-align:left; }
h2#referensi { break-before:page; font-size:14pt; color:#152d44; margin-top:0; }
a { color:#245b85; text-decoration:none; overflow-wrap:anywhere; }
code { font-family:Consolas, monospace; font-size:8.2pt; }
"""
OUT.write_text(f'<!doctype html><html><head><meta charset="utf-8"><title>Proposal SIAGA</title><style>{css}</style></head><body>{body}</body></html>', encoding="utf-8")
print(OUT)

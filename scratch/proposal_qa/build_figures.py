from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "Knowledge/Docs/proposal/figures"
OUT.mkdir(parents=True, exist_ok=True)

# Formal Academic Grayscale & Slate Palette
DARK = "#0f172a"        # Deep slate/black for primary text & headers
SLATE = "#334155"       # Slate gray for subheaders, arrows & emphasis
MUTED = "#475569"       # Muted slate for descriptions & notes
LINE = "#cbd5e1"        # Subtle border lines
BOX_BG = "#f8fafc"      # Clean neutral off-white fill for containers
CARD_BG = "#ffffff"     # Pure white for cards inside containers
BADGE_BG = "#f1f5f9"    # Light slate-gray for badge chips
BORDER = "#94a3b8"      # Crisp gray outline
BORDER_DARK = "#475569" # Strong border for focal points

def font(size, bold=False):
    return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf", size)

def text_center(draw, xy, content, size=38, color=DARK, bold=False, spacing=8):
    draw.multiline_text(xy, content, font=font(size, bold), fill=color, anchor="mm", align="center", spacing=spacing)

def box(draw, xy, fill=BOX_BG, stroke=LINE, radius=24, width=3):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=stroke, width=width)

def arrow(draw, x0, y0, x1, y1, color=SLATE, width=7):
    draw.line((x0, y0, x1, y1), fill=color, width=width)
    if x1 >= x0 and abs(x1 - x0) >= abs(y1 - y0):
        draw.polygon([(x1, y1), (x1 - 24, y1 - 15), (x1 - 24, y1 + 15)], fill=color)
    elif y1 >= y0:
        draw.polygon([(x1, y1), (x1 - 15, y1 - 24), (x1 + 15, y1 - 24)], fill=color)

def avatar(draw, cx, cy, color=SLATE):
    draw.ellipse((cx - 22, cy - 42, cx + 22, cy + 2), fill=color)
    draw.rounded_rectangle((cx - 42, cy + 10, cx + 42, cy + 64), radius=20, fill=color)

def shield(draw, cx, cy, color=SLATE):
    points = [(cx, cy - 60), (cx + 58, cy - 38), (cx + 50, cy + 30), (cx, cy + 70), (cx - 50, cy + 30), (cx - 58, cy - 38)]
    draw.polygon(points, fill=color)
    draw.line((cx - 25, cy + 1, cx - 5, cy + 21, cx + 30, cy - 21), fill="white", width=10, joint="curve")

def database(draw, cx, cy, color=SLATE):
    draw.rounded_rectangle((cx - 52, cy - 38, cx + 52, cy + 52), radius=12, fill=color)
    draw.ellipse((cx - 52, cy - 55, cx + 52, cy - 15), fill="#64748b", outline=color, width=4)
    draw.arc((cx - 52, cy - 17, cx + 52, cy + 23), 0, 180, fill="white", width=4)

def architecture():
    im = Image.new("RGB", (2400, 1160), "white")
    d = ImageDraw.Draw(im)
    text_center(d, (1200, 58), "JALUR PESAN LIVE DAN BATAS DATA", 48, bold=True)
    d.text((60, 108), "1  Masuk", font=font(30, True), fill=SLATE)
    d.text((570, 108), "2  Orkestrasi", font=font(30, True), fill=SLATE)
    d.text((1120, 108), "3  Inspeksi sebelum inferensi", font=font(30, True), fill=SLATE)
    d.text((1910, 108), "4  Keluaran", font=font(30, True), fill=SLATE)

    # 1. UI Layer
    box(d, (55, 165, 470, 735), fill=BOX_BG, stroke=BORDER)
    avatar(d, 160, 264, SLATE); avatar(d, 365, 264, MUTED)
    text_center(d, (160, 390), "Pasien\nchat + skrining", 30, bold=True)
    text_center(d, (365, 390), "Dokter\ncatatan", 30, bold=True)
    box(d, (102, 504, 422, 676), fill=CARD_BG, stroke=LINE, radius=20)
    avatar(d, 165, 562, "#475569")
    text_center(d, (312, 583), "SOC\ntelemetri", 36, bold=True)

    # 2. FastAPI Layer
    box(d, (555, 165, 1000, 735), fill=BOX_BG, stroke=BORDER)
    text_center(d, (777, 245), "FASTAPI", 56, bold=True)
    text_center(d, (777, 390), "Autentikasi peran\nrouter chat dan asesmen\nstreaming respons", 36, color=MUTED)
    box(d, (615, 545, 940, 670), fill=CARD_BG, stroke=LINE, radius=20)
    text_center(d, (777, 606), "API / sesi", 38, bold=True)

    # 3. SIAGA Guardrail Layer
    box(d, (1085, 150, 1825, 750), fill="#f1f5f9", stroke=BORDER_DARK, radius=32, width=5)
    shield(d, 1200, 245, color=DARK)
    text_center(d, (1500, 238), "SIAGA GUARDRAIL", 50, bold=True)
    layers = [("L0", "Normalisasi", 1120, 350), ("L1", "Sinyal niat", 1485, 350),
              ("L2", "URL + burst", 1120, 510), ("L3 CIM", "Riwayat risiko", 1485, 510)]
    for key, detail, x, y in layers:
        box(d, (x, y, x + 320, y + 122), fill=CARD_BG, stroke=BORDER, radius=16)
        text_center(d, (x + 160, y + 40), key, 38, bold=True)
        text_center(d, (x + 160, y + 88), detail, 28, color=MUTED)
    box(d, (1120, 665, 1790, 720), fill=DARK, radius=14, stroke=DARK)
    text_center(d, (1455, 693), "ALLOW / WATCH   |   PROBE / BLOCK", 28, color="white", bold=True)

    arrow(d, 475, 440, 545, 440)
    arrow(d, 1005, 440, 1070, 440)

    # 4. Model & Control Output
    box(d, (1910, 175, 2345, 425), fill=BOX_BG, stroke=BORDER)
    text_center(d, (2127, 246), "MODEL LOKAL", 42, bold=True)
    text_center(d, (2127, 333), "Ollama bila hidup\nrespons melalui API", 32, color=MUTED)

    box(d, (1910, 485, 2345, 735), fill=BOX_BG, stroke=BORDER)
    text_center(d, (2127, 555), "PROBE / BLOCK", 40, bold=True)
    text_center(d, (2127, 643), "Balasan kendali;\npesan ditahan", 32, color=MUTED)

    arrow(d, 1830, 285, 1895, 285)
    arrow(d, 1830, 600, 1895, 600)
    text_center(d, (2075, 450), "ALLOW / WATCH", 26, color=SLATE, bold=True)

    # State Separator & Bottom Storage
    d.line((55, 795, 2345, 795), fill=LINE, width=3)
    d.text((60, 818), "STATE KEAMANAN", font=font(28, True), fill=SLATE)
    d.text((1250, 818), "DATA APLIKASI", font=font(28, True), fill=SLATE)

    box(d, (55, 865, 1140, 1085), fill=BOX_BG, stroke=BORDER)
    database(d, 210, 964, color=SLATE)
    text_center(d, (700, 928), "DuckDB guardrail", 40, bold=True)
    text_center(d, (700, 1005), "hash, fitur, skor; TTL state sesi", 32, color=MUTED)

    box(d, (1250, 865, 2345, 1085), fill=BOX_BG, stroke=BORDER)
    database(d, 1405, 964, color=MUTED)
    text_center(d, (1860, 928), "SQLite / Firestore", 40, bold=True)
    text_center(d, (1860, 1005), "riwayat chat, asesmen, catatan", 32, color=MUTED)

    im.save(OUT / "figure_1_verified_architecture.png", dpi=(300, 300))
    print("Exported figure_1_verified_architecture.png (academic monochrome)")

def workflow():
    im = Image.new("RGB", (2400, 740), "white")
    d = ImageDraw.Draw(im)
    text_center(d, (1200, 52), "ALUR PENGUKURAN MODEL SLM", 47, bold=True)
    specs = [
        (75, "1", "Prompt sintetis", "9 prompt / model\n4 kelompok uji"),
        (680, "2", "Inferensi Ollama", "Qwen3 1.7B / 4B\nQwen2.5 3B"),
        (1285, "3", "Catat telemetri", "eval tok/s, token terlihat\nVRAM sesudah respons"),
        (1890, "4", "Audit keluaran", "balasan kosong ditandai\ntidak dinilai kualitasnya"),
    ]
    for x, num, title, detail in specs:
        box(d, (x, 145, x + 445, 610), fill=BOX_BG, stroke=BORDER, radius=24)
        d.ellipse((x + 168, 184, x + 278, 294), fill=SLATE)
        text_center(d, (x + 223, 240), num, 56, color="white", bold=True)
        text_center(d, (x + 222, 370), title, 38, bold=True)
        text_center(d, (x + 222, 505), detail, 30, color=MUTED)
    for x in (540, 1145, 1750):
        arrow(d, x, 375, x + 105, 375, color=SLATE)
    text_center(d, (1200, 675), "Setiap prompt berdiri sendiri; arsip ini mengukur inferensi, bukan keberhasilan pertahanan multi-giliran.", 30, color=MUTED)
    im.save(OUT / "figure_2_slm_benchmark_workflow.png", dpi=(300, 300))
    print("Exported figure_2_slm_benchmark_workflow.png (academic monochrome)")

if __name__ == "__main__":
    architecture()
    workflow()

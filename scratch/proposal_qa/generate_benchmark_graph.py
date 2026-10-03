"""Recompute and export the archived SLM benchmark figure in academic grayscale/slate styling."""

import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import pandas as pd
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "scratch/benchmark_synthetic_report_data.json"
OUT = ROOT / "Knowledge/Docs/proposal/figures"
OUT.mkdir(parents=True, exist_ok=True)

archived = json.loads(RAW.read_text(encoding="utf-8"))
rows = [
    {"model": model, "order": i, "speed": sample["tok_per_sec"],
     "vram": sample["vram_after_mib"], "visible": bool(sample["reply"])}
    for model, group in archived.items()
    for i, sample in enumerate(group["samples"])
]
data = pd.DataFrame(rows)
summary = data.groupby("model", sort=False).apply(
    lambda group: pd.Series({
        "n": len(group),
        "median_warm_tok_s": group.loc[group["order"] > 0, "speed"].median(),
        "max_post_request_vram_mib": group["vram"].max(),
        "visible_replies": int(group["visible"].sum()),
    }), include_groups=False
).reset_index()
summary["median_warm_tok_s"] = summary["median_warm_tok_s"].map(
    lambda value: float(Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
)
summary[["n", "max_post_request_vram_mib", "visible_replies"]] = summary[
    ["n", "max_post_request_vram_mib", "visible_replies"]
].astype(int)
assert len(summary) == 3 and (summary["n"] == 9).all()
assert summary["median_warm_tok_s"].tolist() == [92.15, 62.96, 23.90]
summary.to_csv(OUT / "slm_benchmark_summary.csv", index=False, float_format="%.2f")

W, H = 2600, 1130
im = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(im)

# Academic Monochrome / Slate Palette
DARK = "#0f172a"
SLATE = "#334155"
MUTED = "#64748b"
GRID = "#e2e8f0"
BOX_BG = "#f8fafc"
BORDER = "#cbd5e1"

# Academic Bar Shades (Distinct Grayscale/Slate tones for publication)
BAR_COLORS = ["#1e293b", "#475569", "#94a3b8"]

def font(size, bold=False):
    return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf", size)

def label(xy, value, size=38, color=DARK, bold=False, anchor="mm"):
    d.text(xy, str(value), font=font(size, bold), fill=color, anchor=anchor)

label((W / 2, 65), "HASIL PENGUKURAN TIGA MODEL SLM", 54, bold=True)
label((W / 2, 122), "Ollama lokal · arsip 2 Oktober 2026 · sembilan prompt per model", 34, MUTED)

panels = [(105, 1260, "(a) Kecepatan generasi (tok/s)", 100),
          (1390, 2515, "(b) VRAM sesudah respons (MiB)", 4096)]
short = ["Qwen3\n1.7B", "Qwen2.5\n3B", "Qwen3\n4B"]

for pi, (left, right, title, top) in enumerate(panels):
    label(((left + right) / 2, 205), title, 42, bold=True)
    plot_l, plot_r, plot_t, plot_b = left + 115, right - 45, 300, 815
    ticks = [0, 20, 40, 60, 80, 100] if pi == 0 else [0, 1000, 2000, 3000, 4096]
    for tick in ticks:
        y = plot_b - (tick / top) * (plot_b - plot_t)
        d.line((plot_l, y, plot_r, y), fill=GRID, width=3)
        label((plot_l - 20, y), str(tick), 30, MUTED, anchor="rm")
    d.line((plot_l, plot_t, plot_l, plot_b), fill=DARK, width=5)
    d.line((plot_l, plot_b, plot_r, plot_b), fill=DARK, width=5)
    centers = [plot_l + (plot_r - plot_l) * (k + 0.5) / 3 for k in range(3)]
    values = summary["median_warm_tok_s"] if pi == 0 else summary["max_post_request_vram_mib"]
    for k, (x, value) in enumerate(zip(centers, values)):
        y = plot_b - (float(value) / top) * (plot_b - plot_t)
        d.rounded_rectangle((x - 91, y, x + 91, plot_b), radius=10, fill=BAR_COLORS[k], outline=DARK, width=2)
        fmt = f"{value:.2f}".replace(".", ",") if pi == 0 else f"{int(value):,}".replace(",", ".")
        label((x, y - 30), fmt, 36, DARK, True)
        d.multiline_text((x, 845), short[k], font=font(30, True), fill=DARK, anchor="ma", align="center", spacing=4)
    if pi == 1:
        label(((plot_l + plot_r) / 2, 268), "kapasitas GPU 4.096 MiB", 28, MUTED)

d.rounded_rectangle((105, 970, 2515, 1083), radius=20, fill=BOX_BG, outline=BORDER, width=2)
label((W / 2, 1003), "Balasan teks tersimpan: Qwen3 1.7B  1/9   ·   Qwen2.5 3B  9/9   ·   Qwen3 4B  0/9", 34, DARK, True)
label((W / 2, 1050), "Median dari 8 permintaan hangat; VRAM = maksimum teramati setelah permintaan; balasan kosong tidak dinilai aman.", 29, MUTED)

im.save(OUT / "figure_3_slm_benchmark_results.png", dpi=(300, 300))
print("Exported figure_3_slm_benchmark_results.png (academic monochrome)")

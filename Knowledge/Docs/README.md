# 📄 DOKUMENTASI SPESIFIKASI TEKNIS & LAPORAN SIAGA v2

> **Pusat Dokumen Formal, Laporan Pengujian, & Presentasi Sistem**  
> **Kompetisi:** HackNusa 2026 · ITENAS

Direktori `Docs/` ini terbagi rapi ke dalam **3 subkategori utama**:

```text
Knowledge/Docs/
├── 📑 spec/    <-- Dokumen Spesifikasi Arsitektur Formal (Markdown, PDF, Word, Google Docs)
├── 📊 report/  <-- Laporan Pengujian, Benchmark SLM, & E2E Test Suite
├── 🌐 html/    <-- Dashboard Presentasi Visual Interaktif
└── README.md   <-- Pintu Navigasi Utama ini
```

---

## 📑 1. [**`spec/`**](spec/) — Spesifikasi Teknis & Arsitektur Formal
Dokumen spesifikasi arsitektur resmi yang disiapkan untuk penulisan proposal, laporan teknis, dan Google Docs:

| Berkas | Format | Deskripsi |
|---|:---:|---|
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md) | Markdown | Spesifikasi teknis arsitektur 4-Tier on-premise lengkap, diagram pipeline L0–L3, dan formula matematis. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf) | PDF | Dokumen PDF spesifikasi arsitektur revisi terbaru siap cetak/distribusi. |
| [**`DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md`**](spec/DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md) | Markdown | Dokumen format Google Docs siap ekspor mencakup ringkasan eksekutif, topologi, dan analisis keamanan. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx) | Word Docx | Dokumen Microsoft Word resmi spesifikasi arsitektur sistem. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM (1).docx`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM%20(1).docx) | Word Docx | Dokumen Word dengan diagram visual lengkap. |
| [**`HACKNUSA_6_PILARS_CRITERIA_AND_GOALS.txt`**](spec/HACKNUSA_6_PILARS_CRITERIA_AND_GOALS.txt) | Teks | Catatan kriteria 6 pilar penilaian dan target capaian HackNusa. |

---

## 📊 2. [**`report/`**](report/) — Laporan Pengujian, Benchmark, & E2E Test
Laporan pengukuran performa model AI lokal dan hasil pengujian otomatis:

| Berkas | Lingkup Pembahasan |
|---|---|
| [**`LAPORAN_BENCHMARK_KOMPARATIF_MODEL_SLM_QWEN_SERIES.md`**](report/LAPORAN_BENCHMARK_KOMPARATIF_MODEL_SLM_QWEN_SERIES.md) | Benchmark komparatif 3 model Qwen (`qwen3:1.7b`, `qwen2.5:3b`, `qwen3:4b`) pada GPU laptop GTX 1650. |
| [**`LAPORAN_ANALISIS_DAN_BENCHMARK_MODEL_SLM_QWEN3_4B.md`**](report/LAPORAN_ANALISIS_DAN_BENCHMARK_MODEL_SLM_QWEN3_4B.md) | Analisis kelayakan model 4B vs 3B dan rekomendasi model produksi. |
| [**`SIAGA_E2E_HEADLESS_TEST_REPORT.md`**](report/SIAGA_E2E_HEADLESS_TEST_REPORT.md) | Laporan hasil pengujian end-to-end headless browser & verifikasi integrasi UI. |
| [**`TEMP_COMBINED_GOALS_CALCULATION_REPORT.md`**](report/TEMP_COMBINED_GOALS_CALCULATION_REPORT.md) | Rekapitulasi kalkulasi skor relevansi TF-IDF, metrik latensi, dan target pilar. |

---

## 🌐 3. [**`html/`**](html/) — Laporan Visual & Dashboard Interaktif
Dashboard visualisasi HTML interaktif yang dapat langsung dibuka di browser:

| Berkas | Keterangan |
|---|---|
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT_PREVIEW.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT_PREVIEW.html) | Dashboard preview interaktif laporan sistem lengkap HackNusa. |
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT.html) | Versi desktop laporan visual arsitektur dan sistem guardrail. |
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT_MOBILE.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT_MOBILE.html) | Versi mobile responsif dari laporan sistem. |
| [**`siaga_v2.html`**](html/siaga_v2.html) | Halaman presentasi & ringkasan arsitektur SIAGA v2. |

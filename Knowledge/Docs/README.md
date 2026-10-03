# 📄 TECHNICAL SPECIFICATIONS & EVALUATION REPORTS — SIAGA v2

> **Central Hub for Formal Documentation, Benchmark Reports, & System Presentations**  
> **Competition:** HackNusa 2026 · ITENAS

The `Docs/` directory is structured into **3 core subcategories**:

```text
Knowledge/Docs/
├── 📑 spec/    <-- Formal System Architecture Specifications (Markdown, PDF, Word, Google Docs)
├── 📊 report/  <-- Benchmark Reports, SLM Model Evaluations, & E2E Test Suite
├── 🌐 html/    <-- Interactive Visual Presentation Dashboards
└── README.md   <-- This Main Navigation Directory
```

---

## 📑 1. [**`spec/`**](spec/) — Formal System Architecture Specifications
Official architecture specification documents prepared for proposals, technical whitepapers, and external distribution:

| File | Format | Description |
|---|:---:|---|
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md) | Markdown | Complete technical specification of the 4-Tier on-premise architecture, L0–L3 pipeline diagrams, and mathematical formulations. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf) | PDF | Official print-ready PDF specification with updated revision notes. |
| [**`DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md`**](spec/DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md) | Markdown | Google Docs-ready export covering executive summary, network topology, and security threat modeling. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx) | Word Docx | Official Microsoft Word document for system architecture specifications. |
| [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM (1).docx`**](spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM%20(1).docx) | Word Docx | Extended Word document containing comprehensive visual architecture diagrams. |
| [**`HACKNUSA_6_PILARS_CRITERIA_AND_GOALS.txt`**](spec/HACKNUSA_6_PILARS_CRITERIA_AND_GOALS.txt) | Text | Evaluation criteria breakdown across HackNusa's 6 judging pillars and target objectives. |

---

## 📊 2. [**`report/`**](report/) — Benchmark Reports & Automated E2E Testing
Empirical performance measurements of local AI models and automated testing suites:

| File | Scope of Evaluation |
|---|---|
| [**`LAPORAN_BENCHMARK_KOMPARATIF_MODEL_SLM_QWEN_SERIES.md`**](report/LAPORAN_BENCHMARK_KOMPARATIF_MODEL_SLM_QWEN_SERIES.md) | Comparative benchmark of 3 Qwen models (`qwen3:1.7b`, `qwen2.5:3b`, `qwen3:4b`) running on a GTX 1650 laptop GPU. |
| [**`LAPORAN_ANALISIS_DAN_BENCHMARK_MODEL_SLM_QWEN3_4B.md`**](report/LAPORAN_ANALISIS_DAN_BENCHMARK_MODEL_SLM_QWEN3_4B.md) | Feasibility and trade-off analysis comparing 4B vs 3B parameters with production recommendations. |
| [**`SIAGA_E2E_HEADLESS_TEST_REPORT.md`**](report/SIAGA_E2E_HEADLESS_TEST_REPORT.md) | End-to-end headless browser test report verifying full UI/UX integration and API reliability. |
| [**`TEMP_COMBINED_GOALS_CALCULATION_REPORT.md`**](report/TEMP_COMBINED_GOALS_CALCULATION_REPORT.md) | Quantitative summary of TF-IDF relevance scores, latency measurements, and pillar targets. |

---

## 🌐 3. [**`html/`**](html/) — Interactive Visual Dashboards
Interactive HTML visual presentations ready for direct browser viewing:

| File | Description |
|---|---|
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT_PREVIEW.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT_PREVIEW.html) | Interactive full-featured preview dashboard of the HackNusa system report. |
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT.html) | Desktop visual report detailing system architecture and guardrail telemetry. |
| [**`SIAGA_HACKNUSA_SYSTEM_REPORT_MOBILE.html`**](html/SIAGA_HACKNUSA_SYSTEM_REPORT_MOBILE.html) | Mobile-responsive edition of the system report. |
| [**`siaga_v2.html`**](html/siaga_v2.html) | Core presentation and executive architectural overview of SIAGA v2. |

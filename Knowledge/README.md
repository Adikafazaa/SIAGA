# 📚 SIAGA v2 — Knowledge Base & Technical Encyclopedia

> **Pusat Dokumentasi & Sumber Kebenaran Pengetahuan Sistem Resmi**  
> **Platform:** PsychoBot Clinical Care & Stateful Intent-Aware Guardrail Architecture (SIAGA)  
> **Versi:** `v2.1.0` (Official Release) · HackNusa 2026

Direktori `Knowledge/` ini dirancang bersih, rapi, dan terbagi menjadi **3 subfolder utama**:

```text
Knowledge/
├── 📖 Chapters/   <-- Seluruh Modul Bab Teknis Inti (Bab 00 s/d 09 & Dokumen Monolitik)
├── 🎓 BIMBINGAN/  <-- Materi Bimbingan Dosen & Rekaman Sesi
├── 📄 Docs/       <-- Spesifikasi Resmi, Laporan Benchmark, & Presentasi HTML
└── README.md      <-- Katalog Utama ini
```

---

## 🧭 Direktori Utama & Daftar Isi

### 1. 📖 [**`Chapters/`**](Chapters/) — Modul Pengetahuan Teknis (Bab 00–09)
Seluruh bab spesifikasi teknis mendalam dikelompokkan rapi di dalam folder [`Chapters/`](Chapters/):

| Bab | Berkas Modul | Lingkup & Pokok Pembahasan |
|---|---|---|
| **00** | [**00_SYSTEM_OVERVIEW.md**](Chapters/00_SYSTEM_OVERVIEW.md) | **Gambaran Umum Sistem:** Latar belakang krisis rasio psikiater, 2 risiko kritis LLM medis, arsitektur, pilar produk. |
| **01** | [**01_GUARDRAIL_PIPELINE_L0_L3.md**](Chapters/01_GUARDRAIL_PIPELINE_L0_L3.md) | **Pipeline Pertahanan Berlapis (L0–L3):** UTS #39, ONNX INT8, L2 Clinical Context, formula CIM ($M_t$), DuckDB. |
| **02** | [**02_REVERSE_TURING_PROBE.md**](Chapters/02_REVERSE_TURING_PROBE.md) | **Active Reverse Turing Probe:** Reverse prompt injection, 3 tangga eskalasi probe, mitigasi reflection leak. |
| **03** | [**03_LOCAL_AI_ORCHESTRATION.md**](Chapters/03_LOCAL_AI_ORCHESTRATION.md) | **Sovereign Local AI:** Kedaulatan data pasien (UU PDP), Ollama / SGLang, akselerasi CUDA, streaming SSE. |
| **04** | [**04_UIUX_DESIGN_SYSTEM.md**](Chapters/04_UIUX_DESIGN_SYSTEM.md) | **Sistem Desain Anti-"AI Slop":** Paradigma antarmuka ganda (*Care Light* vs *SOC Dark HUD*), token semantik, WCAG AA. |
| **05** | [**05_API_AND_DATABASE_SPEC.md**](Chapters/05_API_AND_DATABASE_SPEC.md) | **Kontrak API & Skema Basis Data:** Spesifikasi endpoint FastAPI, skema DuckDB zero-plaintext, SQLite/Firestore. |
| **06** | [**06_CRESCENDO_ATTACK_AND_TESTING.md**](Chapters/06_CRESCENDO_ATTACK_AND_TESTING.md) | **Anatomi Crescendo Attack & Pengujian:** Multi-turn attack vs stateless guardrail, skenario 5-turn, automated test suite. |
| **07** | [**07_OPERATIONS_AND_RUNNER.md**](Chapters/07_OPERATIONS_AND_RUNNER.md) | **Operasional & Unified Runner:** Single-process tree runner (`run.py`), port manager, graceful taskkill Windows. |
| **08** | [**08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md**](Chapters/08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md) | **Laporan Kalibrasi & Upgrade:** Kalibrasi bobot fusi, threshold CIM v0 ground-truth, rekayasa stabilitas. |
| **09** | [**09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md**](Chapters/09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md) | **Kalkulasi Relevansi TF-IDF:** Pembuktian matematis relevansi terhadap 6 pilar kriteria penilaian HackNusa. |

> 👉 **Dokumen Monolitik:** [**`Chapters/SIAGA_COMPLETE_KNOWLEDGE_BASE.md`**](Chapters/SIAGA_COMPLETE_KNOWLEDGE_BASE.md) *(Seluruh bab di atas digabungkan menjadi 1 berkas terpadu).*

---

### 2. 🎓 [**`BIMBINGAN/`**](BIMBINGAN/) — Materi & Rekaman Bimbingan Dosen
* [**`PENJELASAN_SISTEM_SIAGA_UNTUK_DOSEN.md`**](BIMBINGAN/PENJELASAN_SISTEM_SIAGA_UNTUK_DOSEN.md): Panduan komprehensif konsep arsitektur SIAGA yang disiapkan khusus untuk materi bimbingan dan pertanyaan dosen penguji.
* **`DOKUM-15.9.2026.mp4`**: Rekaman video sesi bimbingan teknis bersama dosen pembimbing (~1.48 GB).

---

### 3. 📄 [**`Docs/`**](Docs/) — Dokumentasi Spesifikasi Resmi, Laporan Benchmark, & Presentasi
* **Spesifikasi Formal:**
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md`**](Docs/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md) *(Markdown)*
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf`**](Docs/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf) *(PDF Resmi)*
  * [**`DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md`**](Docs/DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md) *(Format Google Docs)*
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx`**](Docs/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx) *(Microsoft Word)*
* [**`Docs/report/`**](Docs/report/): Laporan benchmark empiris model SLM Qwen series, evaluasi Qwen 4B vs 3B, laporan tes E2E headless, dan kalkulasi target pilar.
* [**`Docs/html/`**](Docs/html/): Dashboard presentasi visual HTML responsif (`SIAGA_HACKNUSA_SYSTEM_REPORT.html`, preview, mobile, dan slide v2).

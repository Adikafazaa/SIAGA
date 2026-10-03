# 📖 MODUL ENSIKLOPEDIA TEKNIS SIAGA v2 (CHAPTERS 00–09)

> **Bab Pengetahuan Teknis & Arsitektur Lengkap**  
> **Platform:** PsychoBot Clinical Care & Stateful Intent-Aware Guardrail Architecture (SIAGA)

---

## 🧭 Daftar Bab Pengetahuan

| Bab | Berkas Modul | Lingkup & Pokok Pembahasan |
|---|---|---|
| **00** | [**00_SYSTEM_OVERVIEW.md**](00_SYSTEM_OVERVIEW.md) | **Gambaran Umum Sistem:** Latar belakang krisis rasio psikiater Indonesia, 2 risiko kritis LLM medis, arsitektur tingkat tinggi, dan pilar produk. |
| **01** | [**01_GUARDRAIL_PIPELINE_L0_L3.md**](01_GUARDRAIL_PIPELINE_L0_L3.md) | **Pipeline Pertahanan Berlapis (L0–L3):** Normalisasi UTS #39, klasifikasi ganda ONNX INT8, evaluasi konteks klinis L2, formula matematis CIM ($M_t$), fusi keputusan, dan kebijakan Zero-Plaintext DuckDB. |
| **02** | [**02_REVERSE_TURING_PROBE.md**](02_REVERSE_TURING_PROBE.md) | **Active Reverse Turing Probe:** Filosofi membalikkan *prompt injection* sebagai senjata pertahanan, 3 tangga eskalasi probe, mitigasi *reflection leak*, dan logika evaluasi balasan. |
| **03** | [**03_LOCAL_AI_ORCHESTRATION.md**](03_LOCAL_AI_ORCHESTRATION.md) | **Sovereign Local AI:** Kedaulatan data pasien (UU PDP & HIPAA), integrasi Ollama / SGLang, akselerasi GPU CUDA (GTX 1650 & RTX 4090), streaming SSE, dan fallback cloud. |
| **04** | [**04_UIUX_DESIGN_SYSTEM.md**](04_UIUX_DESIGN_SYSTEM.md) | **Sistem Desain Anti-"AI Slop":** Paradigma antarmuka ganda (*Care Light* vs *SOC Dark HUD*), token warna semantik (`colors.ts`), tipografi tabular JetBrains Mono, dan aksesibilitas WCAG AA. |
| **05** | [**05_API_AND_DATABASE_SPEC.md**](05_API_AND_DATABASE_SPEC.md) | **Kontrak API & Skema Basis Data:** Spesifikasi seluruh endpoint FastAPI (`/chat`, `/assessments`, `/doctor`, `/admin`), skema tabel state DuckDB (`siaga_sessions.duckdb`), dan skema SQLite/Firestore. |
| **06** | [**06_CRESCENDO_ATTACK_AND_TESTING.md**](06_CRESCENDO_ATTACK_AND_TESTING.md) | **Anatomi Crescendo Attack & Pengujian:** Mengapa guardrail stateless gagal, panduan langkah demi langkah skenario penyerangan 5-turn, serta automated test suite Pytest. |
| **07** | [**07_OPERATIONS_AND_RUNNER.md**](07_OPERATIONS_AND_RUNNER.md) | **Operasional & Unified Runner:** Arsitektur single-process tree [`run.py`](../../run.py) dan [`run.bat`](../../run.bat), manajemen port, graceful taskkill di Windows, dan panduan *troubleshooting*. |
| **08** | [**08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md**](08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md) | **Laporan Kalibrasi & Upgrade Sistem:** Kalibrasi matematis bobot fusi, threshold CIM v0 ground-truth, dan rekayasa stabilitas. |
| **09** | [**09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md**](09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md) | **Kalkulasi Relevansi TF-IDF:** Formula matematis pembuktian relevansi guardrail terhadap 6 pilar kriteria penilaian HackNusa. |

---

## 📚 Dokumen Monolitik Terpadu
* [**`SIAGA_COMPLETE_KNOWLEDGE_BASE.md`**](SIAGA_COMPLETE_KNOWLEDGE_BASE.md): Dokumen monolitik all-in-one yang merangkum seluruh bab 00 hingga 09 di atas dalam 1 file (~1.060+ baris).

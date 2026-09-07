# 📚 SIAGA v2 — Knowledge Base & Technical Encyclopedia

> **Pusat Dokumentasi & Sumber Kebenaran Pengetahuan Sistem Resmi**  
> **Platform:** PsychoBot Clinical Care & Stateful Intent-Aware Guardrail Architecture (SIAGA)  
> **Versi:** `v2.0.0` (Official Release) · HackNusa 2026

> [!TIP]
> **📖 Dokumen Monolitik / All-in-One:**  
> Seluruh bab pengetahuan di bawah ini juga telah digabungkan menjadi 1 file lengkap terpadu yang siap dibaca atau diekspor:  
> 👉 [**SIAGA_COMPLETE_KNOWLEDGE_BASE.md**](SIAGA_COMPLETE_KNOWLEDGE_BASE.md) *(~1.060+ baris dokumen sistem lengkap)*

---

## 🧭 Daftar Isi & Modul Pengetahuan

Folder `Knowledge/` ini dirancang sebagai panduan komprehensif dari tingkat filosofi produk, matematika momentum, hingga implementasi kode teknis:

| Bab | Berkas Modul | Lingkup & Pokok Pembahasan |
|---|---|---|
| **00** | [**00_SYSTEM_OVERVIEW.md**](00_SYSTEM_OVERVIEW.md) | **Gambaran Umum Sistem:** Latar belakang krisis rasio psikiater Indonesia, 2 risiko kritis LLM medis, arsitektur tingkat tinggi, dan pilar produk. |
| **01** | [**01_GUARDRAIL_PIPELINE_L0_L3.md**](01_GUARDRAIL_PIPELINE_L0_L3.md) | **Pipeline Pertahanan Berlapis (L0–L3):** Normalisasi UTS #39, klasifikasi ganda ONNX INT8, evaluasi konteks klinis L2, formula matematis CIM ($M_t$), fusi keputusan, dan kebijakan Zero-Plaintext DuckDB. |
| **02** | [**02_REVERSE_TURING_PROBE.md**](02_REVERSE_TURING_PROBE.md) | **Active Reverse Turing Probe:** Filosofi membalikkan *prompt injection* sebagai senjata pertahanan, 3 tangga eskalasi probe, mitigasi *reflection leak*, dan logika evaluasi balasan. |
| **03** | [**03_LOCAL_AI_ORCHESTRATION.md**](03_LOCAL_AI_ORCHESTRATION.md) | **Sovereign Local AI:** Kedaulatan data pasien (UU PDP & HIPAA), integrasi Ollama Qwen 1.7B, akselerasi GPU CUDA (GTX 1650, ~89 token/detik), streaming SSE, dan fallback cloud. |
| **04** | [**04_UIUX_DESIGN_SYSTEM.md**](04_UIUX_DESIGN_SYSTEM.md) | **Sistem Desain Anti-"AI Slop":** Penolakan kartu membulat SaaS generik, paradigma antarmuka ganda (*Care Light* vs *SOC Dark HUD*), token warna semantik (`colors.ts`), tipografi tabular JetBrains Mono, dan aksesibilitas WCAG AA. |
| **05** | [**05_API_AND_DATABASE_SPEC.md**](05_API_AND_DATABASE_SPEC.md) | **Kontrak API & Skema Basis Data:** Spesifikasi seluruh endpoint FastAPI (`/chat`, `/assessments`, `/doctor`, `/admin`), skema tabel state DuckDB (`siaga_sessions.duckdb`), dan skema SQLite/Firestore. |
| **06** | [**06_CRESCENDO_ATTACK_AND_TESTING.md**](06_CRESCENDO_ATTACK_AND_TESTING.md) | **Anatomi Crescendo Attack & Pengujian:** Mengapa guardrail stateless gagal, panduan langkah demi langkah skenario penyerangan 5-turn, serta automated test suite Pytest. |
| **07** | [**07_OPERATIONS_AND_RUNNER.md**](07_OPERATIONS_AND_RUNNER.md) | **Operasional & Unified Runner:** Arsitektur single-process tree [`run.py`](../run.py) dan [`run.bat`](../run.bat), manajemen port, graceful taskkill di Windows, dan panduan *troubleshooting*. |

---

## 🎯 Target Audiens & Cara Membaca

- **Untuk Juri Kompetisi / Reviewer:**  
  Mulailah dari [Bab 00 (Overview)](00_SYSTEM_OVERVIEW.md) $\rightarrow$ [Bab 01 (Guardrail L0–L3)](01_GUARDRAIL_PIPELINE_L0_L3.md) $\rightarrow$ [Bab 06 (Crescendo Attack Skenario)](06_CRESCENDO_ATTACK_AND_TESTING.md) untuk memahami nilai kebaruan riset dan keunggulan pertahanan stateful dibanding solusi konvensional.

- **Untuk Pengembang Frontend:**  
  Pelajari [Bab 04 (UI/UX Design System)](04_UIUX_DESIGN_SYSTEM.md) untuk memastikan seluruh komponen mematuhi standar desain SOC Console dan aturan token warna di [`frontend/src/theme/colors.ts`](../frontend/src/theme/colors.ts).

- **Untuk Pengembang Backend & Keamanan AI:**  
  Fokuskan pada [Bab 01 (Formula CIM)](01_GUARDRAIL_PIPELINE_L0_L3.md), [Bab 02 (Reverse Turing Probe)](02_REVERSE_TURING_PROBE.md), dan [Bab 05 (API & DuckDB)](05_API_AND_DATABASE_SPEC.md).

- **Untuk Operator Sistem & Deployment:**  
  Gunakan [Bab 03 (Local AI & Ollama)](03_LOCAL_AI_ORCHESTRATION.md) dan [Bab 07 (Operations & Runner)](07_OPERATIONS_AND_RUNNER.md) sebagai panduan menyalakan dan merawat sistem.

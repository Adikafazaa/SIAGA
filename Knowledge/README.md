# 📚 SIAGA v2 — Knowledge Base & Technical Encyclopedia

> **Official System Documentation & Central Source of Truth**  
> **Platform:** PsychoBot Clinical Care & Stateful Intent-Aware Guardrail Architecture (SIAGA)  
> **Version:** `v2.1.0` (Official Release) · HackNusa 2026

The `Knowledge/` directory is organized into **3 core subdirectories**:

```text
Knowledge/
├── 📖 Chapters/   <-- Core Technical Knowledge Modules (Chapters 00–09 & Monolithic Document)
├── 🎓 BIMBINGAN/  <-- Academic Advisory Materials & Advisory Session Logs
├── 📄 Docs/       <-- Official Architecture Specifications, Benchmark Reports, & HTML Dashboards
└── README.md      <-- This Master Table of Contents
```

---

## 🧭 Main Directories & Table of Contents

### 1. 📖 [**`Chapters/`**](Chapters/) — Technical Knowledge Modules (Chapters 00–09)
Detailed technical chapters and architectural analyses are located in [`Chapters/`](Chapters/):

| Chapter | Module File | Scope & Key Subjects |
|---|---|---|
| **00** | [**00_SYSTEM_OVERVIEW.md**](Chapters/00_SYSTEM_OVERVIEW.md) | **System Overview:** Indonesian psychiatrist shortage crisis background, 2 critical clinical LLM risks, high-level architecture, and product pillars. |
| **01** | [**01_GUARDRAIL_PIPELINE_L0_L3.md**](Chapters/01_GUARDRAIL_PIPELINE_L0_L3.md) | **Multi-Layer Defense Pipeline (L0–L3):** UTS #39 normalization, dual-axis INT8 ONNX classifiers, L2 clinical context adapter, mathematical CIM formula ($M_t$), decision fusion, and DuckDB Zero-Plaintext retention policy. |
| **02** | [**02_REVERSE_TURING_PROBE.md**](Chapters/02_REVERSE_TURING_PROBE.md) | **Active Reverse Turing Probe:** Inverting prompt injection into an active defense mechanism, 3-level escalation ladder, reflection leak mitigation, and response evaluation logic. |
| **03** | [**03_LOCAL_AI_ORCHESTRATION.md**](Chapters/03_LOCAL_AI_ORCHESTRATION.md) | **Sovereign Local AI:** Patient data sovereignty (UU PDP & HIPAA), Ollama / SGLang integration, CUDA acceleration (GTX 1650 & RTX 4090), SSE token streaming, and cloud fallback strategies. |
| **04** | [**04_UIUX_DESIGN_SYSTEM.md**](Chapters/04_UIUX_DESIGN_SYSTEM.md) | **Anti-"AI Slop" Design System:** Dual-interface paradigm (*Care Light* patient console vs *SOC Dark HUD*), semantic color tokens (`colors.ts`), JetBrains Mono tabular typography, and WCAG AA accessibility. |
| **05** | [**05_API_AND_DATABASE_SPEC.md**](Chapters/05_API_AND_DATABASE_SPEC.md) | **API Contracts & Database Schemas:** Complete FastAPI endpoint specifications (`/chat`, `/assessments`, `/doctor`, `/admin`), zero-plaintext DuckDB state schema (`siaga_sessions.duckdb`), and SQLite/Firestore stores. |
| **06** | [**06_CRESCENDO_ATTACK_AND_TESTING.md**](Chapters/06_CRESCENDO_ATTACK_AND_TESTING.md) | **Crescendo Attack Anatomy & Testing:** Why stateless guardrails fail against multi-turn drift, step-by-step 5-turn attack scenarios, and automated Pytest test suites. |
| **07** | [**07_OPERATIONS_AND_RUNNER.md**](Chapters/07_OPERATIONS_AND_RUNNER.md) | **Operations & Unified Runner:** Single-process tree runner architecture (`run.py` & `run.bat`), port management, graceful task termination on Windows, and troubleshooting. |
| **08** | [**08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md**](Chapters/08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md) | **Calibration & System Upgrade Report:** Mathematical calibration of fusion weights, ground-truth CIM v0 thresholds, and runtime stability engineering. |
| **09** | [**09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md**](Chapters/09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md) | **TF-IDF Relevance Analysis:** Mathematical proof of guardrail alignment and cosine relevance across HackNusa's 6 judging criteria pillars. |

> 👉 **Monolithic Reference:** [**`Chapters/SIAGA_COMPLETE_KNOWLEDGE_BASE.md`**](Chapters/SIAGA_COMPLETE_KNOWLEDGE_BASE.md) *(All chapters above consolidated into a single document).*

---

### 2. 🎓 [**`BIMBINGAN/`**](BIMBINGAN/) — Academic Advisory & Faculty Guidance
* [**`PENJELASAN_SISTEM_SIAGA_UNTUK_DOSEN.md`**](BIMBINGAN/PENJELASAN_SISTEM_SIAGA_UNTUK_DOSEN.md): Comprehensive system architecture guide prepared specifically for academic advisors and defense question defense.
* **`DOKUM-15.9.2026.mp4`**: Video recording of the technical advisory session with academic supervisor (~1.48 GB, stored locally).

---

### 3. 📄 [**`Docs/`**](Docs/) — Formal Specifications, Benchmark Reports, & Presentations
* **Formal Specifications:**
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md`**](Docs/spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.md) *(Markdown)*
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf`**](Docs/spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM(REVISI).pdf) *(Official PDF)*
  * [**`DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md`**](Docs/spec/DOKUMEN_LENGKAP_SIAGA_V2_GOOGLE_DOCS.md) *(Google Docs Format)*
  * [**`SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx`**](Docs/spec/SIAGA_SPESIFIKASI_TEKNIS_ARSITEKTUR_SISTEM.docx) *(Microsoft Word)*
* [**`Docs/report/`**](Docs/report/): Empirical benchmark reports of Qwen series SLM models, 4B vs 3B evaluations, headless E2E test results, and pillar target calculations.
* [**`Docs/html/`**](Docs/html/): Interactive HTML visual presentation dashboards (`SIAGA_HACKNUSA_SYSTEM_REPORT.html`, preview, mobile, and v2 presentation slides).

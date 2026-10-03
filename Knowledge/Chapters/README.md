# 📖 SIAGA v2 TECHNICAL ENCYCLOPEDIA (CHAPTERS 00–09)

> **Complete Technical Knowledge Modules & System Architecture Specifications**  
> **Platform:** PsychoBot Clinical Care & Stateful Intent-Aware Guardrail Architecture (SIAGA)

---

## 🧭 Technical Knowledge Chapters

| Chapter | Module File | Scope & Key Subjects |
|---|---|---|
| **00** | [**00_SYSTEM_OVERVIEW.md**](00_SYSTEM_OVERVIEW.md) | **System Overview:** Indonesian psychiatrist shortage crisis background, 2 critical clinical LLM risks, high-level architecture, and product pillars. |
| **01** | [**01_GUARDRAIL_PIPELINE_L0_L3.md**](01_GUARDRAIL_PIPELINE_L0_L3.md) | **Multi-Layer Defense Pipeline (L0–L3):** UTS #39 normalization, dual-axis INT8 ONNX classifiers, L2 clinical context adapter, mathematical CIM formula ($M_t$), decision fusion, and DuckDB Zero-Plaintext retention policy. |
| **02** | [**02_REVERSE_TURING_PROBE.md**](02_REVERSE_TURING_PROBE.md) | **Active Reverse Turing Probe:** Inverting prompt injection into an active defense mechanism, 3-level escalation ladder, reflection leak mitigation, and response evaluation logic. |
| **03** | [**03_LOCAL_AI_ORCHESTRATION.md**](03_LOCAL_AI_ORCHESTRATION.md) | **Sovereign Local AI:** Patient data sovereignty (UU PDP & HIPAA), Ollama / SGLang integration, CUDA acceleration (GTX 1650 & RTX 4090), SSE token streaming, and cloud fallback strategies. |
| **04** | [**04_UIUX_DESIGN_SYSTEM.md**](04_UIUX_DESIGN_SYSTEM.md) | **Anti-"AI Slop" Design System:** Dual-interface paradigm (*Care Light* patient console vs *SOC Dark HUD*), semantic color tokens (`colors.ts`), JetBrains Mono tabular typography, and WCAG AA accessibility. |
| **05** | [**05_API_AND_DATABASE_SPEC.md**](05_API_AND_DATABASE_SPEC.md) | **API Contracts & Database Schemas:** Complete FastAPI endpoint specifications (`/chat`, `/assessments`, `/doctor`, `/admin`), zero-plaintext DuckDB state schema (`siaga_sessions.duckdb`), and SQLite/Firestore stores. |
| **06** | [**06_CRESCENDO_ATTACK_AND_TESTING.md**](06_CRESCENDO_ATTACK_AND_TESTING.md) | **Crescendo Attack Anatomy & Testing:** Why stateless guardrails fail against multi-turn drift, step-by-step 5-turn attack scenarios, and automated Pytest test suites. |
| **07** | [**07_OPERATIONS_AND_RUNNER.md**](07_OPERATIONS_AND_RUNNER.md) | **Operations & Unified Runner:** Single-process tree runner architecture ([`run.py`](../../run.py) and [`run.bat`](../../run.bat)), port management, graceful task termination on Windows, and troubleshooting. |
| **08** | [**08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md**](08_HACKNUSA_CALIBRATION_AND_SYSTEM_UPGRADE_REPORT.md) | **Calibration & System Upgrade Report:** Mathematical calibration of fusion weights, ground-truth CIM v0 thresholds, and runtime stability engineering. |
| **09** | [**09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md**](09_HACKNUSA_TFIDF_RELEVANCE_CALCULATION_REPORT.md) | **TF-IDF Relevance Analysis:** Mathematical proof of guardrail alignment and cosine relevance across HackNusa's 6 judging criteria pillars. |

---

## 📚 Unified Monolithic Document
* [**`SIAGA_COMPLETE_KNOWLEDGE_BASE.md`**](SIAGA_COMPLETE_KNOWLEDGE_BASE.md): An all-in-one consolidated technical reference combining Chapters 00 through 09 into a single complete document (~1,060+ lines).

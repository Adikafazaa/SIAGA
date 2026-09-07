# 🛡️ SIAGA v2 — System Overview & Architecture Guide

> **Knowledge Base Bab 0** · Platform: PsychoBot Clinical Care & SIAGA Guardrail Platform  
> **Identitas:** *Sovereign Clinical Care & Stateful Intent-Aware Guardrail Architecture*  
> **Klasifikasi:** Dokumen Pengetahuan Arsitektur Sistem Resmi

---

## 📌 1. Latar Belakang & Urgensi Masalah

Layanan kesehatan mental di Indonesia menghadapi krisis struktural yang sangat akut:
- **Rasio Psikiater Timpang:** Hanya tersedia **1 psikiater per ~200.000 penduduk** (jauh di bawah rekomendasi WHO sebesar 1:30.000). Sebagian besar psikiater terkonsentrasi di kota-kota besar pulau Jawa.
- **Stigma Sosial & Hambatan Akses:** Banyak individu enggan mendatangi fasilitas kesehatan jiwa karena rasa malu, biaya, atau jarak geografis.
- **Peluang AI Generatif (LLM):** Pemanfaatan *Large Language Model* sebagai asisten konseling digital (*first-line triage*) menawarkan solusi skalabilitas masif yang aktif 24/7.

Namun, penerapan LLM konvensional pada domain psikiatri klinis berhadapan dengan **dua celah keamanan eksistensial**:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           DUA RISIKO KRITIS ADOPSI LLM KLINIS                     │
├─────────────────────────────────────────┬─────────────────────────────────────────┤
│ 1. KEBOCORAN PRIVASI & KEDAULATAN DATA  │ 2. SERANGAN MANIPULASI MULTI-TURN       │
│                                         │    (CRESCENDO ATTACK)                   │
│ Pengiriman teks trauma & identitas      │ Penyerang tidak mengirim perintah kasar │
│ pasien ke Cloud API pihak ketiga        │ sekaligus, melainkan menyusun dialog    │
│ melanggar UU PDP No. 27/2022, standar   │ bertahap yang awalnya wajar guna        │
│ kerahasiaan medis, dan rawan kebocoran. │ membobol persona & mencuri rekam medis. │
└─────────────────────────────────────────┴─────────────────────────────────────────┘
```

**PsychoBot & SIAGA v2** diciptakan sebagai platform terintegrasi untuk menjawab kedua tantangan di atas secara tuntas.

---

## 🏗️ 2. Arsitektur Tingkat Tinggi (High-Level Architecture)

Sistem memadukan komputasi berdaulat (*Sovereign AI*), gerbang pertahanan stateful sub-25ms CPU, dan instrumen klinis digital:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   USER INTERFACE                                       │
│    ┌───────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────┐  │
│    │  Pasien (Care Console)    │  │ Dokter DPJP (Dark HUD)   │  │ SOC Admin Telemetry│  │
│    │  • Skrining PHQ-9 / GAD-7 │  │ • Rekam Medis Klinis     │  │ • Live Guard (CIM)│  │
│    │  • Chat Live Streaming    │  │ • Verifikasi SIP Dokter  │  │ • Log Audit Forensik│ │
│    └─────────────┬─────────────┘  └────────────┬─────────────┘  └─────────┬─────────┘  │
└──────────────────┼─────────────────────────────┼──────────────────────────┼────────────┘
                   │ HTTP / SSE / REST           │                          │
                   ▼                             ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SECURITY GATEWAY (FastAPI :8000)                        │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    SIAGA GUARDRAIL PIPELINE (Sub-25ms CPU)                       │  │
│  │                                                                                  │  │
│  │   [Input] ──► L0: Canonicalizer UTS #39 (Strip Homoglyph & Zero-Width)           │  │
│  │                     │                                                            │  │
│  │                     ▼                                                            │  │
│  │               L1: Dual-Axis Intent Classifier (Coercive & Prompt Injection)      │  │
│  │                     │                                                            │  │
│  │                     ▼                                                            │  │
│  │               L2: Clinical Context & Persona Constraint Evaluator                │  │
│  │                     │                                                            │  │
│  │                     ▼                                                            │  │
│  │               L3: CIM Engine (Cumulative Intent Momentum & Vector Trajectory)    │  │
│  │                     │                                                            │  │
│  │         ┌───────────┴───────────────┬────────────────────────┐                   │  │
│  │         ▼                           ▼                        ▼                   │  │
│  │     [ ALLOW ]                   [ WATCH ]             [ PROBE / BLOCK ]          │  │
│  │  (Momentum < 0.45)          (0.45 ≤ M < 0.60)        (Reverse Turing / Kunci)    │  │
│  └─────────┬────────────────────────────────────────────────────┬───────────────────┘  │
│            │                                                    │                      │
│            ▼                                                    ▼                      │
│  ┌────────────────────────┐                            ┌────────────────────────────┐  │
│  │  LOCAL ON-PREMISE LLM  │                            │    STATEFUL SESSION CACHE  │  │
│  │  (Ollama / vLLM Model) │                            │    (DuckDB Zero-Plaintext) │  │
│  │  • Sovereign Streaming │                            │    • SHA-256 Hash + Vector │  │
│  │  • Qwen 1.7B / CUDA    │                            │    • TTL Expiration 24 Jam │  │
│  └────────────────────────┘                            └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 3. Pilar Utama Komponen Sistem

### 1. PsychoBot Clinical Care Platform
- **Asesmen Klinis Terstandar:** Pengukuran depresi (**PHQ-9**) dan kecemasan (**GAD-7**) berbasis kuesioner interaktif dengan interpretasi skor otomatis (Ringan, Sedang, Parah).
- **Portal Dokter Penanggung Jawab Pelayanan (DPJP):** Mengelola antrean pasien, meninjau riwayat asesmen berkala, dan verifikasi Surat Izin Praktik (**SIP 8-digit**).
- **Interactive Empathetic Counselor:** Sesi konseling berbasis persona psikiatri klinis yang hangat, reflektif, dan tidak memberikan diagnosis farmakologis palsu.

### 2. SIAGA Security Gateway (Stateful Defense-in-Depth)
- **L0 Canonicalizer:** Pembersihan string tingkat biner/karakter (Unicode UTS #39).
- **L1 Dual-Axis Intent Classifier:** Model ONNX INT8 (*MiniLM/IndoBERT*) menganalisis muatan koersif vs asal mesin.
- **L2 Clinical Context Evaluator:** Validasi kepatuhan wewenang sistem dan batas operasional klinis.
- **L3 CIM Engine (Conversational Intent Momentum):** Pelacakan lintasan vektor arah niat kumulatif pada graf semantik DuckDB.
- **Active Reverse Turing Probe:** Tantangan honeypot interaktif untuk memverifikasi apakah lawan bicara adalah manusia atau agen penyerang otomatis.

### 3. Sovereign Local AI Computing
- Menjalankan model bahasa secara lokal melalui **Ollama** (e.g., `qwen3:1.7b`, `qwen2.5:1.5b`) dengan akselerasi GPU **NVIDIA GeForce GTX 1650 (CUDA)**.
- Menghasilkan kecepatan inferensi **~89 token/detik** tanpa mengirim 1 byte pun data pasien ke internet.
- Kompatibel dengan standar API **OpenAI-Compatible** untuk integrasi eksternal jika dibutuhkan.

### 4. Zero-Plaintext Retention Policy
- Seluruh state inspeksi keamanan disimpan di **DuckDB** (`backend/data/siaga_sessions.duckdb`).
- **Tanpa Plaintext:** Hanya menyimpan token SHA-256 hash, vektor embedding terkompresi, dan metadata momentum.
- **TTL 24 Jam:** Seluruh rekaman sesi otomatis kadaluwarsa dan dihapus berkala dari disk.

---

## 💻 4. Ringkasan Tech Stack

| Lapisan | Komponen Teknologi | Peran & Justifikasi Arsitektur |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3.4 | Antarmuka modern, SSR + streaming SSE, type-safety ketat. |
| **Visualisasi** | Recharts, Lucide React | Visualisasi grafik instrumen SOC tanpa animasi palsu. |
| **Backend API** | FastAPI, Python 3.11/3.12, Uvicorn, Pydantic v2 | Gateway asinkron performa tinggi dengan validasi skema ketat. |
| **Stateful DB** | DuckDB Embedded | Pemrosesan graf vektor dan analitik stateful in-process super cepat. |
| **Database User** | Cloud Firestore / SQLite Lokal | Master data akun pengguna, profil, dan rekam medis klinis. |
| **Machine Learning** | ONNX Runtime INT8, Scikit-Learn, NumPy | Inferensi klasifikasi niat berlatensi rendah (<15 ms) pada CPU. |
| **Local LLM** | Ollama Engine (Qwen3 1.7B, CUDA) | Pemrosesan inferensi berdaulat tanpa dependensi pihak ketiga. |
| **Orkestrator** | Python `run.py` & Windows `run.bat` | Unified single-command launcher untuk seluruh proses latar belakang. |

# 🔌 API Contracts & Database Architecture

> **Knowledge Base Bab 5** · Platform: PsychoBot Clinical Care & SIAGA Guardrail Platform  
> **Komponen:** `backend/app/routers/`, `schemas.py`, `db.py`, `core/l3_cim/state.py`  
> **Klasifikasi:** Dokumen Spesifikasi Kontrak API, Skema Database & Penyimpanan Sesi

---

## 📌 1. Standar Keamanan & Otentikasi API

- **Base URL:** `http://localhost:8000` (Development)
- **Protokol Header:** Seluruh endpoint (kecuali `/health`) mewajibkan header otentikasi:
  ```http
  Authorization: Bearer <token>
  ```
- **Mode Token:**
  - **Produksi:** Token ID Firebase (*JWT terverifikasi via Firebase Admin SDK*).
  - **Development:** Token lokal cepat dengan format `dev-<role>-<id>` (contoh: `dev-patient-1`, `dev-doctor-1`, `dev-admin-1`).
- **Gateway Hardening Middleware:**
  - **Payload Cap:** Maksimal ukuran body request sebesar **32 KB** (HTTP 413 jika terlampaui).
  - **Rate Limiting:** Maksimal **100 request / menit** per IP host (HTTP 429 jika terlampaui).

---

## 📋 2. Katalog Endpoint FastAPI

### A. Chat & Streaming AI (`/v1/chat`)

| Metode | Rute | Deskripsi & Format |
|---|---|---|
| **POST** | `/v1/chat/stream` | Mengirim pesan ke pipeline SIAGA L0–L3 lalu streaming respons Local AI via **Server-Sent Events (SSE)**. Mengalirkan event `guardrail` $\rightarrow$ `token` $\rightarrow$ `done`. |
| **POST** | `/v1/chat/message` | Endpoint non-streaming (sinkron). Mengembalikan JSON lengkap dengan skor risiko dan metrik momentum. |
| **GET** | `/v1/chat/sessions` | Mendapatkan daftar seluruh sesi percakapan aktif milik pasien yang terotentikasi. |
| **POST** | `/v1/chat/sessions` | Membuat sesi percakapan konseling baru. |
| **GET** | `/v1/chat/sessions/{id}/messages` | Mengambil seluruh riwayat pesan (user & assistant) dalam satu sesi. |
| **GET** | `/v1/chat/sessions/{id}/metrics` | Mengambil titik-titik data momentum CIM ($M_t$) per turn untuk visualisasi grafik. |
| **POST** | `/v1/chat/probe/verify` | Memvalidasi jawaban pengguna terhadap tantangan Reverse Turing Probe. |

#### Contoh Payload Request `POST /v1/chat/stream`:
```json
{
  "session_id": "sess_5aebf080ada2",
  "content": "Halo, saya merasa sangat cemas beberapa hari terakhir."
}
```

---

### B. Asesmen Klinis (`/v1/assessments`)

| Metode | Rute | Deskripsi & Format |
|---|---|---|
| **POST** | `/v1/assessments/submit` | Mengirimkan lembar jawaban kuesioner **PHQ-9** (9 butir) atau **GAD-7** (7 butir). Backend otomatis menghitung total skor, tingkat keparahan (*Mild, Moderate, Severe*), dan rekomendasi tindakan klinis. |
| **GET** | `/v1/assessments/history` | Mengambil riwayat tren skor asesmen berkala pasien untuk melihat perkembangan terapi. |

---

### C. Portal Dokter DPJP (`/v1/doctor`)

| Metode | Rute | Deskripsi & Format |
|---|---|---|
| **GET** | `/v1/doctor/patients` | Daftar pasien yang berada di bawah penanganan dokter yang login. |
| **GET** | `/v1/doctor/patients/{id}` | Rekam medis detail, riwayat konsultasi chat, dan grafik skrining pasien. |
| **POST** | `/v1/doctor/verify-license` | Verifikasi nomor Surat Izin Praktik (**SIP 8-digit**) dokter ke sistem kementerian/konsil kedokteran. |

---

### D. SOC Security Telemetry & Admin (`/v1/admin` & `/health`)

| Metode | Rute | Deskripsi & Format |
|---|---|---|
| **GET** | `/v1/admin/telemetry` | Mengambil snapshot seluruh sesi yang sedang dipantau oleh Live Guard Monitor beserta nilai momentum terkininya. |
| **GET** | `/v1/admin/logs` | Mengambil daftar log insiden keamanan (*security incident logs*) lengkap dengan alasan blokir/probe dan latensi eksekusi L0–L3. |
| **GET** | `/health` | Health check publik sistem (mengembalikan status mesin SIAGA, versi engine, dan path database DuckDB). |

---

## 🗄️ 3. Skema Database DuckDB (Stateful Guardrail)

Tersimpan secara lokal di [`backend/data/siaga_sessions.duckdb`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/backend/data):

```sql
-- 1. Tabel Sesi Keamanan
CREATE TABLE sessions (
    session_id VARCHAR PRIMARY KEY,
    channel_owned BOOLEAN,
    channel VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    turns_count INTEGER,
    blocked BOOLEAN,
    ttd_turn INTEGER,
    momentum_prev DOUBLE,
    momentum_override DOUBLE,
    anchor_baseline DOUBLE,
    baseline_max DOUBLE,
    probe_count INTEGER,
    pending_probe_level INTEGER,
    pending_probe_type VARCHAR,
    pending_probe_canary VARCHAR
);

-- 2. Tabel Giliran Percakapan (Hanya Hash, Tanpa Teks Mentah)
CREATE TABLE turns (
    session_id VARCHAR,
    turn_index INTEGER,
    created_at TIMESTAMP,
    text_hash VARCHAR,          -- SHA-256 dari teks kanonikal
    risk_r DOUBLE,
    delta DOUBLE,
    direction DOUBLE,
    anchor DOUBLE,
    decay DOUBLE,
    momentum DOUBLE,
    intent DOUBLE,
    provenance DOUBLE,
    context_risk DOUBLE,
    decision VARCHAR,
    PRIMARY KEY (session_id, turn_index)
);

-- 3. Tabel Vektor Semantik (Untuk Graf Lintasan & Resurgence Boost)
CREATE TABLE embeddings (
    session_id VARCHAR,
    turn_index INTEGER,
    vector FLOAT[],             -- Vektor representasi semantik 384-dim
    risk DOUBLE,
    momentum DOUBLE,
    PRIMARY KEY (session_id, turn_index)
);

-- 4. Tabel Log Forensik Keamanan
CREATE TABLE security_logs (
    log_id VARCHAR PRIMARY KEY,
    session_id VARCHAR,
    patient_uid VARCHAR,
    timestamp TIMESTAMP,
    risk_score DOUBLE,
    decision VARCHAR,
    explanation VARCHAR,
    latency_ms DOUBLE
);
```

---

## 🏬 4. Skema Database Master Data (SQLite / Firestore)

Tersimpan di `backend/data/psycho_local.db` untuk mode offline / development:
- **`users`:** `uid`, `email`, `displayName`, `role` (`patient` | `doctor` | `admin`), `sipNumber`, `onboardingCompleted`.
- **`chat_sessions`:** `sessionId`, `patientUid`, `title`, `status` (`active` | `flagged` | `blocked`), `turnsCount`, `lastActivityAt`.
- **`chat_messages`:** `messageId`, `sessionId`, `role` (`user` | `assistant`), `content`, `riskScore`, `decision`, `createdAt`.
- **`assessments`:** `assessmentId`, `patientUid`, `type` (`PHQ9` | `GAD7`), `answers`, `score`, `severity`, `createdAt`.

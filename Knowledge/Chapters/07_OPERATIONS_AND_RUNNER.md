# 🛠️ Operations, Runner & Deployment Guide

> **Knowledge Base Bab 7** · Platform: PsychoBot Clinical Care & SIAGA Guardrail Platform  
> **Komponen:** `run.py`, `run.bat`, `package.json`, `.env`  
> **Klasifikasi:** Dokumen Panduan Operasional, Manajemen Proses & Pemecahan Masalah

---

## 📌 1. Filosofi & Arsitektur Unified Runner ([`run.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/run.py))

Menjalankan aplikasi fullstack terdistribusi di lingkungan lokal (Local AI + Backend API + Frontend SPA) sering kali merepotkan karena pengembang harus membuka 3 jendela terminal berbeda:
1. `ollama serve` (di terminal 1)
2. `uvicorn app.main:app` (di terminal 2)
3. `npm run dev` (di terminal 3)

Selain tidak efisien, mematikan terminal-terminal tersebut di Windows sering kali menyisakan **proses yatim (*orphan processes*)** yang tetap menduduki port (Port 8000 / 3000 / 11434 menggantung).

Skrip [`run.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/run.py) menyelesaikan masalah ini melalui **Single Process Tree Orchestrator**:

```
[ User: run.bat / python run.py ]
               │
               ▼
      [ run.py Controller ]
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
[ OLLAMA ]  [ FASTAPI ]  [ NEXT.JS ]
 (:11434)     (:8000)      (:3000)
   │           │           │
   └───────────┼───────────┘
               │ (Non-blocking IO Multiplexer)
               ▼
 [ Terminal Berwarna & Live Log ]
```

---

## 🚀 2. Cara Menjalankan

### Cara 1: Windows 1-Click Batch (`run.bat`)
Cukup klik dua kali berkas [`run.bat`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/run.bat) di File Explorer atau ketik di PowerShell/CMD:
```cmd
run.bat
```

### Cara 2: Python Universal
```bash
python run.py
```

### Cara 3: NPM Root Script
```bash
npm run dev
```

### Opsi Parameter Flag:
| Parameter | Fungsi |
|---|---|
| `--no-open` | Menonaktifkan pembukaan browser secara otomatis setelah kedua server siap. |
| `--backend-only` | Hanya menjalankan server Backend FastAPI dan Ollama. |
| `--frontend-only` | Hanya menjalankan server Frontend Next.js. |
| `--no-reload` | Mematikan fitur hot-reload Uvicorn (disarankan saat demonstrasi stabil). |
| `--port-backend <int>` | Kustomisasi port backend (default: `8000`). |
| `--port-frontend <int>` | Kustomisasi port frontend (default: `3000`). |

---

## 🛑 3. Mekanisme Pembersihan Proses (*Graceful Taskkill*)

Di Windows, pemanggilan `process.terminate()` biasa pada skrip shell `npm.cmd` atau `uvicorn` sering kali hanya membunuh proses pembungkusnya, sementara proses anak `node.exe` dan `python.exe` tetap berjalan di latar belakang.

[`run.py`](file:///D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA-v2/run.py) mengatasi hal ini dengan mengeksekusi pohon pembersihan rekursif:

```python
def kill_process_tree(pid: int):
    if os.name == "nt":
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], check=False)
```

Saat Anda menekan `Ctrl+C`, sinyal interupsi ditangkap dan seluruh hierarki proses anak dijamin bersih tanpa ada port yang tersangkut.

---

## ⚙️ 4. Variabel Lingkungan (*Environment Variables*)

### Backend (`backend/.env`):
| Variabel | Default | Deskripsi |
|---|---|---|
| `LLM_PROVIDER` | `ollama` | Provider LLM (`ollama` atau `openai_compatible`). |
| `LLM_BASE_URL` | `http://localhost:11434` | Endpoint server LLM. |
| `LLM_MODEL` | `qwen3:1.7b` | Nama model yang digunakan. |
| `LLM_API_KEY` | *(kosong)* | API Key jika menggunakan model cloud (OpenRouter/DeepSeek). |
| `SIAGA_THRESHOLD_PROBE` | `0.60` | Ambang batas pemicu Reverse Turing Probe. |
| `SIAGA_THRESHOLD_BLOCK` | `0.80` | Ambang batas penguncian sesi (Block). |
| `SIAGA_TTL_HOURS` | `24` | Masa simpan sesi di DuckDB sebelum dihapus. |

### Frontend (`frontend/.env.local`):
| Variabel | Default | Deskripsi |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL endpoint Backend FastAPI. |
| `NEXT_PUBLIC_USE_MOCK` | *(kosong)* | Jika diisi `1`, memaksa frontend berjalan 100% pada mode mock. |

---

## 🔧 5. Panduan Pemecahan Masalah (Troubleshooting)

### Kasus 1: "IO Error: Cannot open file ... siaga_sessions.duckdb"
* **Penyebab:** Ada proses Python lama yang masih mengunci file DuckDB secara eksklusif.
* **Solusi:** Matikan proses Python yang tersisa lewat PowerShell:
  ```powershell
  Get-Process python | Stop-Process -Force
  ```

### Kasus 2: "Port 8000 atau 3000 sudah digunakan"
* **Penyebab:** Ada proses background Node atau Uvicorn lama yang belum ditutup.
* **Solusi:** Cek dan matikan proses pemilik port:
  ```powershell
  Get-NetTCPConnection -LocalPort 8000, 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```

### Kasus 3: Model Local AI Berjalan Lambat
* **Penyebab:** Ollama berjalan pada CPU alih-alih GPU NVIDIA.
* **Solusi:** Pastikan driver NVIDIA telah terpasang dan `nvidia-smi` dapat mendeteksi GPU Anda. `run.py` secara otomatis menggunakan flag CUDA jika kartu grafis terdeteksi.

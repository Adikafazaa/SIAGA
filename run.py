#!/usr/bin/env python3
"""
PsychoBot & SIAGA v2 — Unified Fullstack Launcher
Menjalankan Frontend (Next.js) dan Backend (FastAPI) secara bersamaan dalam 1 terminal.
"""
from __future__ import annotations

import argparse
import os
import shutil
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

# Enable ANSI escape sequences on Windows console
if os.name == "nt":
    os.system("")

# Ensure UTF-8 output if possible
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# ANSI Colors
CLR_RESET = "\033[0m"
CLR_BOLD = "\033[1m"
CLR_DIM = "\033[2m"
CLR_CYAN = "\033[96m"
CLR_GREEN = "\033[92m"
CLR_YELLOW = "\033[93m"
CLR_RED = "\033[91m"
CLR_MAGENTA = "\033[95m"

TAG_BACKEND = f"{CLR_CYAN}{CLR_BOLD}[BACKEND]{CLR_RESET}"
TAG_FRONTEND = f"{CLR_GREEN}{CLR_BOLD}[FRONTEND]{CLR_RESET}"
TAG_OLLAMA = f"{CLR_MAGENTA}{CLR_BOLD}[OLLAMA]{CLR_RESET}"
TAG_SYSTEM = f"{CLR_YELLOW}{CLR_BOLD}[SYSTEM]{CLR_RESET}"

OLLAMA_EXE_PATHS = [
    Path(r"D:\PROJECT\SELF EXPERIMENT\PERSONAL AI\NEW_SYSTEM\OllamaProgram\ollama.exe"),
    Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "Ollama" / "ollama.exe",
    Path(r"C:\Program Files\Ollama\ollama.exe"),
]
OLLAMA_MODELS_DIR = Path(r"D:\PROJECT\SELF EXPERIMENT\PERSONAL AI\NEW_SYSTEM\OllamaModels")


def find_ollama_executable() -> str | None:
    """Mencari executable ollama."""
    for p in OLLAMA_EXE_PATHS:
        if p.is_file():
            return str(p)
    return shutil.which("ollama.exe") or shutil.which("ollama")


def log_sys(msg: str):
    print(f"{TAG_SYSTEM} {msg}", flush=True)


def is_port_open(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0


def kill_process_tree(pid: int):
    """Membunuh proses dan semua child process-nya secara bersih di Windows / POSIX."""
    if os.name == "nt":
        try:
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        except Exception:
            pass
    else:
        try:
            os.killpg(os.getpgid(pid), signal.SIGTERM)
        except Exception:
            try:
                os.kill(pid, signal.SIGTERM)
            except Exception:
                pass


def stream_logs(pipe, tag: str):
    """Membaca output stdout/stderr dari subprocess secara non-blocking dan memberi prefix."""
    try:
        for line in iter(pipe.readline, ""):
            if not line:
                break
            line_str = line.rstrip()
            if line_str:
                print(f"{tag} {line_str}", flush=True)
    except Exception:
        pass
    finally:
        pipe.close()


def find_python_executable() -> str:
    """Mencari interpreter Python di backend (.venv / venv / system)."""
    candidates = [
        BACKEND_DIR / ".venv" / "Scripts" / "python.exe",
        BACKEND_DIR / "venv" / "Scripts" / "python.exe",
        BACKEND_DIR / ".venv" / "bin" / "python",
        BACKEND_DIR / "venv" / "bin" / "python",
    ]
    for p in candidates:
        if p.is_file():
            return str(p)
    return sys.executable


def find_npm_executable() -> str:
    """Mencari executable npm/npx."""
    if os.name == "nt":
        cmd = shutil.which("npm.cmd") or shutil.which("npm")
        if cmd:
            return cmd
    cmd = shutil.which("npm")
    if cmd:
        return cmd
    raise FileNotFoundError("npm tidak ditemukan di PATH sistem. Pastikan Node.js terpasang.")


def wait_for_port(port: int, host: str = "127.0.0.1", timeout: float = 30.0, interval: float = 0.5) -> bool:
    """Menunggu port TCP terbuka dan menerima koneksi."""
    start = time.time()
    while time.time() - start < timeout:
        if is_port_open(port, host):
            return True
        time.sleep(interval)
    return False


def main():
    parser = argparse.ArgumentParser(
        description="Unified Launcher PsychoBot & SIAGA v2 (Frontend + Backend)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--no-open", action="store_true", help="Jangan otomatis membuka browser saat siap")
    parser.add_argument("--backend-only", action="store_true", help="Hanya jalankan Backend FastAPI")
    parser.add_argument("--frontend-only", action="store_true", help="Hanya jalankan Frontend Next.js")
    parser.add_argument("--no-reload", action="store_true", help="Matikan mode hot-reload pada Uvicorn")
    parser.add_argument("--port-backend", type=int, default=8000, help="Port untuk Backend FastAPI")
    parser.add_argument("--port-frontend", type=int, default=3000, help="Port untuk Frontend Next.js")
    parser.add_argument("--tap-benchmark", action="store_true", help="Jalankan Automated TAP Red-Team Benchmark Suite (Pilar 4)")
    parser.add_argument("--calibration", action="store_true", help="Buka HackNusa Calibration Dashboard di browser")
    args = parser.parse_args()

    # Mode Khusus: Eksekusi TAP Benchmark
    if args.tap_benchmark:
        py_exec = find_python_executable()
        cmd = [py_exec, "-m", "app.tap_runner"]
        return subprocess.run(cmd, cwd=str(BACKEND_DIR)).returncode

    # Mode Khusus: Buka Calibration Dashboard HTML
    if args.calibration:
        calib_file = ROOT_DIR / "Knowledge" / "siaga_v2.html"
        if not calib_file.is_file():
            calib_file = ROOT_DIR / "siaga_v2.html"
        if not calib_file.is_file():
            calib_file = ROOT_DIR / "Knowledge" / "siaga_v2_hacknusa_calibration_app (1).html"
        print(f"{TAG_SYSTEM} Membuka HackNusa Calibration Dashboard: {calib_file}")
        webbrowser.open(calib_file.as_uri())
        return 0

    run_backend = not args.frontend_only
    run_frontend = not args.backend_only

    print(f"\n{CLR_BOLD}{CLR_MAGENTA}=================================================================={CLR_RESET}")
    print(f"{CLR_BOLD}{CLR_CYAN}  🛡️  PSYCHOBOT & SIAGA v2 — FULLSTACK UNIFIED LAUNCHER{CLR_RESET}")
    print(f"{CLR_DIM}  Sovereign Clinical Care & Stateful Guardrail Architecture{CLR_RESET}")
    print(f"{CLR_BOLD}{CLR_MAGENTA}=================================================================={CLR_RESET}\n")

    # 1. Pengecekan Port
    if run_backend and is_port_open(args.port_backend):
        log_sys(f"{CLR_RED}Peringatan: Port {args.port_backend} (Backend) sudah digunakan oleh proses lain!{CLR_RESET}")
        log_sys("Harap matikan proses yang menggunakan port tersebut terlebih dahulu.")
        return 1

    if run_frontend and is_port_open(args.port_frontend):
        log_sys(f"{CLR_RED}Peringatan: Port {args.port_frontend} (Frontend) sudah digunakan oleh proses lain!{CLR_RESET}")
        log_sys("Harap matikan proses yang menggunakan port tersebut terlebih dahulu.")
        return 1

    # 2. Pengecekan Executable
    py_exec = find_python_executable()
    log_sys(f"Python interpreter : {CLR_DIM}{py_exec}{CLR_RESET}")

    npm_exec = None
    if run_frontend:
        try:
            npm_exec = find_npm_executable()
            log_sys(f"Node / NPM runner  : {CLR_DIM}{npm_exec}{CLR_RESET}")
        except Exception as e:
            log_sys(f"{CLR_RED}Error: {e}{CLR_RESET}")
            return 1

    processes: list[subprocess.Popen] = []
    threads: list[threading.Thread] = []

    # 2.5. Pengecekan & Menjalankan Local AI (Ollama)
    ollama_ready = False
    if run_backend:
        if is_port_open(11434):
            log_sys(f"{CLR_GREEN}Local AI Ollama sudah aktif di port 11434.{CLR_RESET}")
            ollama_ready = True
        else:
            ollama_bin = find_ollama_executable()
            if ollama_bin:
                log_sys(f"Memulai Local AI Engine (Ollama) dari {CLR_DIM}{ollama_bin}{CLR_RESET}...")
                ollama_env = os.environ.copy()
                if OLLAMA_MODELS_DIR.is_dir():
                    ollama_env["OLLAMA_MODELS"] = str(OLLAMA_MODELS_DIR)
                try:
                    p_ollama = subprocess.Popen(
                        [ollama_bin, "serve"],
                        env=ollama_env,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT,
                        text=True,
                        bufsize=1,
                        universal_newlines=True,
                    )
                    processes.append(p_ollama)
                    t_ollama = threading.Thread(target=stream_logs, args=(p_ollama.stdout, TAG_OLLAMA), daemon=True)
                    t_ollama.start()
                    threads.append(t_ollama)
                    if wait_for_port(11434, timeout=12.0):
                        log_sys(f"{CLR_GREEN}Ollama Local AI siap pada port 11434.{CLR_RESET}")
                        ollama_ready = True
                    else:
                        log_sys(f"{CLR_YELLOW}Ollama diluncurkan namun belum merespons port 11434.{CLR_RESET}")
                except Exception as e:
                    log_sys(f"{CLR_YELLOW}Gagal meluncurkan Ollama otomatis: {e}{CLR_RESET}")
            else:
                log_sys(f"{CLR_YELLOW}Ollama executable tidak terdeteksi. Backend akan menggunakan mode fallback jika Ollama offline.{CLR_RESET}")

    # 3. Jalankan Backend
    if run_backend:
        backend_cmd = [
            py_exec,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            str(args.port_backend),
        ]
        if not args.no_reload:
            backend_cmd.append("--reload")

        log_sys(f"Memulai Backend FastAPI pada port {args.port_backend}...")
        try:
            p_be = subprocess.Popen(
                backend_cmd,
                cwd=str(BACKEND_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
            )
            processes.append(p_be)
            t_be = threading.Thread(target=stream_logs, args=(p_be.stdout, TAG_BACKEND), daemon=True)
            t_be.start()
            threads.append(t_be)
        except Exception as e:
            log_sys(f"{CLR_RED}Gagal menjalankan Backend: {e}{CLR_RESET}")
            return 1

    # 4. Jalankan Frontend
    if run_frontend and npm_exec:
        frontend_cmd = [npm_exec, "run", "dev", "--", "-p", str(args.port_frontend)]
        log_sys(f"Memulai Frontend Next.js pada port {args.port_frontend}...")
        try:
            p_fe = subprocess.Popen(
                frontend_cmd,
                cwd=str(FRONTEND_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
            )
            processes.append(p_fe)
            t_fe = threading.Thread(target=stream_logs, args=(p_fe.stdout, TAG_FRONTEND), daemon=True)
            t_fe.start()
            threads.append(t_fe)
        except Exception as e:
            log_sys(f"{CLR_RED}Gagal menjalankan Frontend: {e}{CLR_RESET}")
            for p in processes:
                kill_process_tree(p.pid)
            return 1

    # 5. Background Monitor & Auto-Open Browser
    def readiness_check():
        be_ready = False
        fe_ready = False

        if run_backend:
            be_ready = wait_for_port(args.port_backend, timeout=25.0)
        else:
            be_ready = True

        if run_frontend:
            fe_ready = wait_for_port(args.port_frontend, timeout=30.0)
        else:
            fe_ready = True

        if be_ready and fe_ready:
            print("\n" + "=" * 66, flush=True)
            print(f"{CLR_GREEN}{CLR_BOLD}  🚀  KEDUA LAYANAN SIAP DIGUNAKAN!{CLR_RESET}", flush=True)
            print("=" * 66, flush=True)
            if is_port_open(11434):
                print(f"  🧠  {CLR_BOLD}Local AI (Ollama):{CLR_RESET}   http://localhost:11434 (Model: qwen3:1.7b)", flush=True)
            if run_frontend:
                print(f"  🌐  {CLR_BOLD}Frontend (Next.js):{CLR_RESET}  http://localhost:{args.port_frontend}", flush=True)
            if run_backend:
                print(f"  ⚙️   {CLR_BOLD}Backend (FastAPI):{CLR_RESET}   http://localhost:{args.port_backend}/docs", flush=True)
                print(f"  🩺  {CLR_BOLD}Health Status:{CLR_RESET}       http://localhost:{args.port_backend}/health", flush=True)
            print("=" * 66, flush=True)
            print(f"{CLR_DIM}  Tekan Ctrl+C untuk mematikan semua layanan secara bersih.{CLR_RESET}\n", flush=True)

            if not args.no_open and run_frontend:
                try:
                    time.sleep(0.5)
                    webbrowser.open(f"http://localhost:{args.port_frontend}")
                except Exception:
                    pass

    t_ready = threading.Thread(target=readiness_check, daemon=True)
    t_ready.start()

    # 6. Event Loop & Graceful Shutdown
    try:
        while True:
            # Check if any process terminated unexpectedly
            for p in processes:
                code = p.poll()
                if code is not None:
                    log_sys(f"{CLR_RED}Salah satu layanan berhenti mendadak (Exit Code: {code}). Menghentikan semua layanan...{CLR_RESET}")
                    return code
            time.sleep(0.5)
    except KeyboardInterrupt:
        print(f"\n{TAG_SYSTEM} {CLR_YELLOW}Sinyal Ctrl+C diterima. Mematikan semua proses...{CLR_RESET}")
    finally:
        for p in processes:
            log_sys(f"Menghentikan PID {p.pid}...")
            kill_process_tree(p.pid)
        log_sys(f"{CLR_GREEN}Semua layanan berhasil dimatikan dengan bersih.{CLR_RESET}")

    return 0


if __name__ == "__main__":
    sys.exit(main())

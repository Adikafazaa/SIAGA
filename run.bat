@echo off
setlocal
cd /d "%~dp0"

echo ==================================================================
echo   [SIAGA v2] Menjalankan Frontend + Backend...
echo ==================================================================

if exist "backend\.venv\Scripts\python.exe" (
    "backend\.venv\Scripts\python.exe" run.py %*
) else if exist "backend\venv\Scripts\python.exe" (
    "backend\venv\Scripts\python.exe" run.py %*
) else (
    python run.py %*
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Terjadi masalah saat menjalankan layanan.
    pause
)

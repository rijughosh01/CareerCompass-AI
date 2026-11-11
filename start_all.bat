@echo off
title CareerCompass AI - Application Launcher
echo ========================================================
echo   Launching CareerCompass AI Full-Stack Application
echo ========================================================

cd /d "%~dp0"

echo 1. Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "CareerCompass Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo 2. Starting Vite Frontend on http://localhost:5173 ...
start "CareerCompass Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ========================================================
echo   CareerCompass AI is running!
echo   - Web App: http://localhost:5173
echo   - API Docs: http://127.0.0.1:8000/docs
echo ========================================================


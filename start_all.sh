#!/usr/bin/env bash
echo "========================================================"
echo "  Launching CareerCompass AI Full-Stack Application"
echo "========================================================"

# Always navigate to the script directory (project root)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "1. Starting FastAPI Backend on http://127.0.0.1:8000 ..."
(cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

echo "2. Waiting 3 seconds for backend initialization..."
sleep 3

echo "3. Starting Vite Frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "========================================================"
echo "  CareerCompass AI is running!"
echo "  - Web Application: http://localhost:5173"
echo "  - Interactive API Docs: http://127.0.0.1:8000/docs"
echo "  Press Ctrl+C to stop both servers."
echo "========================================================"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait


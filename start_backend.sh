#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/backend"
echo "Starting CareerCompass AI Backend on http://127.0.0.1:8000 ..."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload


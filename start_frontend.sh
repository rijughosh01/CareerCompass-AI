#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/frontend"
echo "Starting CareerCompass AI Frontend on http://localhost:5173 ..."
npm run dev


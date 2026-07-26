#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  Discipline Quest - Starting Up"
echo "============================================"
echo

if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env from the template..."
  cp backend/.env.example backend/.env
fi

if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies - first run only..."
  npm install --prefix backend
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies - first run only..."
  npm install --prefix frontend
fi

if [ ! -d "frontend/dist" ]; then
  echo "Building frontend..."
  npm run build --prefix frontend
fi

echo
echo "Starting server (first run also downloads a small embedded database,"
echo "needs internet just this once)..."
echo "Once ready, open http://localhost:5000"
echo "Press Ctrl+C to stop."
echo

npm start --prefix backend

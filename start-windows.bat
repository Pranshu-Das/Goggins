@echo off
setlocal
title Discipline Quest
cd /d "%~dp0"

echo ============================================
echo   Discipline Quest - Starting Up
echo ============================================
echo.

REM --- First-time setup: backend .env (no database setup required) ---
if not exist "backend\.env" (
    echo Creating backend\.env from the template...
    copy "backend\.env.example" "backend\.env" >nul
)

REM --- Install backend dependencies if needed ---
if not exist "backend\node_modules" (
    echo Installing backend dependencies - first run only, this may take a minute...
    call npm install --prefix backend
)

REM --- Install frontend dependencies if needed ---
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies - first run only, this may take a minute...
    call npm install --prefix frontend
)

REM --- Build the frontend if it hasn't been built ---
if not exist "frontend\dist" (
    echo Building frontend...
    call npm run build --prefix frontend
)

echo.
echo Starting server ^(first run also downloads a small embedded database,
echo needs internet just this once^)...
echo Once you see "Server running on port 5000", the app will open at:
echo   http://localhost:5000
echo.
echo Leave this window open while using the app. Close it to stop the server.
echo.

start "" http://localhost:5000
call npm start --prefix backend

pause

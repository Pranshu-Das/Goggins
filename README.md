# Discipline Quest

A gamified daily-discipline tracker — build habits, keep streaks, earn XP, level up, and unlock achievements. Inspired by apps like Arise / Dialed In, but built from scratch as a full-stack project (Express + React + Node, with an embedded MongoDB — no separate database install required).

## Monorepo structure

```
discipline-app/
├── backend/     Node.js + Express API (JWT auth) + embedded MongoDB
└── frontend/    React (Vite) web client
```

## Core concepts

- **Habits** — things you want to do daily/weekly (e.g. "Wake up at 6am", "Read 20 pages")
- **Habit Logs** — a completion record for a habit on a given day
- **Streaks** — consecutive days a habit (or your whole routine) was completed without a miss
- **XP & Levels** — completing habits earns XP; XP accumulates into levels using an RPG-style curve
- **Achievements** — unlocked automatically when conditions are met (7-day streak, level 5, 100 total completions, etc.)

## Quick start (one click)

- **Windows:** double-click `start-windows.bat`
- **Mac/Linux:** double-click `start-mac-linux.sh` (or run `./start-mac-linux.sh` in a terminal)

No MongoDB install needed — the backend starts an embedded MongoDB automatically and stores data in `backend/.data/`. (The very first run downloads a small MongoDB binary for this, so it needs internet just once; after that it works fully offline.)

The first time you run it, it will:
1. Create `backend/.env` from the template (defaults work out of the box)
2. Install backend and frontend dependencies
3. Build the frontend into static files
4. Start the server, auto-seed the achievement list, and open **http://localhost:5000** in your browser

Every run after that just starts the server — takes a few seconds. Close the terminal/command window to stop it.

This runs the frontend and backend as a single process on one port (5000), since the backend serves the built frontend directly.

## Getting started manually (for active development)

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev              # starts on http://localhost:5000
```

By default this uses the embedded MongoDB — nothing else to install. If you'd rather point it at a real MongoDB (local install or [Atlas](https://www.mongodb.com/atlas)), set `MONGO_URI` in `.env` and it'll connect to that instead.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api` (see `frontend/src/api/axios.js` — change `VITE_API_URL` in a `.env` file there if needed).

### 3. Git

This repo is meant to be your own git project. From the `discipline-app` root:

```bash
git init
git add .
git commit -m "Initial scaffold: auth, habits, streaks, XP system"
```

Both `backend/` and `frontend/` have their own `.gitignore` (node_modules, .env, build output) already set up.

## Roadmap (suggested build order)

1. ✅ Auth (register/login, JWT)
2. ✅ Habit CRUD
3. ✅ Daily check-in → streak + XP calculation
4. ✅ Level system + achievements (backend logic scaffolded)
5. ⬜ Dashboard polish (charts, heatmap calendar)
6. ⬜ Push/local notifications & reminders
7. ⬜ React Native app reusing the same backend API
8. ⬜ Social features (friends, leaderboards) — optional

See inline comments in the code (especially `backend/src/utils/xpSystem.js` and `streakSystem.js`) — that's the "engine" of the gamification and the part most worth customizing to taste.

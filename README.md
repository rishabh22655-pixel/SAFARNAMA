# Safarnama — Travel Startup ("New Journey Beyond Travelling")

Cinematic, travel-film aesthetic web application built for boutique travel startup **Safarnama**. Features curated seasonal travel windows, capped cohort reservations, Open-Meteo meteorological surveillance, OSRM routing validation, and Gemini AI server-side intelligence.

---

## Tech Stack & Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, React Router v6.
- **Maps & Routing**: Leaflet, OpenStreetMap, CartoDB Dark Matter, and Open Source Routing Machine (OSRM).
- **Weather Surveillance**: Open-Meteo Live Meteorology API (no API key required).
- **AI Core**: Google Gemini API (`gemini-1.5-flash`), strictly called **server-side only** with Zod schema validation. Never exposes API keys to client browsers.
- **Database & Sync**: Supabase (Postgres, Auth, Realtime, Row-Level Security) with offline-first localStorage support.

---

## Core Features Implemented

### Part A: Visual Planner (1:1 Screenshot Match)
- **Cinematic Dark Luxury Aesthetic**: Warm black `#0C0A09` background, `#141210` cards, `#F5A65B` amber brand accents, and `Cormorant Garamond` editorial serif headings.
- **Hero**: Kedarnath Himalayan Dawn panorama with the exact copy: *"Build the trip, then hold a seat in the window"*.
- **Step 01 — Choose your destinations**: Multi-select cards for Bali (Tegalalang), Ooty (The Nilgiris), Kedarnath (3,583 m), Mussoorie (Camel's Back), and Offbeat India (Western Ghats & Cold Desert).
- **Step 02 — Pick a departure window & activities**: Two seasonal windows per destination with strict database capacity enforcement, seats left counter, and addable outdoor/indoor activities.
- **Sticky Trip Summary**: Live reactive calculations for nights on the road, per-person rates, travellers stepper, grand total, plan naming, and offline-to-cloud migration on sign in.

### Part B1: AI Dynamic Replanning (Priority 1)
- **Live Disruption Engine**: Scans Open-Meteo hourly weather for upcoming outdoor itinerary stops. Flags disruptions when precipitation probability > 70%, wind gusts > 50 km/h, or extreme temperatures occur.
- **Gemini Structured Replanner**: Server endpoint calls Gemini to generate 2–3 alternative plans. Output is validated server-side against a Zod schema.
- **OSRM Feasibility Check**: Consecutive travel legs in each alternative are checked via OSRM routing; infeasible routes (> 7 hours or impossible transit) are dropped.
- **Diff & Undo UI**: Visual diff modal showing removed, added, and modified items, with cost delta and travel hours. Full undo snapshot history rollback.

### Part B2: Smart Group Trip Planning (Priority 2)
- **Invite Links**: Shareable `/join/:inviteCode` links for group cohorts.
- **Member Preferences**: Submit individual budgets, dietary needs, pacing, and interests.
- **Ranked-Choice Voting**: One ballot per member with live Borda-count runoff tally and owner lock.
- **Proposals & Comments**: Member change proposal workflow with owner approval.
- **Minimal Debt Settlement**: Optimal greedy bipartite debt settlement algorithm condensing all pairwise debts into minimal transactions.

### Part B3: Automated Budget Intelligence (Priority 3)
- **5 Categories**: Transport, accommodation, food, activities, plus mandatory 10% safety buffer.
- **Data Badging**: Visual badges distinguishing `LIVE` (with timestamp & source), `ESTIMATE`, and `USER-ENTERED`.
- **Warning Thresholds**: Visual alerts at 80% and 100% of budget.
- **Cheaper Alternatives**: AI proposes concrete swaps; savings are **strictly recomputed server-side** before presentation.

### Part B4: Trip Dashboard & AI Concierge
- **Expedition Dashboard (`/trips/:id`)**: Timeline, OSRM Leaflet map, progress tracker, alerts, and member list.
- **AI Concierge**: Tool-calling chat agent (`add_item`, `edit_item`, `trigger_replan`). Any write modification requires **explicit user confirmation**.
- **Forecast-Aware Packing Generator**: Checks duration, temperature, and activities to suggest checkable gear.
- **Booking Transparency**: Outbound links to verified operators; clear disclosure that no autonomous booking or charging occurs without user confirmation.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ and npm installed.

### 2. Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Add your Gemini API key inside `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
Run both the frontend and backend servers concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### 5. Supabase Setup (Optional)
To run with a live Supabase project:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/20261114000000_init_safarnama_schema.sql` in the Supabase SQL Editor.
3. Run `supabase/seed.sql` to populate destinations, windows, and activities.
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`.

## Deploy to Render

The included `render.yaml` configures one Node web service to build the Vite frontend and serve it alongside the Express API.

1. In Render, choose **New → Blueprint**, connect `rishabh22655-pixel/SAFARNAMA`, and deploy the `main` branch.
2. Render builds with `npm ci --include=dev && npm run build`, starts with `npm run server`, and checks `/api/health`.
3. In the service's environment settings, add `GEMINI_API_KEY` for live AI features. For Supabase sync, also add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; these must be set before the frontend build.
4. Open the public `onrender.com` URL shown for the service.

The free Render plan may spin down after inactivity. Upgrade the service plan if it needs to stay warm continuously.

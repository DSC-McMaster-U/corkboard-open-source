# Corkboard — MVP Roadmap

This file is a focused, actionable version of the main project roadmap designed to get a Minimal Viable Product (MVP) delivered quickly.

Goals for the MVP
- Provide a mobile app where users can browse and view event details for local music shows in Hamilton.
- Include a simple events data source (seeded DB) and a static map/timeline view.
- Provide a minimal backend API for events and a seeded Postgres database.

Minimum scope (in order)
1. Mobile skeleton and UI
   - Expo-managed React Native app with a single screen showing a list of events.
   - Event card UI with title, date/time, venue, short description, and a thumbnail.
   - Static map or timeline view accessible from a tab.
2. Backend and DB
   - Postgres database with `events` and `users` tables.
   - Simple REST API to fetch events (Node/Express or lightweight server). For MVP, a static JSON API can be used.
   - Seed the DB with 10–20 curated events (see `backend/initdb/init.sql`).
3. Event content
   - Seed data includes event title, start/end time, venue name, address/coordinates, genre tags, and description.
4. Local developer experience
   - Docker Compose to run Postgres locally (already added at `backend/docker-compose.yml`).
   - Kubernetes manifests to deploy Postgres and run seed job (under `backend/k8s/`).

Tech choices (MVP)
- Frontend: Expo (React Native) for faster iteration and easy device/simulator testing.
- Backend: Node + Express (or Fastify) — minimal API for events; can be replaced by serverless later.
- Database: Postgres (docker-compose for local dev; manifests provided for k8s).

Concrete tasks (developer checklist)
- Frontend
  - [ ] Initialize Expo app (`npx create-expo-app app` or use existing `frontend/` structure)
  - [ ] Implement EventList screen and EventCard component
  - [ ] Add tabs: Home (list), Map/Timeline, About
  - [ ] Wire API call to backend `/events` endpoint

- Backend
  - [ ] Create a small Express server with a `/events` GET route that returns rows from `events` table
  - [ ] Add simple CORS and JSON response
  - [ ] Add quick healthcheck `/health` route

- Database
  - [x] Docker Compose file added at `backend/docker-compose.yml` (Postgres + `initdb/init.sql`)
  - [x] Initial seed SQL at `backend/initdb/init.sql`
  - [x] Kubernetes manifests added under `backend/k8s/` including secret, pvc, deployment, configmap, and seed job

Acceptance criteria (MVP done)
- Mobile app displays at least 10 events fetched from backend.
- Each event card shows title, time, venue, and description.
- Backend serves events from Postgres and returns appropriate JSON.
- Local dev: `docker compose up` brings a seeded Postgres that the backend can connect to.

Quick start (local DB)
1. Start Postgres locally (from repo root):

```bash
cd backend
docker compose up -d
```

2. Confirm Postgres is running and seeded (example using psql):

```bash
# on machine with psql installed, or via docker exec into the container
psql "host=localhost port=5432 user=postgres dbname=corkboard password=postgrespw" -c "select count(*) from users;"
```

Quick start (kubernetes)
1. Apply k8s resources (ensure kubeconfig targets your cluster):

```bash
kubectl apply -f backend/k8s/postgres-secret.yaml
kubectl apply -f backend/k8s/postgres-pvc.yaml
kubectl apply -f backend/k8s/postgres-deployment.yaml
kubectl apply -f backend/k8s/postgres-configmap.yaml
kubectl apply -f backend/k8s/seed-job.yaml

# wait for job to complete or inspect logs
kubectl wait --for=condition=complete job/postgres-seed-job --timeout=60s || kubectl logs job/postgres-seed-job
```

Next small steps (recommended order)
1. Scaffold a minimal Express backend in `/backend/api` that connects to Postgres and exposes `/events`.
2. Build the Expo frontend `frontend/` EventList and wire it to the backend; use hardcoded API URL or environment-based configuration.
3. Implement one integration test: start Postgres (docker compose), start backend, request `/events` and assert JSON shape.
4. Iterate on UI and add event detail modal.

Notes and assumptions
- The project roadmap in `PROJECT-ROADMAP.md` drives broader project phases; this MVP file slices out Phase 1 essentials.
- Credentials for local Postgres (demo): `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgrespw`, `POSTGRES_DB=corkboard`. Change before production use.
- For production k8s, prefer StatefulSet over Deployment and use a managed DB or operator with backups.

If you want, I can now:
- Scaffold the Express backend and add a minimal `/events` endpoint (I can implement it and run a quick local validation), or
- Scaffold the Expo app with EventList + mock data and wire it to the backend once the backend exists.

Choose what to do next and I'll implement it right away.

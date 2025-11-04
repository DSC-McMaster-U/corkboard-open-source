# Corkboard Backend

This directory contains the Express.js backend API and Postgres database setup for the Corkboard event discovery app.

## Directory Structure

- `server.js` — Express API server with endpoints for events
- `package.json` — Node.js dependencies
- `.env` — Environment configuration (local)
- `docker-compose.yml` — starts Postgres with a mounted `initdb/` directory that automatically runs `init.sql` on first boot
- `initdb/init.sql` — initial schema + seed data (15 Hamilton music events)
- `k8s/` — Kubernetes manifests for production deployment
  - `postgres-secret.yaml` — Secret containing `POSTGRES_PASSWORD`
  - `postgres-pvc.yaml` — PersistentVolumeClaim for Postgres data
  - `postgres-deployment.yaml` — Deployment + Service for Postgres
  - `postgres-configmap.yaml` — ConfigMap containing `init.sql`
  - `seed-job.yaml` — Job that seeds the database

## Quick Start (Local Development)

### 1. Start the Database

From the repository root:

```bash
cd backend
docker compose up -d
```

The database will automatically:
- Create the `corkboard` database
- Run `initdb/init.sql` to create tables
- Seed 15 events from Hamilton music venues

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Start the API Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get all events
curl http://localhost:3000/events

# Get specific event
curl http://localhost:3000/events/1

# Filter by genre
curl http://localhost:3000/events/genre/punk
```

## API Endpoints

- `GET /` — API info and available endpoints
- `GET /health` — Health check with database status
- `GET /events` — Get all events (sorted by start time)
- `GET /events/:id` — Get specific event by ID
- `GET /events/genre/:genre` — Filter events by genre

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `created_at` (TIMESTAMPTZ)

### Events Table
- `id` (SERIAL PRIMARY KEY)
- `title` (TEXT)
- `description` (TEXT)
- `venue_name` (TEXT)
- `venue_address` (TEXT)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `start_time` (TIMESTAMPTZ)
- `end_time` (TIMESTAMPTZ)
- `genre_tags` (TEXT[])
- `thumbnail_url` (TEXT)
- `created_at` (TIMESTAMPTZ)

## Verify Database

Connect using psql or a database client:

```bash
# Using psql directly
psql "host=localhost port=5432 user=postgres dbname=corkboard password=postgrespw"

# Or via Docker
docker exec -it backend-db-1 psql -U postgres -d corkboard
```

Check event count:
```sql
SELECT COUNT(*) FROM events;
```

View sample events:
```sql
SELECT title, venue_name, start_time FROM events LIMIT 5;
```

## Kubernetes Deployment

### Quick start — Kubernetes

1. Apply the secret (already base64-encoded in file):

```bash
kubectl apply -f k8s/postgres-secret.yaml
```

2. Apply PVC + Deployment + Service:

```bash
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
```

3. Apply the ConfigMap and run the seed job:

```bash
kubectl apply -f k8s/postgres-configmap.yaml
kubectl apply -f k8s/seed-job.yaml

# Wait for job completion and view logs
kubectl wait --for=condition=complete job/postgres-seed-job --timeout=60s
kubectl logs job/postgres-seed-job
```

### Notes for Production

- The Secret currently stores a demo password `postgrespw` (base64: `cG9zdGdyZXNwd3`). Change this in `k8s/postgres-secret.yaml` before production use.
- For production deployments, consider using a StatefulSet instead of a Deployment and a StorageClass appropriate for your cluster.
- The seed Job uses the `postgres` image and `psql` to run the SQL; the job waits until `pg_isready` confirms the service is reachable.
- Consider using a managed database service (AWS RDS, Google Cloud SQL, Azure Database) for production with automated backups.

## Environment Variables

Configure the backend API using environment variables (see `.env.example`):

- `DB_HOST` — Database host (default: `localhost`)
- `DB_PORT` — Database port (default: `5432`)
- `DB_NAME` — Database name (default: `corkboard`)
- `DB_USER` — Database user (default: `postgres`)
- `DB_PASSWORD` — Database password (default: `postgrespw`)
- `PORT` — API server port (default: `3000`)

## Stopping the Services

Stop the database:
```bash
docker compose down
```

Stop the database and remove volumes (deletes all data):
```bash
docker compose down -v
```

Stop the API server:
```bash
# Find the process
ps aux | grep "node server.js"

# Kill it
kill <PID>
```

## Troubleshooting

### Database won't start
```bash
# Check container logs
docker compose logs db

# Restart the container
docker compose restart db
```

### API can't connect to database
```bash
# Verify database is running
docker compose ps

# Check database logs
docker compose logs db

# Test connection manually
docker exec -it backend-db-1 psql -U postgres -d corkboard -c "SELECT 1;"
```

### Port already in use
If port 3000 or 5432 is already in use, change the port in `.env` (for API) or `docker-compose.yml` (for database).
- The seed Job uses the `postgres` image and `psql` to run the SQL; the job waits until `pg_isready` confirms the service is reachable.

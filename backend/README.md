# Corkboard Backend - Exploration Branch

This is a working Express + PostgreSQL + Docker setup in `feature/backend-exploration` branch.

## Current Setup

- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL (via Docker)
- **Containerization**: Docker + Docker Compose
    - for API + PostgreSQL databse

## Next Steps
- Team review of current setup
- Auth approach decisions
- Database schema design (for week1 MVP)


## Quick Start

```bash
# Fetch latest changes
git fetch
git switrch feature/backend-exploration

cd backend/

# Start with Docker Compose
docker compose up

# Or run locally (requires PostgreSQL)
npm install
npm run dev
```

## Endpoints

- `GET /api/health` - Health check
- `GET /api/events` - Events (placeholder)
- `GET /api/venues` - Venues (placeholder)
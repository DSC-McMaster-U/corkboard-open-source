# Corkboard Backend - Exploration Branch

This is an exploration branch for the backend architecture discussion.

## Current Setup

- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL (via Docker)
- **Containerization**: Docker + Docker Compose

## Quick Start

```bash
cd backend/

# Start with Docker Compose
docker compose up -d

# Or run locally (requires PostgreSQL)
npm install
npm run dev
```

## Endpoints

- `GET /api/health` - Health check
- `GET /api/events` - Events (placeholder)
- `GET /api/venues` - Venues (placeholder)
# Corkboard Backend API

Express.js REST API for the Corkboard event discovery application.

## Features

- RESTful API for event data
- PostgreSQL database with 15 seeded Hamilton music events
- CORS-enabled for frontend integration
- Docker Compose for local development
- Kubernetes manifests for production deployment

## Quick Start

```bash
# 1. Start the database
docker compose up -d

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The API will be running at `http://localhost:3000`

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### Get API Info
```
GET /
```
Returns API information and available endpoints.

#### Health Check
```
GET /health
```
Returns server and database status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-30T00:39:12.677Z"
}
```

#### Get All Events
```
GET /events
```
Returns all events sorted by start time.

**Response:**
```json
{
  "count": 15,
  "events": [
    {
      "id": 1,
      "title": "Indie Night at The Casbah",
      "description": "Local indie bands showcase...",
      "venue_name": "The Casbah",
      "venue_address": "306 King St W, Hamilton, ON L8P 1B4",
      "latitude": "43.25570000",
      "longitude": "-79.87110000",
      "start_time": "2025-11-16T01:00:00.000Z",
      "end_time": "2025-11-16T04:30:00.000Z",
      "genre_tags": ["indie", "rock", "alternative"],
      "thumbnail_url": null,
      "created_at": "2025-10-30T00:38:52.123Z"
    }
  ]
}
```

#### Get Event by ID
```
GET /events/:id
```
Returns a specific event.

**Response:** Single event object

#### Get Events by Genre
```
GET /events/genre/:genre
```
Returns events filtered by genre tag.

**Example:** `GET /events/genre/punk`

**Response:**
```json
{
  "genre": "punk",
  "count": 1,
  "events": [...]
}
```

## Configuration

Environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `corkboard` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgrespw` | Database password |
| `PORT` | `3000` | API server port |

## Development

### Run in Development Mode
```bash
npm run dev
```
Uses `nodemon` for auto-reload on file changes.

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Get all events
curl http://localhost:3000/events

# Get specific event
curl http://localhost:3000/events/1

# Filter by genre
curl http://localhost:3000/events/genre/indie
```

## Database

See [README-db.md](./README-db.md) for complete database documentation including:
- Schema details
- Kubernetes deployment
- Manual database operations
- Troubleshooting

## Project Structure

```
backend/
├── server.js              # Express API server
├── package.json           # Dependencies
├── .env                   # Environment config (local)
├── .env.example           # Example environment config
├── docker-compose.yml     # Docker Compose for Postgres
├── README.md              # This file
├── README-db.md           # Database documentation
├── initdb/
│   └── init.sql          # Database schema and seed data
└── k8s/                  # Kubernetes manifests
    ├── postgres-secret.yaml
    ├── postgres-pvc.yaml
    ├── postgres-deployment.yaml
    ├── postgres-configmap.yaml
    └── seed-job.yaml
```

## Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Database Driver:** node-postgres (pg)
- **Middleware:** cors, express.json
- **Dev Tools:** nodemon

## Next Steps

1. **Frontend Integration:** The API is ready to be consumed by the React Native frontend
2. **Authentication:** Add user authentication endpoints (login, signup, JWT)
3. **Event Management:** Add POST/PUT/DELETE endpoints for event CRUD operations
4. **Image Upload:** Integrate thumbnail upload with storage service
5. **Search:** Add full-text search across events
6. **Filters:** Add more advanced filtering (date range, location radius)

## License

MIT

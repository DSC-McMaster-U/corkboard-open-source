# Corkboard Backend - Quick Test Guide

## System Status

### Check if everything is running
```bash
# Check database
docker compose ps

# Check API (should return healthy status)
curl http://localhost:3000/health
```

## API Endpoint Tests

### 1. Health Check
```bash
curl http://localhost:3000/health
```
Expected: `{"status":"healthy","database":"connected",...}`

### 2. Get All Events
```bash
curl http://localhost:3000/events
```
Expected: JSON with 15 events

### 3. Get Single Event
```bash
curl http://localhost:3000/events/1
```
Expected: Single event object for "Indie Night at The Casbah"

### 4. Filter by Genre
```bash
# Get punk events
curl http://localhost:3000/events/genre/punk

# Get indie events
curl http://localhost:3000/events/genre/indie

# Get jazz events
curl http://localhost:3000/events/genre/jazz
```

## Database Direct Queries

### Check event count
```bash
docker exec backend-db-1 psql -U postgres -d corkboard -c "SELECT COUNT(*) FROM events;"
```
Expected: 15 events

### View all events
```bash
docker exec backend-db-1 psql -U postgres -d corkboard -c "SELECT id, title, venue_name, start_time FROM events ORDER BY start_time;"
```

### Check database tables
```bash
docker exec backend-db-1 psql -U postgres -d corkboard -c "\dt"
```
Expected: `events` and `users` tables

## Browser Testing

Open these URLs in your browser:
- http://localhost:3000/ - API info
- http://localhost:3000/health - Health check
- http://localhost:3000/events - All events (JSON)
- http://localhost:3000/events/1 - Single event

## One-Command Verification

Run this single command to verify everything:
```bash
echo "Database:" && docker compose ps | grep -q Up && echo "✓ Running" || echo "✗ Not running" && echo "API:" && curl -s http://localhost:3000/health | grep -q healthy && echo "✓ Healthy" || echo "✗ Not healthy" && echo "Events:" && curl -s http://localhost:3000/events | grep -q '"count":15' && echo "✓ 15 events loaded" || echo "✗ Events not loaded"
```

## Troubleshooting

### API not responding
```bash
# Check if server is running
ps aux | grep "node server.js"

# Restart the server
cd backend
npm start
```

### Database not responding
```bash
# Check database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Reset everything
```bash
# Stop everything
docker compose down -v
cd ..

# Start fresh
cd backend
docker compose up -d
npm start
```

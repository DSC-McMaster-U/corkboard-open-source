import express from 'express';
import cors from 'cors';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Corkboard API is running'
  });
});

// health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Corkboard API is running',
    database: 'PostgreSQL (local)',
    auth: 'TBD - Supabase vs Firebase Auth'
  });
});

// some example endpoints
app.get('/api/events', (req, res) => {
  res.json({ 
    message: 'Events endpoint: to be implemented',
    filters: ['date', 'genre', 'location', 'venue']
  });
});

app.get('/api/venues', (req, res) => {
  res.json({ 
    message: 'Venues endpoint: to be implemented'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Corkboard API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Events: http://localhost:${PORT}/api/events`);
  console.log(`Venues: http://localhost:${PORT}/api/venues`);
});
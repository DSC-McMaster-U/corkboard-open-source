const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'corkboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgrespw',
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Get all events
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        venue_name,
        venue_address,
        latitude,
        longitude,
        start_time,
        end_time,
        genre_tags,
        thumbnail_url,
        created_at
      FROM events
      ORDER BY start_time ASC
    `);
    
    res.json({
      count: result.rows.length,
      events: result.rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch events',
      message: error.message 
    });
  }
});

// Get single event by ID
app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      error: 'Failed to fetch event',
      message: error.message 
    });
  }
});

// Get events by genre
app.get('/events/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE $1 = ANY(genre_tags) ORDER BY start_time ASC',
      [genre]
    );
    
    res.json({
      genre,
      count: result.rows.length,
      events: result.rows
    });
  } catch (error) {
    console.error('Error fetching events by genre:', error);
    res.status(500).json({ 
      error: 'Failed to fetch events',
      message: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Corkboard API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      events: '/events',
      eventById: '/events/:id',
      eventsByGenre: '/events/genre/:genre'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Corkboard API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎪 Events: http://localhost:${PORT}/events`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing database pool...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

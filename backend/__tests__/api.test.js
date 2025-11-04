const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Mock database pool
const mockPool = {
  query: jest.fn(),
  end: jest.fn(),
};

// Create test app
function createTestApp(pool) {
  const app = express();
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
      res.status(500).json({ 
        error: 'Failed to fetch event',
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

  return app;
}

describe('Corkboard API', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp(mockPool);
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Corkboard API');
      expect(response.body.version).toBe('0.1.0');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return healthy status when database is connected', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ now: '2025-10-30T00:00:00Z' }]
      });

      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.database).toBe('connected');
      expect(mockPool.query).toHaveBeenCalledWith('SELECT NOW()');
    });

    it('should return unhealthy status when database is disconnected', async () => {
      mockPool.query.mockRejectedValue(new Error('Connection failed'));

      const response = await request(app).get('/health');
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('unhealthy');
      expect(response.body.database).toBe('disconnected');
    });
  });

  describe('GET /events', () => {
    it('should return all events', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event 1',
          description: 'Description 1',
          venue_name: 'Venue 1',
          venue_address: 'Address 1',
          latitude: '43.2557',
          longitude: '-79.8711',
          start_time: '2025-11-15T20:00:00Z',
          end_time: '2025-11-15T23:30:00Z',
          genre_tags: ['indie', 'rock'],
          thumbnail_url: null,
          created_at: '2025-10-30T00:00:00Z'
        },
        {
          id: 2,
          title: 'Test Event 2',
          description: 'Description 2',
          venue_name: 'Venue 2',
          venue_address: 'Address 2',
          latitude: '43.2557',
          longitude: '-79.8711',
          start_time: '2025-11-16T20:00:00Z',
          end_time: '2025-11-16T23:30:00Z',
          genre_tags: ['jazz', 'blues'],
          thumbnail_url: null,
          created_at: '2025-10-30T00:00:00Z'
        }
      ];

      mockPool.query.mockResolvedValue({ rows: mockEvents });

      const response = await request(app).get('/events');
      
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.events).toEqual(mockEvents);
      expect(mockPool.query).toHaveBeenCalled();
    });

    it('should return empty array when no events exist', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/events');
      
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.events).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/events');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch events');
    });
  });

  describe('GET /events/:id', () => {
    it('should return a specific event', async () => {
      const mockEvent = {
        id: 1,
        title: 'Test Event',
        description: 'Description',
        venue_name: 'Venue',
        venue_address: 'Address',
        latitude: '43.2557',
        longitude: '-79.8711',
        start_time: '2025-11-15T20:00:00Z',
        end_time: '2025-11-15T23:30:00Z',
        genre_tags: ['indie', 'rock'],
        thumbnail_url: null,
        created_at: '2025-10-30T00:00:00Z'
      };

      mockPool.query.mockResolvedValue({ rows: [mockEvent] });

      const response = await request(app).get('/events/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM events WHERE id = $1',
        ['1']
      );
    });

    it('should return 404 when event not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/events/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Event not found');
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/events/1');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch event');
    });
  });
});

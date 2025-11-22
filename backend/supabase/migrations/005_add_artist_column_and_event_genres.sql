-- Migration 005
-- Date: 2025-11-18
-- Purpose: Add artist column to events table and populate event_genres with sample data
-- Applied by: Billy
-- Status: Applied

-- add artist column to events table
ALTER TABLE events
    ADD COLUMN artist VARCHAR(255);

-- Insert sample event_genres data to test genre joins
-- link "Local Band Night" to "Rock" genre
INSERT INTO event_genres (event_id, genre_id)
SELECT 
    e.id,
    g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'Local Band Night'
    AND g.name = 'Rock';

-- link "Jazz Night" to "Jazz" genre
INSERT INTO event_genres (event_id, genre_id)
SELECT 
    e.id,
    g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'Jazz Night'
    AND g.name = 'Jazz';

-- link "Electronic Showcase" to "Electronic" genre
INSERT INTO event_genres (event_id, genre_id)
SELECT 
    e.id,
    g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'Electronic Showcase'
    AND g.name = 'Electronic';

-- add a second genre to "Local Band Night" (Rock and Indie)
INSERT INTO event_genres (event_id, genre_id)
SELECT 
    e.id,
    g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'Local Band Night'
    AND g.name = 'Indie'
    AND NOT EXISTS (
        SELECT 1 FROM event_genres eg 
        WHERE eg.event_id = e.id AND eg.genre_id = g.id
    );


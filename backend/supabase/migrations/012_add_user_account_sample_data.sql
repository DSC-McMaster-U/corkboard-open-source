-- Migration 012
-- Date: December 30, 2025
-- Purpose: Add sample data for user accounts with favorites
-- Applied by: Billy
-- Status: Applied

-- Update existing "Test User" with sample data
UPDATE users 
SET 
    username = 'testuser',
    profile_picture = 'images/users/testuser.jpg',
    bio = 'Student at McMaster University. Love live shows and discovering new artists!'
WHERE name = 'Test User';

-- Add favorites for Test User
-- Favorite genres: Rock, Indie
INSERT INTO user_favorite_genres (user_id, genre_id)
SELECT 
    u.id,
    g.id
FROM users u, genres g
WHERE u.name = 'Test User' AND g.name IN ('Rock', 'Indie')
ON CONFLICT (user_id, genre_id) DO NOTHING;

-- Favorite venues: The Casbah, Hamilton Place
INSERT INTO user_favorite_venues (user_id, venue_id)
SELECT 
    u.id,
    v.id
FROM users u, venues v
WHERE u.name = 'Test User' AND v.name IN ('The Casbah', 'Hamilton Place')
ON CONFLICT (user_id, venue_id) DO NOTHING;

-- Create mock artists for testing
INSERT INTO artists (name)
VALUES 
    ('The Local Band'),
    ('Jazz Quartet'),
    ('Electronic Showcase')
ON CONFLICT (name) DO NOTHING;

UPDATE events
SET artist_id = (SELECT id FROM artists WHERE name = 'The Local Band')
WHERE title = 'Local Band Night' AND artist_id IS NULL;

UPDATE events
SET artist_id = (SELECT id FROM artists WHERE name = 'Jazz Quartet')
WHERE title = 'Jazz Night' AND artist_id IS NULL;

UPDATE events
SET artist_id = (SELECT id FROM artists WHERE name = 'Electronic Showcase')
WHERE title = 'Electronic Showcase' AND artist_id IS NULL;

-- Favorite artists for Test User
INSERT INTO user_favorite_artists (user_id, artist_id)
SELECT 
    u.id,
    a.id
FROM users u, artists a
WHERE u.name = 'Test User' 
    AND a.name IN ('The Local Band', 'Jazz Quartet', 'Electronic Showcase')
ON CONFLICT (user_id, artist_id) DO NOTHING;

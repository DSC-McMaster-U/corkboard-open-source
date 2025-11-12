-- Migration 003
-- Date: 2025-11-12
-- Purpose: Add sample users and bookmarks for testing
-- Applied by: Billy


-- Add sample users for testing
INSERT INTO users (name, email)
VALUES 
    ('Test User', 'test@example.com'),
    ('John Doe', 'john@example.com');

-- Add sample bookmarks (user bookmarks some events)
INSERT INTO user_bookmarks (user_id, event_id)
SELECT 
    (SELECT id FROM users WHERE email = 'test@example.com'),
    (SELECT id FROM events WHERE title = 'Local Band Night')
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'test@example.com'),
    (SELECT id FROM events WHERE title = 'Jazz Night')
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'john@example.com'),
    (SELECT id FROM events WHERE title = 'Electronic Showcase');
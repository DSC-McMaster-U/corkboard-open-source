-- Migration 008
-- Date: 2025-01-XX
-- Purpose: Add real sample events from Eventbrite for showcase demonstration
-- Applied by: Billy
-- Status: Pending

-- Add new venues needed for real events (only if they don't already exist)
-- Stonewalls Restobar: 339 York Boulevard, Hamilton, ON
INSERT INTO venues (name, address, venue_type, latitude, longitude)
SELECT 'Stonewalls Restobar', '339 York Boulevard, Hamilton, ON L8R 2X9', 'bar', 43.2653, -79.8801
WHERE NOT EXISTS (SELECT 1 FROM venues WHERE name = 'Stonewalls Restobar');

-- The Bright Room: 27 Dundurn Street North, Hamilton, ON
INSERT INTO venues (name, address, venue_type, latitude, longitude)
SELECT 'The Bright Room', '27 Dundurn Street North, Hamilton, ON L8R 3C9', 'venue', 43.2608, -79.8778
WHERE NOT EXISTS (SELECT 1 FROM venues WHERE name = 'The Bright Room');

-- Update existing Club Absinthe venue with correct data
UPDATE venues
SET 
    name = 'Absinthe',
    address = '32 Hess St S, Hamilton, ON',
    latitude = 43.25555560,
    longitude = -79.86888890
WHERE name = 'Club Absinthe';

-- 1. CLUBMATTIX - BASS MUSIC @ABSINTHE [PART DEUX]
-- Source: https://www.eventbrite.ca/e/clubmattix-bass-music-absinthe-part-deux-tickets-1974707413030
INSERT INTO events (
    title,
    description,
    venue_id,
    start_time,
    cost,
    status,
    artist,
    source_type,
    source_url,
    ingestion_status,
    created_at,
    image
)
SELECT
    'CLUBMATTIX - BASS MUSIC @ABSINTHE [PART DEUX]',
    'Bringing back quality bass driven underground dance music to a proper venue in Hamilton, with upgraded sound...MORE BASS!!!!',
    (SELECT id FROM venues WHERE name = 'Absinthe'),
    '2025-11-28 22:00:00-05'::timestamptz, -- Nov 28, 2025 10:00 PM EST
    11.98,
    'published',
    'XI B2B LO:TONE',
    'manual',
    'https://www.eventbrite.ca/e/clubmattix-bass-music-absinthe-part-deux-tickets-1974707413030',
    'success',
    NOW(),
    'images/events/clubmattix.jpg';

-- 2. LOUD LOVE - The Music of Chris Cornell
-- Source: https://www.eventbrite.ca/e/loud-love-the-music-of-chris-cornell-tickets-1765887269359
INSERT INTO events (
    title,
    description,
    venue_id,
    start_time,
    cost,
    status,
    artist,
    source_type,
    source_url,
    ingestion_status,
    created_at,
    image
)
SELECT
    'LOUD LOVE - The Music of Chris Cornell',
    'The sounds of Chris Cornell are alive. Relive your favourite songs from Soundgarden, Audioslave and Temple of the Dog. LOUD LOVE - The Music of Chris Cornell! Join us for a night of Seattle sounds as we pay tribute to the music of legendary musician, Chris Cornell. Get ready to sing along to your favorite hits from Soundgarden, Audioslave and Temple of the dog. Special guests Flood the Senses open the night with grunge era staples & unforgettable stadium hits. Come and celebrate the life and music of Chris Cornell with us. It''s going to be a night to remember filled with great music and good vibes. Don''t miss out on this epic event! Your paid admission does not guarantee seating. Contact Stonewalls for table reservations.',
    (SELECT id FROM venues WHERE name = 'Stonewalls Restobar'),
    '2025-11-29 20:30:00-05'::timestamptz, -- Nov 29, 2025 8:30 PM EST
    17.55,
    'published',
    'Loud Love',
    'manual',
    'https://www.eventbrite.ca/e/loud-love-the-music-of-chris-cornell-tickets-1765887269359',
    'success',
    NOW(),
    'images/events/loud-love-the-music-of-chris-cornell.jpg';

-- 3. Therapy - November
-- Source: https://www.eventbrite.ca/e/therapy-november-tickets-1944084592349
INSERT INTO events (
    title,
    description,
    venue_id,
    start_time,
    cost,
    status,
    artist,
    source_type,
    source_url,
    ingestion_status,
    created_at,
    image
)
SELECT
    'Therapy - November',
    'Dark Hamilton Presents: THERAPY - Hamilton''s Only Dark Rave Experience. At Therapy, our goal is to blend the moody, industrial aesthetic of the 2000s mall goth scene with the high-energy production of major EDM events. We aim to deliver a dynamic, world-class entertainment experience with an intimate, small-town vibe. At Therapy, we are a welcoming community that celebrates self-expression without judgment. We encourage you to embrace your true self and join us for a night filled with dark, energetic sounds - from industrial and rave to nu-metal, EDM, trance, dubstep, drum and bass, and techno. If it''s intense, immersive, and keeps the energy high, you''ll find it at Therapy. The same organizers behind the long-running "Asylum" event have been curating other dark parties in the city for over a decade, and now they are hosting "Therapy." This Dark Hamilton event aims to expand the city''s underground scene by returning to old-school roots while offering a fresh new experience. Therapy and Dark Hamilton promise to prescribe you with a truly dark, unforgettable experience. Resident Host and DJ: Psygore. Photography and video are welcome in all areas. DRESS CODE IN EFFECT: BLACK (doesn''t matter if it''s track pants, just make sure it''s black). Goth, Alternative Fetish (Latex, PVC, Leather etc.), Unique (Cyber/Dark rave attire, Clown etc.), Weird (Halloween costume, Garbage bag, Electrical tape etc.). No nice sweaters! Doors at 11:00 pm (COME EARLY). The Bright Room is a licensed establishment. Both food and drink are available, including alcohol. The space is located on the top floor of The Staircase Theater. Please note: not wheelchair accessible. PLUR is in effect - please extend respectful behavior to fellow guests and the venue staff. Disruptive conduct will not be tolerated.',
    (SELECT id FROM venues WHERE name = 'The Bright Room'),
    '2025-11-29 23:00:00-05'::timestamptz, -- Nov 29, 2025 11:00 PM EST
    15.00,
    'published',
    'Psygore',
    'manual',
    'https://www.eventbrite.ca/e/therapy-november-tickets-1944084592349',
    'success',
    NOW(),
    'images/events/therapy-november.jpg';

-- Link events to genres
-- CLUBMATTIX -> Electronic
INSERT INTO event_genres (event_id, genre_id)
SELECT e.id, g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'CLUBMATTIX - BASS MUSIC @ABSINTHE [PART DEUX]'
    AND g.name = 'Electronic';

-- LOUD LOVE -> Rock
INSERT INTO event_genres (event_id, genre_id)
SELECT e.id, g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'LOUD LOVE - The Music of Chris Cornell'
    AND g.name = 'Rock';

-- Therapy - November -> Electronic
INSERT INTO event_genres (event_id, genre_id)
SELECT e.id, g.id
FROM events e
CROSS JOIN genres g
WHERE e.title = 'Therapy - November'
    AND g.name = 'Electronic';


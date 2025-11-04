-- Initial schema and seed data for Corkboard
-- Run automatically by docker-compose (mounted to /docker-entrypoint-initdb.d)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  genre_tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO users (name, email)
VALUES
  ('Alice Example', 'alice@example.org'),
  ('Bob Example', 'bob@example.org')
ON CONFLICT DO NOTHING;

-- Seed events with Hamilton music venues
INSERT INTO events (title, description, venue_name, venue_address, latitude, longitude, start_time, end_time, genre_tags, thumbnail_url)
VALUES
  (
    'Indie Night at The Casbah',
    'Local indie bands showcase featuring three up-and-coming Hamilton acts. Doors at 8pm, show starts at 9pm.',
    'The Casbah',
    '306 King St W, Hamilton, ON L8P 1B4',
    43.2557, -79.8711,
    '2025-11-15 20:00:00-05', '2025-11-15 23:30:00-05',
    ARRAY['indie', 'rock', 'alternative'],
    NULL
  ),
  (
    'Jazz & Blues Night',
    'Smooth jazz and blues featuring Hamilton''s finest musicians. Come early for dinner and drinks.',
    'This Ain''t Hollywood',
    '345 James St N, Hamilton, ON L8L 1H3',
    43.2595, -79.8692,
    '2025-11-08 19:00:00-05', '2025-11-08 22:00:00-05',
    ARRAY['jazz', 'blues'],
    NULL
  ),
  (
    'Punk Rock Marathon',
    'All-ages punk show with 5 local bands. Fast, loud, and full of energy!',
    'Mills Hardware',
    '95 King St E, Hamilton, ON L8N 1A8',
    43.2561, -79.8661,
    '2025-11-22 18:00:00-05', '2025-11-22 23:00:00-05',
    ARRAY['punk', 'hardcore'],
    NULL
  ),
  (
    'Electronic Music Night',
    'DJ sets and live electronic performances. Dance floor open all night.',
    'The Brain',
    '112 James St N, Hamilton, ON L8R 2K7',
    43.2580, -79.8690,
    '2025-11-10 21:00:00-05', '2025-11-11 02:00:00-05',
    ARRAY['electronic', 'house', 'techno'],
    NULL
  ),
  (
    'Open Mic Night',
    'Bring your instrument or just come to listen. All skill levels welcome!',
    'Stonewalls',
    '339 York Blvd, Hamilton, ON L8R 3K2',
    43.2610, -79.8750,
    '2025-11-12 19:30:00-05', '2025-11-12 22:30:00-05',
    ARRAY['acoustic', 'folk', 'open mic'],
    NULL
  ),
  (
    'Metal Madness',
    'Heavy metal showcase with local and touring bands. Bring your earplugs!',
    'Doors Pub',
    '45 McNab St N, Hamilton, ON L8R 2Y1',
    43.2565, -79.8705,
    '2025-11-20 20:00:00-05', '2025-11-21 00:00:00-05',
    ARRAY['metal', 'heavy metal', 'thrash'],
    NULL
  ),
  (
    'Hip Hop Cypher',
    'MC battle and freestyle session. Sign up at the door or just come to watch.',
    'The Pepper Jack Cafe',
    '382 James St N, Hamilton, ON L8L 1H5',
    43.2600, -79.8688,
    '2025-11-18 20:00:00-05', '2025-11-18 23:00:00-05',
    ARRAY['hip hop', 'rap'],
    NULL
  ),
  (
    'Singer-Songwriter Series',
    'Intimate acoustic performances by local singer-songwriters. Limited seating.',
    'The Mule Spinner',
    '1072 King St E, Hamilton, ON L8M 1C2',
    43.2490, -79.8420,
    '2025-11-14 19:00:00-05', '2025-11-14 21:30:00-05',
    ARRAY['acoustic', 'folk', 'singer-songwriter'],
    NULL
  ),
  (
    'Reggae Vibes',
    'Caribbean rhythms and positive vibes. DJ and live band performances.',
    'The Undertaker',
    '101 Locke St S, Hamilton, ON L8P 4A4',
    43.2520, -79.8800,
    '2025-11-16 21:00:00-05', '2025-11-17 01:00:00-05',
    ARRAY['reggae', 'ska', 'dub'],
    NULL
  ),
  (
    'Classical Guitar Recital',
    'An evening of classical and flamenco guitar. Wine and cheese reception to follow.',
    'The Cotton Factory',
    '270 Sherman Ave N, Hamilton, ON L8L 6N4',
    43.2555, -79.8585,
    '2025-11-09 19:30:00-05', '2025-11-09 21:00:00-05',
    ARRAY['classical', 'flamenco', 'guitar'],
    NULL
  ),
  (
    'Emo Revival Show',
    'Nostalgic emo and pop-punk tunes. Dust off your skinny jeans!',
    'This Ain''t Hollywood',
    '345 James St N, Hamilton, ON L8L 1H3',
    43.2595, -79.8692,
    '2025-11-25 20:00:00-05', '2025-11-25 23:30:00-05',
    ARRAY['emo', 'pop punk', 'alternative'],
    NULL
  ),
  (
    'Experimental Noise Night',
    'Avant-garde sound art and experimental music. Not for the faint of heart.',
    'The Brain',
    '112 James St N, Hamilton, ON L8R 2K7',
    43.2580, -79.8690,
    '2025-11-23 21:00:00-05', '2025-11-23 23:00:00-05',
    ARRAY['experimental', 'noise', 'avant-garde'],
    NULL
  ),
  (
    'Country & Western Night',
    'Line dancing, live country music, and cold beer. Yeehaw!',
    'The Winking Judge',
    '25 Augusta St, Hamilton, ON L8N 1P5',
    43.2572, -79.8668,
    '2025-11-19 19:00:00-05', '2025-11-19 23:00:00-05',
    ARRAY['country', 'western', 'folk'],
    NULL
  ),
  (
    'Funk & Soul Revue',
    'Get down with the funkiest grooves in Hamilton. Dance floor mandatory.',
    'Mills Hardware',
    '95 King St E, Hamilton, ON L8N 1A8',
    43.2561, -79.8661,
    '2025-11-21 21:00:00-05', '2025-11-22 01:00:00-05',
    ARRAY['funk', 'soul', 'r&b'],
    NULL
  ),
  (
    'Shoegaze & Dream Pop',
    'Ethereal soundscapes and reverb-drenched guitars. Close your eyes and drift away.',
    'The Casbah',
    '306 King St W, Hamilton, ON L8P 1B4',
    43.2557, -79.8711,
    '2025-11-27 20:00:00-05', '2025-11-27 23:00:00-05',
    ARRAY['shoegaze', 'dream pop', 'indie'],
    NULL
  )
ON CONFLICT DO NOTHING;

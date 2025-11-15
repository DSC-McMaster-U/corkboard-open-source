-- This is the initial schema for the database
-- Serves as testing purpose for the backend team

-- Create venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    venue_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue_id UUID NOT NULL REFERENCES venues(id),
    start_time TIMESTAMP NOT NULL,
    cost DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create genres table
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create user bookmarks (many-to-many)
CREATE TABLE user_bookmarks (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, event_id)
);

-- Create event genres (many-to-many)
CREATE TABLE event_genres (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, genre_id)
);

-- Insert sample data for testing
INSERT INTO
    genres (name)
VALUES
    ('Rock'), ('Jazz'), ('Electronic'), ('Hip-Hop'), ('Folk'), ('Pop'), ('Indie');

INSERT INTO
    venues (name, address, venue_type)
VALUES
    ('The Casbah', '306 King St W, Hamilton, ON', 'bar'),
    ('Club Absinthe', '38 King St E, Hamilton, ON', 'club'),
    ('Hamilton Place', '1 Summers Ln, Hamilton, ON', 'theater'),
    ('The Underground', '123 James St N, Hamilton, ON', 'bar');

INSERT INTO
    events (title, description, venue_id, start_time, cost, status)
VALUES
    (
        'Local Band Night',
        'An evening of local Hamilton bands',
        (SELECT id FROM venues WHERE name = 'The Casbah'),
        '2024-02-15 20:00:00',
        15.00,
        'published'
    ),
    (
        'Jazz Night',
        'Weekly jazz performance',
        (SELECT id FROM venues WHERE name = 'Club Absinthe'),
        '2024-02-16 19:30:00',
        25.00,
        'published'
    ),
    (
        'Electronic Showcase',
        'Electronic music showcase',
        (SELECT id FROM venues WHERE name = 'The Underground'),
        '2024-02-17 21:00:00',
        20.00,
        'published'
    );

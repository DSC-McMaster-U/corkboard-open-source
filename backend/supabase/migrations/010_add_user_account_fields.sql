-- Migration 010
-- Date: December 30, 2025
-- Purpose: Add user account fields and favorite junction tables
-- Applied by: Billy
-- Status: Applied

-- Add new columns to users table
ALTER TABLE users 
    ADD COLUMN username VARCHAR(100) UNIQUE,
    ADD COLUMN profile_picture VARCHAR(255),
    ADD COLUMN bio TEXT;

-- Create artists table
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- user-favorite-genres junction table (many-to-many)
CREATE TABLE user_favorite_genres (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, genre_id)
);

-- user-favorite-venues junction table (many-to-many)
CREATE TABLE user_favorite_venues (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

-- user-favorite-artists junction table (many-to-many)
CREATE TABLE user_favorite_artists (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorite_genres_user_id ON user_favorite_genres(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_venues_user_id ON user_favorite_venues(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_user_id ON user_favorite_artists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_artist_id ON user_favorite_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

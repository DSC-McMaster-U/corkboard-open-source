-- Migration 002
-- Date: 2025-11-07
-- Purpose: Add enums, constraints, and source tracking fields to the database
-- Applied by: Billy
-- Note: Austin already applied event_status enum and status column conversion

-- Create remaining ENUM types
CREATE TYPE venue_type_enum AS ENUM ('bar', 'club', 'theater', 'venue', 'outdoor', 'other');
CREATE TYPE source_type_enum AS ENUM ('manual', 'api', 'scraping', 'rss', 'ics', 'other');
CREATE TYPE ingestion_status_enum AS ENUM ('pending', 'processing', 'success', 'failed');

-- Add source tracking fields to events table
ALTER TABLE events
    ADD COLUMN source_type source_type_enum DEFAULT 'manual',
    ADD COLUMN source_url TEXT,
    ADD COLUMN ingestion_status ingestion_status_enum DEFAULT 'success';

-- Update venue_type to use enum
ALTER TABLE venues
    ADD COLUMN venue_type_new venue_type_enum;

-- Migrate existing venue_type data
UPDATE venues
SET venue_type_new = CASE
    WHEN venue_type = 'bar' THEN 'bar'::venue_type_enum
    WHEN venue_type = 'club' THEN 'club'::venue_type_enum
    WHEN venue_type = 'theater' THEN 'theater'::venue_type_enum
    ELSE 'other'::venue_type_enum
END;

-- Drop old column and rename new one
ALTER TABLE venues
    DROP COLUMN venue_type;

ALTER TABLE venues
    RENAME COLUMN venue_type_new TO venue_type;

-- Ensure status column has NOT NULL
ALTER TABLE events
    ALTER COLUMN status SET NOT NULL;

-- Fix existing data: Update events with past start_time to be in the future
-- This ensures the constraint can be added successfully
UPDATE events
SET start_time = created_at + INTERVAL '1 day'
WHERE start_time <= created_at;

-- Add constraints for events table
ALTER TABLE events
    ADD CONSTRAINT events_start_time_future CHECK (start_time > created_at),
    ADD CONSTRAINT events_cost_non_negative CHECK (cost IS NULL OR cost >= 0);

ALTER TABLE venues
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE genres
    ALTER COLUMN name SET NOT NULL;

-- Add indexes for common queries
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_source_type ON events(source_type);
CREATE INDEX idx_events_ingestion_status ON events(ingestion_status);
CREATE INDEX idx_events_venue_id ON events(venue_id);

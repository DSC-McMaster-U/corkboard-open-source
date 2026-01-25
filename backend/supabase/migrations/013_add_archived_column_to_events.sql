-- Migration 013
-- Date: January 17, 2026
-- Purpose: Add archived column to events table for handling past events
-- Applied by: Billy
-- Status: Applied

-- Add archived boolean column to events table
ALTER TABLE events
ADD COLUMN archived BOOLEAN DEFAULT FALSE NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_archived ON events(archived);

-- Archive all past events
UPDATE events SET archived = TRUE WHERE start_time < NOW();

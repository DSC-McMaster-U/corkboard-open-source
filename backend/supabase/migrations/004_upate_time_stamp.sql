-- Migration 004
-- Date: 2025-11-13
-- Purpose: Update start_time column to TIMESTAMPTZ (Supabase recommends timestamptz over deprecated timestamp)
-- Applied by: Austin
-- Status: Already Applied

ALTER TABLE events
    ALTER COLUMN start_time TYPE TIMESTAMPTZ USING start_time AT TIME ZONE 'UTC';
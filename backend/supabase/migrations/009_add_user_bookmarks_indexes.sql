-- Migration 009
-- Date: 2025-11-28
-- Purpose: Add indexes for user_bookmarks table to improve query performance
-- Applied by: Billy
-- Status: Applied

-- Add index on user_id for efficient bookmark queries
-- used by: db.bookmarks.getByUserId(), db.bookmarks.exists(), db.bookmarks.delete()
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);

-- Add index on created_at for efficient sorting
-- used by: db.bookmarks.getByUserId() with .order("created_at", { ascending: false })
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_created_at ON user_bookmarks(created_at);


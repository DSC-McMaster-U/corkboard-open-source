-- Migration 007
-- Date: 2025-11-20
-- Purpose: Fix longitude column precision and add sample venue coordinates
-- Applied by: Billy
-- Status: Pending

-- Fix longitude column precision
-- DECIMAL(10, 8) is not enough precision for longitude range (-180 to +180)
-- Change to DECIMAL(11, 8) to accommodate full longitude range
ALTER TABLE venues
    ALTER COLUMN longitude TYPE DECIMAL(11, 8);

-- Add sample latitude and longitude data for existing venues in Hamilton, ON
-- The Casbah (306 King St W, Hamilton, ON)
UPDATE venues
SET latitude = 43.2588889,
    longitude = -79.8761111
WHERE name = 'The Casbah';

-- Club Absinthe (38 King St E, Hamilton, ON)
UPDATE venues
SET latitude = 43.2555556,
    longitude = -79.8688889
WHERE name = 'Club Absinthe';

-- Hamilton Place (1 Summers Ln, Hamilton, ON)
UPDATE venues
SET latitude = 43.2566667,
    longitude = -79.8722222
WHERE name = 'Hamilton Place';

-- The Underground (123 James St N, Hamilton, ON)
UPDATE venues
SET latitude = 43.2577778,
    longitude = -79.8744444
WHERE name = 'The Underground';


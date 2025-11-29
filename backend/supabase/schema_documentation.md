# Database Schema Documentation

## Tables

- `venues` - Venue information
- `events` - Event listings with source tracking
- `users` - User accounts
- `genres` - Music genres
- `user_bookmarks` - User-event bookmarks (many-to-many)
- `event_genres` - Event-genre associations (many-to-many)

## Enum Types

### `event_status`
- `'draft'` - Event is not yet published
- `'hidden'` - Event is hidden from public view
- `'published'` - Event is visible to users

### `venue_type_enum`
- `'bar'` - Bar/tavern
- `'club'` - Nightclub
- `'theater'` - Theater/concert hall
- `'venue'` - General venue
- `'outdoor'` - Outdoor venue
- `'other'` - Other venue types

### `source_type_enum`
- `'manual'` - Manually entered by team/admin
- `'api'` - From official API (e.g., Eventbrite API, Meetup API)
- `'scraping'` - Web scraping (HTML parsing)
- `'rss'` - RSS feed
- `'ics'` - iCalendar (.ics) file
- `'other'` - Other methods

### `ingestion_status_enum`
- `'pending'` - Queued for processing
- `'processing'` - Currently being processed
- `'success'` - Successfully ingested
- `'failed'` - Ingestion failed (needs review)

## Events Table - Source Tracking Fields

### `source_type` (enum)
**Purpose:** Indicates how the event data was acquired.

**Default:** `'manual'`

### `source_url` (text)
**Purpose:** URL where the event data originated from.

**Examples:**
- API: `https://api.eventbrite.com/v3/events/12345/`
- Scraping: `https://venue-website.com/events/jan-15-show`
- RSS: `https://venue.com/events.rss`
- ICS: `https://venue.com/calendar.ics`
- Manual: `NULL` (can be left empty)

### `ingestion_status` (enum)
**Purpose:** Tracks the status of the data ingestion process.

**Default:** `'success'`

**See also:** `backend/SOURCE_TRACKING.md` for detailed usage guide

## Events Table - Additional Fields

### `artist` (varchar(255), nullable)
**Purpose:** Name of the artist or performer for the event.

**Examples:**
- `"The Local Band"`
- `"Jazz Quartet"`
- `NULL` (for events without a specific artist)

### `image` (varchar(255), nullable)
**Purpose:** Stores local file path to event image.

**Format:** Relative path from `backend/public/` directory (e.g. `"images/events/event-123.jpg"`)

**Access:** Frontend accesses via `http://localhost:3000/images/events/event-123.jpg` (once static file serving is configured)

**Examples:**
- `"images/events/the-casbah.jpg"`
- `"images/events/jazz-night.png"`
- `NULL` (for events without images)

**Note:** Images are stored locally in the backend's public directory. Static file serving will be configured in the API branch.

## Venues Table - Location Fields

### `latitude` (decimal(10, 8), nullable)
**Purpose:** Geographic latitude coordinate for venue location.

**Precision:** 8 decimal places (accurate to ~1.1mm at equator)

**Range:** -90.0 to 90.0 (10 digits total: 2 before decimal, 8 after)

**Example:** `43.2557` (Hamilton, ON)

### `longitude` (decimal(11, 8), nullable)
**Purpose:** Geographic longitude coordinate for venue location.

**Precision:** 8 decimal places (accurate to ~1.1mm at equator)

**Range:** -180.0 to 180.0 (11 digits total: 3 before decimal, 8 after)

**Example:** `-79.8711` (Hamilton, ON)

**Note:** Both fields are nullable to allow venues without coordinates (can be populated later via geocoding).

## Constraints

### `events_start_time_future`
- **Table:** `events`
- **Constraint:** `start_time > created_at`
- **Purpose:** Events must start after creation

### `events_cost_non_negative`
- **Table:** `events`
- **Constraint:** `cost >= 0` OR `cost IS NULL`
- **Purpose:** Cost cannot be negative

### NOT NULL Constraints
- `venues.name` - Venue name is required
- `genres.name` - Genre name is required
- `events.status` - Event status is required

## Indexes

### `idx_events_start_time`
- **Table:** `events`
- **Column:** `start_time`
- **Purpose:** Optimize date-based queries and filtering

### `idx_events_status`
- **Table:** `events`
- **Column:** `status`
- **Purpose:** Optimize filtering by event status

### `idx_events_source_type`
- **Table:** `events`
- **Column:** `source_type`
- **Purpose:** Optimize filtering by data source

### `idx_events_ingestion_status`
- **Table:** `events`
- **Column:** `ingestion_status`
- **Purpose:** Optimize monitoring of ingestion pipeline

### `idx_events_venue_id`
- **Table:** `events`
- **Column:** `venue_id`
- **Purpose:** Optimize venue-event joins

### `idx_user_bookmarks_user_id`
- **Table:** `user_bookmarks`
- **Column:** `user_id`
- **Purpose:** Optimize bookmark queries by user (used by `getByUserId()`, `exists()`, `delete()`)

### `idx_user_bookmarks_created_at`
- **Table:** `user_bookmarks`
- **Column:** `created_at`
- **Purpose:** Optimize sorting bookmarks by creation date (for `getByUserId().oder()`)

## Sample Data

- 7 venues (4 initial + 3 new from real events)
- 6 events (3 initial + 3 real events from Eventbrite, all in Hamilton)
- 7 genres

## Migrations

All schema changes are tracked in `supabase/migrations/`:

- `001_initial_schema.sql` - Initial tables and sample data
- `002_add_enums_constraints_source_tracking.sql` - Enums, constraints, source tracking
- `003_add_sample_users_bookmarks.sql` - Sample user and bookmark data
- `004_upate_time_stamp.sql` - Change `start_time` from `TIMESTAMP` to `TIMESTAMPTZ`
- `005_add_artist_column_and_event_genres.sql` - Add `artist` column to events, populate event_genres
- `006_add_image_and_coordinates.sql` - Add `image` column to events, add `latitude`/`longitude` to venues
- `007_fix_longitude_precision_and_add_venue_coordinates.sql` - Fix longitude precision to DECIMAL(11, 8), add sample venue coordinates
- `008_add_sample_events_for_showcase.sql` - Add 3 real events from Eventbrite (CLUBMATTIX, LOUD LOVE, Therapy - November) with new venues
- `009_add_user_bookmarks_indexes.sql` - Add indexes on `user_bookmarks.user_id` and `user_bookmarks.created_at` for query performance

**To apply a migration:**
1. Review migration file
2. Copy SQL to Supabase Dashboard → SQL Editor
3. Run and verify
4. Update this documentation if schema changes


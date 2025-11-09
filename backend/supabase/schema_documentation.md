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

## Sample Data

- 4 venues
- 3 events
- 7 genres

## Migrations

All schema changes are tracked in `supabase/migrations/`:

- `001_initial_schema.sql` - Initial tables and sample data
- `002_add_enums_constraints_source_tracking.sql` - Enums, constraints, source tracking

**To apply a migration:**
1. Review migration file
2. Copy SQL to Supabase Dashboard → SQL Editor
3. Run and verify
4. Update this documentation if schema changes


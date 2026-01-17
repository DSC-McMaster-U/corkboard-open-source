# Database Methods Documentation

This document describes all available database methods in `supabaseClient.ts` for use by the **Backend Team** (service layer) and **Frontend Team** (via API endpoints).

---

## Table of Contents

- [Events](#events)
- [Venues](#venues)
- [Users](#users)
- [Bookmarks](#bookmarks)
- [Genres](#genres)
- [Artists](#artists)
- [Storage](#storage)
- [Authentication](#authentication)
- [Health Check](#health-check)

---

## Events

### `db.events.getAll(limit, min_start_time, max_start_time, min_cost, max_cost)`

**Purpose:** Retrieve a filtered list of events with related data (venues, genres, artists).

**Parameters:**
- `limit` (number): Maximum number of events to return
- `min_start_time` (string): ISO timestamp - events must start on or after this time
- `max_start_time` (string): ISO timestamp - events must start on or before this time
- `min_cost` (number): Minimum event cost (use `0` for no minimum)
- `max_cost` (number): Maximum event cost (use `Number.MAX_VALUE` for no maximum)

**Returns:** Supabase query object with events including:
- Event fields: `id`, `title`, `description`, `start_time`, `cost`, `status`, `image`, `artist_id`, etc.
- Nested `venues`: `id`, `name`, `address`, `venue_type`, `latitude`, `longitude`
- Nested `event_genres`: `genre_id` with nested `genres` (`id`, `name`)
- Nested `artists`: `id`, `name`, `bio`, `image`

**Usage Example:**
```typescript
// Get events in the next 30 days, cost between $10-$50
const { data, error } = await db.events.getAll(
    20, // limit
    new Date().toISOString(), // min_start_time (now)
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // max_start_time (30 days)
    10, // min_cost
    50  // max_cost
);
```

**When to Use:**
- Frontend: Event listing page with filters
- Backend: Event service layer for filtering logic

---

### `db.events.getById(eventId)`

**Purpose:** Retrieve a single event by ID with all related data.

**Parameters:**
- `eventId` (string): UUID of the event

**Returns:** Supabase query object with single event (same structure as `getAll`)

**Usage Example:**
```typescript
const { data: event, error } = await db.events.getById("123e4567-e89b-12d3-a456-426614174000");
```

**When to Use:**
- Frontend: Event detail page
- Backend: Event service for single event retrieval

---

### `db.events.create(eventData)`

**Purpose:** Create a new event in the database.

**Parameters:**
- `eventData` (object):
  - `title` (string, required): Event title
  - `description` (string | undefined): Event description
  - `venue_id` (string, required): UUID of the venue
  - `start_time` (string, required): ISO timestamp
  - `cost` (number | undefined): Event cost
  - `status` (string | undefined): Event status (`'draft'`, `'hidden'`, `'published'`)
  - `source_type` (string | undefined): Data source (`'manual'`, `'api'`, `'scraping'`, etc.)
  - `source_url` (string | undefined): URL where event data came from
  - `image` (string | undefined): Supabase Storage public URL (e.g., `"https://<project-id>.supabase.co/storage/v1/object/public/events/event-123.jpg"`)
  - `artist_id` (string | undefined): UUID of the artist

**Returns:** Supabase query object with created event

**Usage Example:**
```typescript
const { data, error } = await db.events.create({
    title: "Jazz Night",
    description: "Weekly jazz performance",
    venue_id: "venue-uuid-here",
    start_time: "2024-02-15T20:00:00Z",
    cost: 25.00,
    status: "published",
    source_type: "manual",
    image: "https://<project-id>.supabase.co/storage/v1/object/public/events/jazz-night.jpg",
    artist_id: "artist-uuid-here"
});
```

**When to Use:**
- Backend: Event creation endpoint (POST `/api/events`)
- Web scraping: Ingesting events from external sources

---

### `db.events.deleteById(eventId)`

**Purpose:** Delete an event by ID.

**Parameters:**
- `eventId` (string): UUID of the event to delete

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { error } = await db.events.deleteById("123e4567-e89b-12d3-a456-426614174000");
```

**When to Use:**
- Backend: Event deletion endpoint (DELETE `/api/events/:id`)
- Testing: Cleanup test data

---

## Venues

### `db.venues.getAll(limit?)`

**Purpose:** Retrieve a list of venues.

**Parameters:**
- `limit` (number, optional, default: 10): Maximum number of venues to return

**Returns:** Supabase query object with venue array

**Usage Example:**
```typescript
const { data: venues, error } = await db.venues.getAll(50);
```

**When to Use:**
- Frontend: Venue listing page
- Backend: Venue service for filtering/display

---

### `db.venues.getById(venueId)`

**Purpose:** Retrieve a single venue by ID.

**Parameters:**
- `venueId` (string): UUID of the venue

**Returns:** Supabase query object with single venue

**Usage Example:**
```typescript
const { data: venue, error } = await db.venues.getById("venue-uuid-here");
```

**When to Use:**
- Frontend: Venue detail page
- Backend: Validation before creating events

---

### `db.venues.create(venueData)`

**Purpose:** Create a new venue.

**Parameters:**
- `venueData` (object):
  - `name` (string, required): Venue name
  - `address` (string | undefined): Venue address
  - `venue_type` (string | undefined): Enum value (`'bar'`, `'club'`, `'theater'`, `'venue'`, `'outdoor'`, `'other'`)
  - `latitude` (number | undefined): Geographic latitude (decimal)
  - `longitude` (number | undefined): Geographic longitude (decimal)

**Returns:** Supabase query object with created venue

**Usage Example:**
```typescript
const { data, error } = await db.venues.create({
    name: "The Casbah",
    address: "306 King St W, Hamilton, ON",
    venue_type: "bar",
    latitude: 43.2588889,
    longitude: -79.8761111
});
```

**When to Use:**
- Backend: Venue creation endpoint
- Web scraping: Ingesting new venues

---

### `db.venues.deleteById(venueId)`

**Purpose:** Delete a venue by ID (mainly for testing).

**Parameters:**
- `venueId` (string): UUID of the venue

**Returns:** Supabase query object

**When to Use:**
- Testing: Cleanup test data

---

## Users

### `db.users.getById(userId)`

**Purpose:** Retrieve a user by ID (basic profile only).

**Parameters:**
- `userId` (string): UUID of the user

**Returns:** Supabase query object with user data:
- `id`, `email`, `name`, `username`, `profile_picture`, `bio`, `created_at`

**Usage Example:**
```typescript
const { data: user, error } = await db.users.getById("user-uuid-here");
```

**When to Use:**
- Backend: User profile endpoint (when favorites not needed)

---

### `db.users.getByIdWithFavorites(userId)`

**Purpose:** Retrieve a user by ID with all favorite genres, venues, and artists.

**Parameters:**
- `userId` (string): UUID of the user

**Returns:** Supabase query object with user data including:
- User fields: `id`, `email`, `name`, `username`, `profile_picture`, `bio`, `created_at`
- Nested `user_favorite_genres`: `genre_id` with nested `genres` (`id`, `name`)
- Nested `user_favorite_venues`: `venue_id` with nested `venues` (`id`, `name`, `address`, `venue_type`)
- Nested `user_favorite_artists`: `artist_id` with nested `artists` (`id`, `name`, `bio`, `image`)

**Usage Example:**
```typescript
const { data: user, error } = await db.users.getByIdWithFavorites("user-uuid-here");
// Access favorites: user.user_favorite_genres, user.user_favorite_venues, user.user_favorite_artists
```

**When to Use:**
- Frontend: Account page displaying user profile and favorites
- Backend: User profile endpoint with full data

---

### `db.users.getByUsername(username)`

**Purpose:** Retrieve a user by username (for profile pages, duplicate checks).

**Parameters:**
- `username` (string): Username to search for

**Returns:** Supabase query object with user or `null` if not found

**Usage Example:**
```typescript
const { data: user, error } = await db.users.getByUsername("testuser");
```

**When to Use:**
- Frontend: Public profile pages (`/users/testuser`)
- Backend: Username uniqueness validation

---

### `db.users.getByEmail(email)`

**Purpose:** Retrieve a user by email (for duplicate checks, login).

**Parameters:**
- `email` (string): Email address to search for

**Returns:** Supabase query object with user or `null` if not found

**Usage Example:**
```typescript
const { data: existingUser, error } = await db.users.getByEmail("user@example.com");
if (existingUser) {
    // Email already in use
}
```

**When to Use:**
- Backend: Registration endpoint (check email uniqueness)
- Backend: Login verification (if needed)

---

### `db.users.create(name, email)`

**Purpose:** Create a new user account (basic fields only).

**Parameters:**
- `name` (string): User's display name
- `email` (string): User's email (must be unique)

**Returns:** Supabase query object with created user

**Usage Example:**
```typescript
const { data: newUser, error } = await db.users.create("John Doe", "john@example.com");
```

**When to Use:**
- Backend: Registration endpoint (POST `/api/users`)
- **Note:** Use `db.auth.signUp()` for Supabase Auth integration (handles password hashing)

---

### `db.users.updateProfile(userId, updates)`

**Purpose:** Update user profile fields (username, name, profile_picture, bio).

**Parameters:**
- `userId` (string): UUID of the user
- `updates` (object, all optional):
  - `username` (string | undefined): New username
  - `name` (string | undefined): New display name
  - `profile_picture` (string | undefined): New profile picture path
  - `bio` (string | undefined): New bio text

**Returns:** Supabase query object with updated user

**Usage Example:**
```typescript
const { data: updatedUser, error } = await db.users.updateProfile(
    "user-uuid-here",
    {
        username: "newusername",
        bio: "Updated bio text"
    }
);
```

**When to Use:**
- Frontend: Account page edit functionality
- Backend: PUT/PATCH `/api/users/:id` endpoint

---

### `db.users.addFavoriteGenre(userId, genreId)`

**Purpose:** Add a genre to user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `genreId` (string): UUID of the genre

**Returns:** Supabase query object with created favorite record

**Usage Example:**
```typescript
const { data, error } = await db.users.addFavoriteGenre("user-uuid", "genre-uuid");
```

**When to Use:**
- Frontend: "Favorite" button on genre page
- Backend: POST `/api/users/:id/favorites/genres` endpoint

---

### `db.users.removeFavoriteGenre(userId, genreId)`

**Purpose:** Remove a genre from user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `genreId` (string): UUID of the genre

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { error } = await db.users.removeFavoriteGenre("user-uuid", "genre-uuid");
```

**When to Use:**
- Frontend: "Unfavorite" button on genre page
- Backend: DELETE `/api/users/:id/favorites/genres/:genreId` endpoint

---

### `db.users.addFavoriteVenue(userId, venueId)`

**Purpose:** Add a venue to user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `venueId` (string): UUID of the venue

**Returns:** Supabase query object with created favorite record

**Usage Example:**
```typescript
const { data, error } = await db.users.addFavoriteVenue("user-uuid", "venue-uuid");
```

**When to Use:**
- Frontend: "Favorite" button on venue page
- Backend: POST `/api/users/:id/favorites/venues` endpoint

---

### `db.users.removeFavoriteVenue(userId, venueId)`

**Purpose:** Remove a venue from user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `venueId` (string): UUID of the venue

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { error } = await db.users.removeFavoriteVenue("user-uuid", "venue-uuid");
```

**When to Use:**
- Frontend: "Unfavorite" button on venue page
- Backend: DELETE `/api/users/:id/favorites/venues/:venueId` endpoint

---

### `db.users.addFavoriteArtist(userId, artistId)`

**Purpose:** Add an artist to user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `artistId` (string): UUID of the artist

**Returns:** Supabase query object with created favorite record

**Usage Example:**
```typescript
const { data, error } = await db.users.addFavoriteArtist("user-uuid", "artist-uuid");
```

**When to Use:**
- Frontend: "Favorite" button on artist page
- Backend: POST `/api/users/:id/favorites/artists` endpoint

---

### `db.users.removeFavoriteArtist(userId, artistId)`

**Purpose:** Remove an artist from user's favorites.

**Parameters:**
- `userId` (string): UUID of the user
- `artistId` (string): UUID of the artist

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { error } = await db.users.removeFavoriteArtist("user-uuid", "artist-uuid");
```

**When to Use:**
- Frontend: "Unfavorite" button on artist page
- Backend: DELETE `/api/users/:id/favorites/artists/:artistId` endpoint

---

## Bookmarks

### `db.bookmarks.getByUserId(userId)`

**Purpose:** Retrieve all bookmarked events for a user.

**Parameters:**
- `userId` (string): UUID of the user

**Returns:** Supabase query object with bookmarks array, each including:
- Bookmark fields: `user_id`, `event_id`, `created_at`
- Nested `events`: Full event data with nested `venues` and `artists`
- Ordered by `created_at` (newest first)

**Usage Example:**
```typescript
const { data: bookmarks, error } = await db.bookmarks.getByUserId("user-uuid-here");
// bookmarks is an array of bookmark objects with nested event data
```

**When to Use:**
- Frontend: User's bookmarks page
- Backend: GET `/api/bookmarks` endpoint (for authenticated user)

---

### `db.bookmarks.exists(userId, eventId)`

**Purpose:** Check if a bookmark exists (for toggle functionality).

**Parameters:**
- `userId` (string): UUID of the user
- `eventId` (string): UUID of the event

**Returns:** Supabase query object with bookmark or `null`

**Usage Example:**
```typescript
const { data: bookmark, error } = await db.bookmarks.exists("user-uuid", "event-uuid");
if (bookmark) {
    // Bookmark exists
} else {
    // Bookmark doesn't exist
}
```

**When to Use:**
- Frontend: Check if event is bookmarked (for UI state)
- Backend: Bookmark toggle logic

---

### `db.bookmarks.create(userId, eventId)`

**Purpose:** Add an event to user's bookmarks.

**Parameters:**
- `userId` (string): UUID of the user
- `eventId` (string): UUID of the event

**Returns:** Supabase query object with created bookmark

**Usage Example:**
```typescript
const { data, error } = await db.bookmarks.create("user-uuid", "event-uuid");
```

**When to Use:**
- Frontend: "Bookmark" button on event page
- Backend: POST `/api/bookmarks` endpoint

---

### `db.bookmarks.delete(userId, eventId)`

**Purpose:** Remove an event from user's bookmarks.

**Parameters:**
- `userId` (string): UUID of the user
- `eventId` (string): UUID of the event

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { error } = await db.bookmarks.delete("user-uuid", "event-uuid");
```

**When to Use:**
- Frontend: "Unbookmark" button on event page
- Backend: DELETE `/api/bookmarks/:eventId` endpoint

---

## Genres

### `db.genres.getAll()`

**Purpose:** Retrieve all genres.

**Returns:** Supabase query object with genres array

**Usage Example:**
```typescript
const { data: genres, error } = await db.genres.getAll();
```

**When to Use:**
- Frontend: Genre filter dropdown
- Backend: Genre listing endpoint

---

### `db.genres.getByName(name)`

**Purpose:** Retrieve a genre by name (for duplicate checks).

**Parameters:**
- `name` (string): Genre name

**Returns:** Supabase query object with genre or `null`

**Usage Example:**
```typescript
const { data: genre, error } = await db.genres.getByName("Rock");
```

**When to Use:**
- Backend: Genre creation validation

---

### `db.genres.create(name)`

**Purpose:** Create a new genre.

**Parameters:**
- `name` (string): Genre name (must be unique)

**Returns:** Supabase query object with created genre

**Usage Example:**
```typescript
const { data, error } = await db.genres.create("Blues");
```

**When to Use:**
- Backend: Genre creation endpoint

---

## Artists

### `db.artists.getAll()`

**Purpose:** Retrieve all artists.

**Returns:** Supabase query object with artists array

**Usage Example:**
```typescript
const { data: artists, error } = await db.artists.getAll();
```

**When to Use:**
- Frontend: Artist listing page
- Backend: Artist service for filtering

---

### `db.artists.getByName(name)`

**Purpose:** Retrieve an artist by name (for duplicate checks).

**Parameters:**
- `name` (string): Artist name

**Returns:** Supabase query object with artist or `null`

**Usage Example:**
```typescript
const { data: artist, error } = await db.artists.getByName("The Local Band");
```

**When to Use:**
- Backend: Artist creation validation
- Web scraping: Check if artist already exists before creating

---

### `db.artists.getById(artistId)`

**Purpose:** Retrieve an artist by ID.

**Parameters:**
- `artistId` (string): UUID of the artist

**Returns:** Supabase query object with artist

**Usage Example:**
```typescript
const { data: artist, error } = await db.artists.getById("artist-uuid-here");
```

**When to Use:**
- Frontend: Artist detail page
- Backend: Artist service for single artist retrieval

---

### `db.artists.create(name, bio?, image?)`

**Purpose:** Create a new artist.

**Parameters:**
- `name` (string, required): Artist name (must be unique)
- `bio` (string | undefined): Artist biography
- `image` (string | undefined): Supabase Storage public URL (e.g., `"https://<project-id>.supabase.co/storage/v1/object/public/artists/artist-123.jpg"`)

**Returns:** Supabase query object with created artist

**Usage Example:**
```typescript
const { data, error } = await db.artists.create(
    "The Local Band",
    "A local Hamilton band",
    "https://<project-id>.supabase.co/storage/v1/object/public/artists/local-band.jpg"
);
```

**When to Use:**
- Backend: Artist creation endpoint
- Web scraping: Ingesting new artists from event data

---

## Storage

### `db.storage.upload(bucket, filePath, file)`

**Purpose:** Upload an image file to Supabase Storage.

**Parameters:**
- `bucket` (`'events'` | `'artists'` | `'users'`): Storage bucket name
- `filePath` (string): Path within the bucket (e.g., `'event-123.jpg'` or `'events/event-123.jpg'`)
- `file` (File | Blob): File object to upload

**Returns:** Supabase Storage upload response with `{ data, error }`

**Usage Example:**
```typescript
const file = new File([buffer], 'event-image.jpg', { type: 'image/jpeg' });
const { data, error } = await db.storage.upload('events', 'event-123.jpg', file);
```

**When to Use:**
- Backend: Image upload service layer
- **Note:** Prefer using `imageService.uploadImage()` which includes validation and error handling

---

### `db.storage.getPublicUrl(bucket, filePath)`

**Purpose:** Get the public URL for an image in Supabase Storage.

**Parameters:**
- `bucket` (`'events'` | `'artists'` | `'users'`): Storage bucket name
- `filePath` (string): Path within the bucket

**Returns:** Object with `{ data: { publicUrl: string } }`

**Usage Example:**
```typescript
const { data } = db.storage.getPublicUrl('events', 'event-123.jpg');
const publicUrl = data.publicUrl; // Full URL to access the image
```

**When to Use:**
- Backend: After uploading, get URL to store in database
- **Note:** Public URLs are permanent and don't expire

---

### `db.storage.delete(bucket, filePath)`

**Purpose:** Delete an image from Supabase Storage.

**Parameters:**
- `bucket` (`'events'` | `'artists'` | `'users'`): Storage bucket name
- `filePath` (string): Path within the bucket

**Returns:** Supabase Storage delete response with `{ data, error }`

**Usage Example:**
```typescript
const { error } = await db.storage.delete('events', 'event-123.jpg');
```

**When to Use:**
- Backend: Image deletion service layer
- **Note:** Prefer using `imageService.deleteImage()` which handles URL parsing

---

### `db.storage.list(bucket, path?)`

**Purpose:** List files in a storage bucket (for debugging/migration).

**Parameters:**
- `bucket` (`'events'` | `'artists'` | `'users'`): Storage bucket name
- `path` (string | undefined): Optional subdirectory path

**Returns:** Supabase Storage list response with file array

**Usage Example:**
```typescript
const { data: files, error } = await db.storage.list('events', 'event-123');
```

**When to Use:**
- Backend: Migration scripts, debugging
- Not typically used in production code

---

## Authentication

### `db.auth.validateJWT(token)`

**Purpose:** Validate a JWT token with Supabase Auth.

**Parameters:**
- `token` (string): JWT token from request headers

**Returns:** Supabase Auth user object or error

**Usage Example:**
```typescript
const { data: { user }, error } = await db.auth.validateJWT(token);
```

**When to Use:**
- Backend: Authentication middleware (verify user is logged in)

---

### `db.auth.signUp(email, password)`

**Purpose:** Register a new user in Supabase Auth (handles password hashing).

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password (will be hashed)

**Returns:** Supabase Auth response with user and session

**Usage Example:**
```typescript
const { data, error } = await db.auth.signUp("user@example.com", "password123");
// After successful signup, create user record in users table with db.users.create()
```

**When to Use:**
- Backend: Registration endpoint (POST `/api/auth/register`)
- **Note:** After signup, create corresponding record in `users` table

---

### `db.auth.signIn(email, password)`

**Purpose:** Sign in user and get JWT token.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:** Supabase Auth response with user and session (includes JWT token)

**Usage Example:**
```typescript
const { data: { user, session }, error } = await db.auth.signIn("user@example.com", "password123");
// session.access_token is the JWT token to send to frontend
```

**When to Use:**
- Backend: Login endpoint (POST `/api/auth/login`)
- **Note:** Frontend should store JWT token and send in Authorization header for protected routes

---

### `db.auth.signOut()`

**Purpose:** Sign out the current user (optional, for future use).

**Returns:** Supabase Auth response

**When to Use:**
- Backend: Logout endpoint (POST `/api/auth/logout`)

---

## Health Check

### `db.healthCheck()`

**Purpose:** Check database connectivity (returns venue count).

**Returns:** Supabase query object

**Usage Example:**
```typescript
const { data, error } = await db.healthCheck();
```

**When to Use:**
- Backend: Health check endpoint (GET `/api/health`)

---

## Phase 2 Requirements Coverage

### ✅ Completed

1. **User Account Management:**
   - ✅ Edit account information: `db.users.updateProfile()`
   - ✅ Create new user: `db.users.create()` + `db.auth.signUp()`
   - ✅ Verify login info: `db.auth.signIn()`
   - ✅ User profile fields: `username`, `profile_picture`, `bio` supported

2. **Favorites:**
   - ✅ Favorite/unfavorite genres: `db.users.addFavoriteGenre()` / `removeFavoriteGenre()`
   - ✅ Favorite/unfavorite venues: `db.users.addFavoriteVenue()` / `removeFavoriteVenue()`
   - ✅ Favorite/unfavorite artists: `db.users.addFavoriteArtist()` / `removeFavoriteArtist()`
   - ✅ Get user with favorites: `db.users.getByIdWithFavorites()`

3. **Bookmarks:**
   - ✅ Bookmark event: `db.bookmarks.create()`
   - ✅ Unbookmark event: `db.bookmarks.delete()`
   - ✅ Get user bookmarks: `db.bookmarks.getByUserId()`
   - ✅ Check if bookmarked: `db.bookmarks.exists()`

4. **Image Files:**
   - ✅ Images stored in Supabase Storage (cloud storage, not local files)
   - ✅ Image URLs stored in database (`events.image`, `artists.image`, `users.profile_picture`)
   - ✅ Image upload/delete endpoints available (`/api/images/*`)
   - ✅ Storage methods in `db.storage` for direct access

### ❌ Missing / Not Yet Implemented

1. **Event Archiving:**
   - ❌ No method to archive/delete events after their date
   - **Recommendation:** Add `db.events.archivePastEvents()` or filter in `getAll()` by default

---

## Common Patterns

### Error Handling

All methods return Supabase query objects with `{ data, error }` structure:

```typescript
const { data, error } = await db.events.getById(eventId);
if (error) {
    // Handle error
    console.error(error);
    return;
}
// Use data
```

### TypeScript Types

Import types from Supabase client for type safety:

```typescript
import type { Database } from '@supabase/supabase-js';
// Use Database['public']['Tables']['events']['Row'] for event types
```

### Authentication Flow

1. User registers: `db.auth.signUp()` → create user record with `db.users.create()`
2. User logs in: `db.auth.signIn()` → returns JWT token
3. Protected routes: Validate JWT with `db.auth.validateJWT()` or `authService.validateToken()`
4. Get user data: Use `db.users.getById()` or `getByIdWithFavorites()` with user ID from JWT

---

## Notes for Frontend Team

- **Image URLs:** Images are stored in Supabase Storage. Access via public URLs stored in database (e.g., `https://<project-id>.supabase.co/storage/v1/object/public/events/event-123.jpg`)
- **Image Upload:** Use `POST /api/images/events`, `/api/images/artists`, or `/api/images/users` endpoints
- **JWT Tokens:** Store JWT token from login and send in `Authorization: Bearer <token>` header
- **User ID:** Extract user ID from JWT token payload (handled by `authService.getUser()`)
- **Favorites:** Use `getByIdWithFavorites()` to get all favorites in one call (more efficient than separate calls)

---

## Notes for Backend Team

- **Service Layer:** Always use these methods through the service layer (e.g., `eventService`, `userService`)
- **Validation:** Add validation in service layer before calling database methods
- **Error Handling:** Wrap database calls in try-catch and return appropriate HTTP status codes
- **Testing:** Use `getFirst()` for testing, but prefer `getById()` for production

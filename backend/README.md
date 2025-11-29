# Corkboard Backend

## Quick Start

### **1. Get Supabase Access**

-   Project URL: `https://supabase.com/dashboard/project/dniawpahwcqtvcnaaexv`
-   Ask Billy to invite you to the Supabase project (if you haven't already done so!)

### **2. Local Setup**

```bash
cd backend/
cp env.example .env
npm install
npm run dev
```

### **3. Test Health**

```bash
curl http://localhost:3000/api/health
```

## Project Structure

**Three-Tier Architecture (Presentation → Application → Database):**

```
src/
├── app.ts              # Main entry point
├── meta.cts
├── routes/             # API endpoints (RESTful APIs)
│   ├── auth.ts
│   ├── bookmarks.ts
│   ├── events.ts
│   ├── genres.ts
│   ├── health.ts
│   ├── users.ts
│   └── venues.ts
├── services/           # Business logic
│   ├── authService.ts
│   ├── eventService.ts
│   ├── genreService.ts
│   ├── healthService.ts
│   ├── userService.ts
│   └── venueService.ts
├── db/                 # Database client
|   └── supabaseClient.ts
└── utils/              # General Utilities
    ├── cmp.ts
    └── parser.ts
```

**Request Flow:** Route → Service → Database → Supabase

## Database

**Tables:** venues, events, users, genres, user_bookmarks, event_genres  
**Sample Data:** 4 venues, 3 events, 7 genres loaded

## API Endpoints

-   `GET /api/health` - Health check
-   `GET /api/events` - Get events
-   `POST /api/events` - Create an event
-   `GET /api/users` - Parse user from JWT token
-   `GET /api/venues` - Get venues
-   `POST /api/venues` - Create a venue
-   `GET /api/bookmarks/` - Get bookmarks
-   `POST /api/bookmarks/` - Create a bookmark
-   `DELETE /api/bookmarks/` - Delete a bookmark
-   `GET /api/genres/` - Get genres
-   `POST /api/genres/` - Create a genre

Endpoint documentation is available at endpoint-docs.md.

## Development

**Adding Features:**

1. Create route file in `routes/`
2. Create service file in `services/`
3. Add route to `app.ts`
4. Add database methods to `db/supabaseClient.ts` if needed

## Future Enhancements

**Post-MVP Considerations:**

-   **Prisma ORM**
-   **Web Scraping**
-   **Geographic Features**
-   **Advanced Features**
-   **Testing**

**Note:** Current structure supports all of these, as database layer is isolated, routes/services are modular. Add enhancements as needed without major refactoring.

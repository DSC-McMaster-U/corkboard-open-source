# Corkboard Backend - Week 3

## Quick Start

### **1. Get Supabase Access**
- Project URL: `https://supabase.com/dashboard/project/dniawpahwcqtvcnaaexv`
- Ask Billy to invite you to the Supabase project (if you haven't already done so!)

### **2. Local Setup**
```bash
cd backend/
cp env.example .env
npm install
npm run dev
```

### **3. Test Endpoints**
- Health: `http://localhost:3000/api/health`
- Events: `http://localhost:3000/api/events`
- Venues: `http://localhost:3000/api/venues`

## Project Structure

**Three-Tier Architecture (Presentation → Application → Database):**

```
src/
├── app.ts              # Main entry point
├── routes/             # API endpoints (RESTful APIs)
│   ├── events.ts
│   ├── venues.ts
│   └── health.ts
├── services/           # Business logic
│   ├── eventService.ts
│   ├── venueService.ts
│   └── healthService.ts
└── db/                 # Database access
    └── supabaseClient.ts
```

**Request Flow:** Route → Service → Database → Supabase

## Database

**Tables:** venues, events, users, genres, user_bookmarks, event_genres  
**Sample Data:** 4 venues, 3 events, 7 genres loaded

## API Endpoints (current)

- `GET /api/health` - Health check
- `GET /api/events` - List events
- `GET /api/venues` - List venues

## Development

**Adding Features:**
1. Create route file in `routes/`
2. Create service file in `services/`
3. Add route to `app.ts`
4. Add database methods to `db/supabaseClient.ts` if needed

## Future Enhancements

**Post-MVP Considerations:**
- **Prisma ORM**
- **Web Scraping**
- **Geographic Features**
- **Advanced Features**
- **Testing**

**Note:** Current structure supports all of these, as database layer is isolated, routes/services are modular. Add enhancements as needed without major refactoring.
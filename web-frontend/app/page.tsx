import { apiClient } from '@/lib/api-client';
import { EventCard } from '@/components/event-card';
import { EventCardSkeleton } from '@/components/event-card-skeleton';
import { MusicIcon, CalendarIcon } from 'lucide-react';
import { Suspense } from 'react';

async function EventsList() {
  const data = await apiClient.getEvents();

  if (data.count === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <MusicIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Corkboard</h1>
              <p className="text-sm text-muted-foreground">Hamilton Music Scene</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          </div>
          <p className="text-muted-foreground">
            Discover local music events happening around Hamilton
          </p>
        </div>

        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Corkboard. Bringing Hamilton's music scene together.
          </p>
        </div>
      </footer>
    </div>
  );
}

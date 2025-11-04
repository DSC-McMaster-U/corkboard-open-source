import { apiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let event;
  try {
    event = await apiClient.getEventById(parseInt(id));
  } catch (error) {
    notFound();
  }

  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <MapPinIcon className="h-5 w-5" />
              {event.venue_name}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {event.description && (
              <div>
                <h3 className="font-semibold mb-2">About this event</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold">Date & Time</h3>
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{formatDate(startDate)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(startDate)}
                      {endDate && ` - ${formatTime(endDate)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Location</h3>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{event.venue_name}</p>
                    {event.venue_address && (
                      <p className="text-sm text-muted-foreground">{event.venue_address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {event.genre_tags && event.genre_tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {event.genre_tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.latitude && event.longitude && (
              <div className="space-y-3">
                <h3 className="font-semibold">Map</h3>
                <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      parseFloat(event.longitude) - 0.01
                    },${parseFloat(event.latitude) - 0.01},${
                      parseFloat(event.longitude) + 0.01
                    },${parseFloat(event.latitude) + 0.01}&layer=mapnik&marker=${
                      event.latitude
                    },${event.longitude}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { Event } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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
    <Link href={`/events/${event.id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPinIcon className="h-4 w-4" />
            {event.venue_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatTime(startDate)}
                {endDate && ` - ${formatTime(endDate)}`}
              </span>
            </div>
          </div>

          {event.genre_tags && event.genre_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.genre_tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.genre_tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.genre_tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        {event.venue_address && (
          <CardFooter>
            <p className="text-xs text-muted-foreground line-clamp-1">{event.venue_address}</p>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

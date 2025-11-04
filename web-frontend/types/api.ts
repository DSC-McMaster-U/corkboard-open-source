// API types matching the backend schema
export interface Event {
  id: number;
  title: string;
  description: string | null;
  venue_name: string;
  venue_address: string | null;
  latitude: string | null;
  longitude: string | null;
  start_time: string;
  end_time: string | null;
  genre_tags: string[];
  thumbnail_url: string | null;
  created_at: string;
}

export interface EventsResponse {
  count: number;
  events: Event[];
}

export interface GenreEventsResponse {
  genre: string;
  count: number;
  events: Event[];
}

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
}

import { Event, EventsResponse, GenreEventsResponse, HealthResponse } from '@/types/api';

// Use server-side API_URL for SSR, fall back to client-side NEXT_PUBLIC_API_URL
// This allows server-to-server communication in Docker while client uses the gateway
const getApiBaseUrl = () => {
  // Server-side: use internal Docker network
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3000';
  }
  // Client-side: use gateway/public URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    // Re-evaluate base URL on each request (for SSR vs client-side)
    const baseUrl = getApiBaseUrl();
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/health');
  }

  async getEvents(): Promise<EventsResponse> {
    return this.fetch<EventsResponse>('/events');
  }

  async getEventById(id: number): Promise<Event> {
    return this.fetch<Event>(`/events/${id}`);
  }

  async getEventsByGenre(genre: string): Promise<GenreEventsResponse> {
    return this.fetch<GenreEventsResponse>(`/events/genre/${encodeURIComponent(genre)}`);
  }
}

export const apiClient = new ApiClient();

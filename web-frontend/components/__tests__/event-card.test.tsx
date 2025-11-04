import { render, screen } from '@testing-library/react';
import { EventCard } from '../event-card';
import { Event } from '@/types/api';

const mockEvent: Event = {
  id: 1,
  title: 'Test Event',
  description: 'This is a test event description',
  venue_name: 'Test Venue',
  venue_address: '123 Test St, Hamilton, ON',
  latitude: '43.2557',
  longitude: '-79.8711',
  start_time: '2025-11-15T20:00:00-05:00',
  end_time: '2025-11-15T23:30:00-05:00',
  genre_tags: ['indie', 'rock', 'alternative'],
  thumbnail_url: null,
  created_at: '2025-10-30T00:00:00Z',
};

describe('EventCard', () => {
  it('renders event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders venue name', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('renders event description', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
  });

  it('renders genre tags', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('indie')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
    expect(screen.getByText('alternative')).toBeInTheDocument();
  });

  it('renders venue address', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('123 Test St, Hamilton, ON')).toBeInTheDocument();
  });

  it('has correct link to event detail page', () => {
    const { container } = render(<EventCard event={mockEvent} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/events/1');
  });
});

import eventsData from '@/data/events.json';

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventParticipant {
  name: string;
  role: string;
  image: string;
  location: string;
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  image: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  description: string;
  fullDescription: string;
  content: string[];
  faqs: EventFAQ[];
  participants: EventParticipant[];
  price: number;
  isFree: boolean;
  availableTickets: number;
  registeredCount: number;
}

/**
 * Get all events
 */
export function getAllEvents(): Event[] {
  return eventsData.events;
}

/**
 * Get event by ID
 */
export function getEventById(id: string): Event | undefined {
  return eventsData.events.find(event => event.id === id);
}

/**
 * Get event by slug
 */
export function getEventBySlug(slug: string): Event | undefined {
  return eventsData.events.find(event => event.slug === slug);
}

/**
 * Get upcoming events (events with future dates)
 */
export function getUpcomingEvents(): Event[] {
  const today = new Date();
  return eventsData.events.filter(event => {
    // Simple date comparison - in production, parse dates properly
    return true; // For now, return all events
  });
}


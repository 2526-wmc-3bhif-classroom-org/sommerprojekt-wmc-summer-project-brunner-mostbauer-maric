/**
 * Events Data Service
 * Manages events and calendar-related API calls
 */

import { apiClient } from './client';
import { cacheManager } from './cache';

export interface CalendarEntry {
  id?: number;
  type: string;
  date: string;
  auto?: boolean;
}

class EventService {
  private eventsCacheKey = 'events:list';
  private eventsCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all events with caching
   */
  async fetchEvents(force = false): Promise<CalendarEntry[]> {
    if (!force && cacheManager.has(this.eventsCacheKey)) {
      return cacheManager.get<CalendarEntry[]>(this.eventsCacheKey) || [];
    }

    const data = await apiClient.get<Array<{ EventId: number; Type: string; Date: string }>>('/events');
    const events = data.map((e) => ({
      id: e.EventId,
      type: e.Type,
      date: e.Date,
      auto: false,
    }));
    cacheManager.set(this.eventsCacheKey, events, this.eventsCacheTTL);
    return events;
  }

  /**
   * Add a new event
   */
  async addEvent(type: string, date: string): Promise<CalendarEntry | null> {
    try {
      const response = await apiClient.post<{ EventId: number; message: string }>('/events', {
        type,
        date,
      });
      const event: CalendarEntry = {
        id: response.EventId,
        type: type,
        date: date,
      };
      this.invalidate();
      return event;
    } catch (error) {
      console.error('Failed to add event:', error);
      return null;
    }
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: number, type: string, date: string): Promise<boolean> {
    try {
      await apiClient.patch(`/events/${eventId}`, { type, date });
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to update event:', error);
      return false;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/events/${eventId}`);
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  }

  /**
   * Invalidate events cache
   */
  invalidate(): void {
    cacheManager.invalidate(this.eventsCacheKey);
  }
}

export const eventService = new EventService();

/**
 * KM Log Data Service
 * Manages kilometer log-related API calls
 */

import { apiClient } from './client.js';
import { cacheManager } from './cache.js';

export interface KmLog {
  id: number;
  startKm: number;
  endKm: number;
  startLocation: string;
  endLocation: string;
  conditions: string;
  enrollmentId: number;
  date: string;
}

class KmLogService {
  private kmLogsCacheKey = 'kmlogs:list';
  private kmLogsCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all KM logs with caching
   */
  async fetchKmLogs(force = false): Promise<KmLog[]> {
    if (!force && cacheManager.has(this.kmLogsCacheKey)) {
      return cacheManager.get<KmLog[]>(this.kmLogsCacheKey) || [];
    }

    const data = await apiClient.get<KmLog[]>('/kmlogs');
    cacheManager.set(this.kmLogsCacheKey, data, this.kmLogsCacheTTL);
    return data;
  }

  /**
   * Add a new KM log entry
   */
  async addKmLog(startKm: number, endKm: number, startLocation: string, endLocation: string, conditions: string): Promise<KmLog | null> {
    try {
      const response = await apiClient.post<KmLog>('/kmlogs', {
        startKm,
        endKm,
        startLocation,
        endLocation,
        conditions,
      });
      this.invalidate();
      return response;
    } catch (error) {
      console.error('Failed to add KM log:', error);
      return null;
    }
  }

  /**
   * Update a KM log entry
   */
  async updateKmLog(logId: number, startKm: number, endKm: number, startLocation: string, endLocation: string, conditions: string): Promise<boolean> {
    try {
      await apiClient.patch(`/kmlogs/${logId}`, {
        startKm,
        endKm,
        startLocation,
        endLocation,
        conditions,
      });
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to update KM log:', error);
      return false;
    }
  }

  /**
   * Delete a KM log entry
   */
  async deleteKmLog(logId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/kmlogs/${logId}`);
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to delete KM log:', error);
      return false;
    }
  }

  /**
   * Invalidate KM logs cache
   */
  invalidate(): void {
    cacheManager.invalidate(this.kmLogsCacheKey);
  }
}

export const kmLogService = new KmLogService();

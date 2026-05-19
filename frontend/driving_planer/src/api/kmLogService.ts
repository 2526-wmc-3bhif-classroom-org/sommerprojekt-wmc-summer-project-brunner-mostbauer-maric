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
  enrollmentId?: number;
  date?: string;
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

    const data = await apiClient.get<Array<{ KmLogId: number; StartKm: number; EndKm: number; StartLocation: string; EndLocation: string; Conditions: string; UserId: number; Timestamp: string }>>('/kmlog');
    const logs = data.map((log) => ({
      id: log.KmLogId,
      startKm: log.StartKm,
      endKm: log.EndKm,
      startLocation: log.StartLocation,
      endLocation: log.EndLocation,
      conditions: log.Conditions,
      date: log.Timestamp,
    }));
    cacheManager.set(this.kmLogsCacheKey, logs, this.kmLogsCacheTTL);
    return logs;
  }

  /**
   * Add a new KM log entry
   */
  async addKmLog(startKm: number, endKm: number, startLocation: string, endLocation: string, conditions: string): Promise<KmLog | null> {
    try {
      const response = await apiClient.post<{ KmLogId: number; StartKm: number; EndKm: number; StartLocation: string; EndLocation: string; Conditions: string; UserId: number; Timestamp: string }>('/kmlog', {
        startKm,
        endKm,
        startLocation,
        endLocation,
        conditions,
      });
      const log: KmLog = {
        id: response.KmLogId,
        startKm: response.StartKm,
        endKm: response.EndKm,
        startLocation: response.StartLocation,
        endLocation: response.EndLocation,
        conditions: response.Conditions,
        date: response.Timestamp,
      };
      this.invalidate();
      return log;
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
      await apiClient.put(`/kmlog/${logId}`, {
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
      await apiClient.delete(`/kmlog/${logId}`);
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

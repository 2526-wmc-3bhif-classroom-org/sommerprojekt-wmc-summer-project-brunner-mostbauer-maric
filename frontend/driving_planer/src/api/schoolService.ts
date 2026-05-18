/**
 * School Data Service
 * Centralized management for school and rating data with caching
 */

import { apiClient } from './client.js';
import { cacheManager } from './cache.js';
import type { DrivingSchool, Rating } from '@/types.js';

class SchoolService {
  private schoolsCacheKey = 'schools:list';
  private ratingsCacheKey = 'schools:ratings';
  private schoolCountCacheKey = 'schools:count';
  private schoolCacheTTL = 10 * 60 * 1000; // 10 minutes
  private ratingsCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all schools with caching
   */
  async fetchSchools(force = false): Promise<DrivingSchool[]> {
    if (!force && cacheManager.has(this.schoolsCacheKey)) {
      return cacheManager.get<DrivingSchool[]>(this.schoolsCacheKey) || [];
    }

    const schools = await apiClient.get<DrivingSchool[]>('/schools');
    cacheManager.set(this.schoolsCacheKey, schools, this.schoolCacheTTL);
    return schools;
  }

  /**
   * Fetch school count with caching
   */
  async fetchSchoolCount(force = false): Promise<number> {
    if (!force && cacheManager.has(this.schoolCountCacheKey)) {
      return cacheManager.get<number>(this.schoolCountCacheKey) || 0;
    }

    const response = await apiClient.get<{ count: number }>('/schools/count');
    const count = response.count;
    cacheManager.set(this.schoolCountCacheKey, count, this.schoolCacheTTL);
    return count;
  }

  /**
   * Fetch all ratings with caching
   */
  async fetchRatings(force = false): Promise<Rating[]> {
    if (!force && cacheManager.has(this.ratingsCacheKey)) {
      return cacheManager.get<Rating[]>(this.ratingsCacheKey) || [];
    }

    const ratings = await apiClient.get<Rating[]>('/ratings', { skipAuth: true });
    cacheManager.set(this.ratingsCacheKey, ratings, this.ratingsCacheTTL);
    return ratings;
  }

  /**
   * Add or update a rating
   */
  async setRating(schoolId: number, stars: number): Promise<boolean> {
    try {
      if (stars === 0) {
        // Delete rating
        await apiClient.delete(`/ratings/${schoolId}`);
      } else {
        // Check if we need to create or update
        const ratings = await this.fetchRatings();
        const existingRating = ratings.find(
          (r) => r.DrivingSchoolId === schoolId
        );

        if (existingRating) {
          // Update existing
          await apiClient.patch('/ratings', { schoolId, stars });
        } else {
          // Create new
          await apiClient.post('/ratings', { schoolId, stars });
        }
      }

      // Invalidate cache to force refresh
      cacheManager.invalidate(this.ratingsCacheKey);
      return true;
    } catch (error) {
      console.error('Failed to set rating:', error);
      return false;
    }
  }

  /**
   * Get cached school by ID
   */
  async getSchoolById(id: number): Promise<DrivingSchool | null> {
    const schools = await this.fetchSchools();
    return schools.find((s) => s.DrivingSchoolId === id) || null;
  }

  /**
   * Get cached ratings for a specific school
   */
  async getSchoolRatings(schoolId: number): Promise<Rating[]> {
    const ratings = await this.fetchRatings();
    return ratings.filter((r) => r.DrivingSchoolId === schoolId);
  }

  /**
   * Invalidate all school-related caches
   */
  invalidateAll(): void {
    cacheManager.invalidate(this.schoolsCacheKey);
    cacheManager.invalidate(this.ratingsCacheKey);
    cacheManager.invalidate(this.schoolCountCacheKey);
  }
}

export const schoolService = new SchoolService();

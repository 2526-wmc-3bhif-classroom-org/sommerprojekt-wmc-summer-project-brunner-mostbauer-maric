/**
 * Course Data Service
 * Manages course and program-related API calls
 */

import { apiClient } from './client';
import { cacheManager } from './cache';

export interface Course {
  id: number;
  drivingSchoolId: number;
  licenseType: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  weekdays: string[];
  isSchnellkurs: boolean;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
}

class CourseService {
  private getCoursesCacheKey = (enrollmentId: number) => `courses:enrollment:${enrollmentId}`;
  private coursesCacheTTL = 10 * 60 * 1000; // 10 minutes

  /**
   * Fetch course details for an enrollment
   */
  async fetchCourse(enrollmentId: number, force = false): Promise<Course | null> {
    const cacheKey = this.getCoursesCacheKey(enrollmentId);

    if (!force && cacheManager.has(cacheKey)) {
      return cacheManager.get<Course>(cacheKey);
    }

    try {
      const response = await apiClient.get<Course>(
        `/enrollments/${enrollmentId}/course`
      );
      cacheManager.set(cacheKey, response, this.coursesCacheTTL);
      return response;
    } catch (error) {
      console.error('Failed to fetch course:', error);
      return null;
    }
  }

  /**
   * Invalidate course cache for an enrollment
   */
  invalidateCourse(enrollmentId: number): void {
    const cacheKey = this.getCoursesCacheKey(enrollmentId);
    cacheManager.invalidate(cacheKey);
  }

  /**
   * Invalidate all course caches
   */
  invalidateAll(): void {
    cacheManager.invalidatePattern(/^courses:/);
  }
}

export const courseService = new CourseService();

/**
 * Enrollment Data Service
 * Manages enrollment-related API calls with caching
 */

import { apiClient } from './client.js';
import { cacheManager } from './cache.js';
import type { Enrollment, Appointment } from '@/types.js';

class EnrollmentService {
  private enrollmentsCacheTTL = 10 * 60 * 1000; // 10 minutes
  private appointmentsCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cache key for user enrollments
   */
  private getEnrollmentsCacheKey(userId: number): string {
    return `enrollments:user:${userId}`;
  }

  /**
   * Get cache key for enrollment appointments
   */
  private getAppointmentsCacheKey(enrollmentId: number): string {
    return `appointments:enrollment:${enrollmentId}`;
  }

  /**
   * Fetch user enrollments with caching
   */
  async fetchEnrollments(userId: number, force = false): Promise<Enrollment[]> {
    const cacheKey = this.getEnrollmentsCacheKey(userId);

    if (!force && cacheManager.has(cacheKey)) {
      return cacheManager.get<Enrollment[]>(cacheKey) || [];
    }

    const enrollments = await apiClient.get<Enrollment[]>(
      `/users/${userId}/enrollments`
    );
    cacheManager.set(cacheKey, enrollments, this.enrollmentsCacheTTL);
    return enrollments;
  }

  /**
   * Check if user has any enrollments
   */
  async hasEnrollments(userId: number, force = false): Promise<boolean> {
    const enrollments = await this.fetchEnrollments(userId, force);
    return enrollments.length > 0;
  }

  /**
   * Fetch appointments for an enrollment
   */
  async fetchAppointments(enrollmentId: number, force = false): Promise<Appointment[]> {
    const cacheKey = this.getAppointmentsCacheKey(enrollmentId);

    if (!force && cacheManager.has(cacheKey)) {
      return cacheManager.get<Appointment[]>(cacheKey) || [];
    }

    const appointments = await apiClient.get<Appointment[]>(
      `/enrollments/${enrollmentId}/appointments`
    );
    cacheManager.set(cacheKey, appointments, this.appointmentsCacheTTL);
    return appointments;
  }

  /**
   * Get the first enrollment for a user (common use case)
   */
  async getFirstEnrollment(userId: number): Promise<Enrollment | null> {
    const enrollments = await this.fetchEnrollments(userId);
    return enrollments[0] || null;
  }

  /**
   * Invalidate user's enrollment cache
   */
  invalidateEnrollments(userId: number): void {
    const cacheKey = this.getEnrollmentsCacheKey(userId);
    cacheManager.invalidate(cacheKey);
  }

  /**
   * Invalidate all enrollments (useful on logout)
   */
  invalidateAll(): void {
    cacheManager.invalidatePattern(/^enrollments:/);
    cacheManager.invalidatePattern(/^appointments:/);
  }
}

export const enrollmentService = new EnrollmentService();

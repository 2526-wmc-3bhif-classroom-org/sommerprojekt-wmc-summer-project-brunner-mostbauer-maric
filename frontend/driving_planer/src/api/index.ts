/**
 * API Services Index
 * Central export for all API-related services and utilities
 */

export { apiClient } from './client';
export type { ApiResponse, ApiRequestConfig, HttpMethod } from './client';

export { cacheManager } from './cache';
export type { CacheEntry, CacheConfig } from './cache';

export { schoolService } from './schoolService';
export { enrollmentService } from './enrollmentService';
export { taskService } from './taskService';
export type { Task } from './taskService';

export { eventService } from './eventService';
export type { CalendarEntry } from './eventService';

export { kmLogService } from './kmLogService';
export type { KmLog } from './kmLogService';

export { courseService } from './courseService';
export type { Course } from './courseService';

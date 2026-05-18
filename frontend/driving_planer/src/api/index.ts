/**
 * API Services Index
 * Central export for all API-related services and utilities
 */

export { apiClient } from './client.js';
export type { ApiResponse, ApiRequestConfig, HttpMethod } from './client.js';

export { cacheManager } from './cache.js';
export type { CacheEntry, CacheConfig } from './cache.js';

export { schoolService } from './schoolService.js';
export { enrollmentService } from './enrollmentService.js';
export { taskService } from './taskService.js';
export type { Task } from './taskService.js';

export { eventService } from './eventService.js';
export type { CalendarEntry } from './eventService.js';

export { kmLogService } from './kmLogService.js';
export type { KmLog } from './kmLogService.js';

export { courseService } from './courseService.js';
export type { Course } from './courseService.js';

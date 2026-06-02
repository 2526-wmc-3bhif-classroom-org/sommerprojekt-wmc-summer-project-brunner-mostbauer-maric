/**
 * Task Data Service
 * Manages task-related API calls with caching
 */

import { apiClient } from './client';
import { cacheManager } from './cache';

export interface Task {
  id: number;
  text: string;
  done: boolean;
  isDefault: boolean;
}

class TaskService {
  private tasksCacheKey = 'tasks:list';
  private tasksCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all tasks with caching
   */
  async fetchTasks(force = false): Promise<Task[]> {
    if (!force && cacheManager.has(this.tasksCacheKey)) {
      return cacheManager.get<Task[]>(this.tasksCacheKey) || [];
    }

    const data = await apiClient.get<Array<{ TaskId: number; Text: string; Done: number; IsDefault: number }>>('/tasks');
    const tasks = data.map((t) => ({
      id: t.TaskId,
      text: t.Text,
      done: t.Done === 1,
      isDefault: t.IsDefault === 1,
    }));
    cacheManager.set(this.tasksCacheKey, tasks, this.tasksCacheTTL);
    return tasks;
  }

  /**
   * Create a new task
   */
  async createTask(text: string, isDefault: boolean = false): Promise<Task | null> {
    try {
      const response = await apiClient.post<{ TaskId: number; Text: string; Done: number; IsDefault: number }>(
        '/tasks',
        { text, isDefault }
      );
      const task: Task = {
        id: response.TaskId,
        text: response.Text,
        done: response.Done === 1,
        isDefault: response.IsDefault === 1,
      };
      this.invalidate();
      return task;
    } catch (error) {
      console.error('Failed to create task:', error);
      return null;
    }
  }

  /**
   * Create multiple tasks
   */
  async createMultipleTasks(texts: string[]): Promise<void> {
    try {
      await Promise.all(
        texts.map((text) =>
          apiClient.post('/tasks', { text, isDefault: true })
        )
      );
      this.invalidate();
    } catch (error) {
      console.error('Failed to create multiple tasks:', error);
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTask(taskId: number, done: boolean): Promise<boolean> {
    try {
      await apiClient.put(`/tasks/${taskId}/done`, { done });
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to toggle task:', error);
      return false;
    }
  }

  /**
   * Update task text
   */
  async updateTaskText(taskId: number, text: string): Promise<boolean> {
    try {
      await apiClient.put(`/tasks/${taskId}/text`, { text });
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to update task text:', error);
      return false;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      this.invalidate();
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  }

  /**
   * Invalidate task cache
   */
  invalidate(): void {
    cacheManager.invalidate(this.tasksCacheKey);
  }
}

export const taskService = new TaskService();

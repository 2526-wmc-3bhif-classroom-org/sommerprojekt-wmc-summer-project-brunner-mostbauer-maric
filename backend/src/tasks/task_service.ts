import { TaskRepository } from "./task_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";
import type { Task } from "../models/types.js";

export interface ServiceResult<T = any> {
  status: number;
  data?: T;
  error?: { message: string };
}

export class TaskService {
  private static instance: TaskService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new TaskService(TaskRepository.Instance);
    return this.instance;
  }

  private constructor(private taskRepo: TaskRepository) {}

  public getTasksForUser(userId: number): ServiceResult<Task[]> {
    const unit = Unit.createReadonly();
    try {
      const tasks = this.taskRepo.getByUserId(unit, userId);
      return { status: StatusCodes.OK, data: tasks };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete();
    }
  }

  public addTask(userId: number, text: string, isDefault: boolean): ServiceResult {
    if (!text || !text.trim()) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Text darf nicht leer sein" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const taskId = this.taskRepo.create(unit, userId, text.trim(), isDefault);
      success = true;
      return { status: StatusCodes.CREATED, data: { TaskId: taskId, message: "Task gespeichert" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public updateDone(taskId: number, userId: number, done: boolean): ServiceResult {
    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.taskRepo.updateDone(unit, taskId, userId, done);
      if (updated) { success = true; return { status: StatusCodes.OK, data: { message: "Task aktualisiert" } }; }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Task nicht gefunden" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public updateText(taskId: number, userId: number, text: string): ServiceResult {
    if (!text || !text.trim()) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Text darf nicht leer sein" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.taskRepo.updateText(unit, taskId, userId, text.trim());
      if (updated) { success = true; return { status: StatusCodes.OK, data: { message: "Task aktualisiert" } }; }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Task nicht gefunden oder nicht editierbar" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public deleteTask(taskId: number, userId: number): ServiceResult {
    const unit = new Unit(false);
    let success = false;
    try {
      const deleted = this.taskRepo.delete(unit, taskId, userId);
      if (deleted) { success = true; return { status: StatusCodes.OK, data: { message: "Task gelöscht" } }; }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Task nicht gefunden" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }
}

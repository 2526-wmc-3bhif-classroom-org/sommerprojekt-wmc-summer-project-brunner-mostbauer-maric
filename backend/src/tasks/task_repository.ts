import { Unit } from "../unit.js";
import type { Task } from "../models/types.js";

export class TaskRepository {
  private static instance: TaskRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new TaskRepository();
    return this.instance;
  }

  private constructor() {}

  public getByUserId(unit: Unit, userId: number): Task[] {
    return unit
      .prepare<Task>("SELECT * FROM Task WHERE UserId = ? ORDER BY TaskId ASC")
      .all(userId);
  }

  public getById(unit: Unit, taskId: number, userId: number): Task | undefined {
    return unit
      .prepare<Task>("SELECT * FROM Task WHERE TaskId = ? AND UserId = ?")
      .get(taskId, userId);
  }

  public create(unit: Unit, userId: number, text: string, isDefault: boolean): number {
    const result = unit
      .prepare("INSERT INTO Task (UserId, Text, Done, IsDefault) VALUES (?, ?, 0, ?)")
      .run(userId, text, isDefault ? 1 : 0);
    return result.lastInsertRowid as number;
  }

  public updateDone(unit: Unit, taskId: number, userId: number, done: boolean): boolean {
    const result = unit
      .prepare("UPDATE Task SET Done = ? WHERE TaskId = ? AND UserId = ?")
      .run(done ? 1 : 0, taskId, userId);
    return result.changes > 0;
  }

  public updateText(unit: Unit, taskId: number, userId: number, text: string): boolean {
    const result = unit
      .prepare("UPDATE Task SET Text = ? WHERE TaskId = ? AND UserId = ? AND IsDefault = 0")
      .run(text, taskId, userId);
    return result.changes > 0;
  }

  public delete(unit: Unit, taskId: number, userId: number): boolean {
    const result = unit
      .prepare("DELETE FROM Task WHERE TaskId = ? AND UserId = ?")
      .run(taskId, userId);
    return result.changes > 0;
  }
}

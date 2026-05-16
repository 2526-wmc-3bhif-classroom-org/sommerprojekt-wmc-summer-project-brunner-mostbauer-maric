import { Unit } from "../unit.js";

export class EventRepository {
  private static instance: EventRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new EventRepository();
    return this.instance;
  }

  private constructor() {}

  public getByUserId(unit: Unit, userId: number): any[] {
    return unit
      .prepare("SELECT * FROM UserEvent WHERE UserId = ? ORDER BY Date ASC")
      .all(userId);
  }

  public create(unit: Unit, userId: number, type: string, date: string): number {
    const result = unit
      .prepare("INSERT INTO UserEvent (UserId, Type, Date) VALUES (?, ?, ?)")
      .run(userId, type, date);
    return result.lastInsertRowid as number;
  }

  public delete(unit: Unit, eventId: number, userId: number): boolean {
    const result = unit
      .prepare("DELETE FROM UserEvent WHERE EventId = ? AND UserId = ?")
      .run(eventId, userId);
    return result.changes > 0;
  }
}

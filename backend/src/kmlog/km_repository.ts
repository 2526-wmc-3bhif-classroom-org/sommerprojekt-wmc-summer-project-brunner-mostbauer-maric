import { Unit } from "../unit.js";
import type { KmLog } from "../models/types.js";

export class KmLogRepository {
  private static instance: KmLogRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new KmLogRepository();
    return this.instance;
  }

  private constructor() {}

  public getByUserId(unit: Unit, userId: number): KmLog[] {
    return unit
      .prepare<KmLog>("SELECT * FROM KmLog WHERE UserId = ? ORDER BY Timestamp DESC")
      .all(userId);
  }

  public create(
    unit: Unit,
    userId: number,
    startKm: number,
    endKm: number,
    startLocation: string,
    endLocation: string,
    conditions: string | null
  ): number {
    const result = unit
      .prepare(
        `INSERT INTO KmLog (UserId, StartKm, EndKm, StartLocation, EndLocation, Conditions)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(userId, startKm, endKm, startLocation, endLocation, conditions);
    return result.lastInsertRowid as number;
  }

  public delete(unit: Unit, kmLogId: number, userId: number): boolean {
    const result = unit
      .prepare("DELETE FROM KmLog WHERE KmLogId = ? AND UserId = ?")
      .run(kmLogId, userId);
    return result.changes > 0;
  }

  public update(
    unit: Unit,
    kmLogId: number,
    userId: number,
    startKm: number,
    endKm: number,
    startLocation: string,
    endLocation: string,
    conditions: string | null
  ): boolean {
    const result = unit
      .prepare(
        `UPDATE KmLog 
         SET StartKm = ?, EndKm = ?, StartLocation = ?, EndLocation = ?, Conditions = ?
         WHERE KmLogId = ? AND UserId = ?`
      )
      .run(startKm, endKm, startLocation, endLocation, conditions, kmLogId, userId);
    return result.changes > 0;
  }
}

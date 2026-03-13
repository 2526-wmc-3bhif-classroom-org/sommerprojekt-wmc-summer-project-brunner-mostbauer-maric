import { Unit } from "../unit.js";
import type { DrivingSchool } from "../models/types.js";

export class SchoolRepository {
  private static instance: SchoolRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new SchoolRepository();
    return this.instance;
  }

  private constructor() {}

  public getAll(unit: Unit): DrivingSchool[] {
    return unit.prepare<DrivingSchool>("SELECT * FROM DrivingSchool").all();
  }

  public getById(unit: Unit, id: number): DrivingSchool | undefined {
    return unit
      .prepare<DrivingSchool, { id: number }>(
        "SELECT * FROM DrivingSchool WHERE DrivingSchoolId = :id",
        { id }
      )
      .get();
  }

  public getCount(unit: Unit): number {
    const result = unit
      .prepare<{ count: number }>("SELECT COUNT(*) AS count FROM DrivingSchool")
      .get();
    return result?.count ?? 0;
  }
}

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

  public update(unit: Unit, id: number, name: string, location?: string, owner?: string, email?: string, website?: string, phone?: string, openingDays?: string, openingTimeFrom?: string, openingTimeTo?: string): boolean {
    const result = unit
      .prepare("UPDATE DrivingSchool SET Name = ?, Location = ?, Owner = ?, Email = ?, Website = ?, Phone = ?, OpeningDays = ?, OpeningTimeFrom = ?, OpeningTimeTo = ? WHERE DrivingSchoolId = ?")
      .run(name, location ?? null, owner ?? null, email ?? null, website ?? null, phone ?? null, openingDays ?? null, openingTimeFrom ?? null, openingTimeTo ?? null, id);
    return result.changes > 0;
  }

  public create(
    unit: Unit,
    name: string,
    location?: string,
    owner?: string,
    email?: string,
    website?: string,
    phone?: string,
    latitude?: number | null,
    longitude?: number | null
  ): number {
    const result = unit
      .prepare(
        "INSERT INTO DrivingSchool (Name, Location, Owner, Email, Website, Phone, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .run(
        name,
        location ?? null,
        owner ?? null,
        email ?? null,
        website ?? null,
        phone ?? null,
        latitude ?? null,
        longitude ?? null
      );
    return result.lastInsertRowid as number;
  }
}

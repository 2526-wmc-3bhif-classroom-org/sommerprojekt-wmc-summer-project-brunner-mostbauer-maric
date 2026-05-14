import { Unit } from "../unit.js";
import type { Rating } from "../models/types.js";

export class RatingRepository {
  private static instance: RatingRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new RatingRepository();
    return this.instance;
  }

  private constructor() {}

  public getAll(unit: Unit): Rating[] {
    return unit.prepare<Rating>("SELECT * FROM Rating").all();
  }

  public getAllBySchoolId(unit: Unit, schoolId: number): Rating[] {
    return unit
      .prepare<Rating, { schoolId: number }>(
        "SELECT * FROM Rating WHERE DrivingSchoolId = :schoolId",
        { schoolId }
      )
      .all();
  }

  public getByUserAndSchool(unit: Unit, userId: number, schoolId: number): Rating | undefined {
    return unit
      .prepare<Rating, { userId: number; schoolId: number }>(
        "SELECT * FROM Rating WHERE UserId = :userId AND DrivingSchoolId = :schoolId",
        { userId, schoolId }
      )
      .get();
  }

  public create(unit: Unit, userId: number, schoolId: number, stars: number): boolean {
    const result = unit
      .prepare("INSERT INTO Rating (UserId, DrivingSchoolId, Stars, Date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)")
      .run(userId, schoolId, stars);
    return result.changes > 0;
  }

  public updateStars(unit: Unit, userId: number, schoolId: number, stars: number): boolean {
    const result = unit
      .prepare("UPDATE Rating SET Stars = ?, Date = CURRENT_TIMESTAMP WHERE UserId = ? AND DrivingSchoolId = ?")
      .run(stars, userId, schoolId);
    return result.changes > 0;
  }

  public delete(unit: Unit, userId: number, schoolId: number): boolean {
    const result = unit
      .prepare("DELETE FROM Rating WHERE UserId = ? AND DrivingSchoolId = ?")
      .run(userId, schoolId);
    return result.changes > 0;
  }
}

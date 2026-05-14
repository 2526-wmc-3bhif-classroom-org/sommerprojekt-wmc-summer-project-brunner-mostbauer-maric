import { Unit } from "../unit.js";
import { RatingRepository } from "./rating_repository.js";
import type { Rating } from "../models/types.js";

export class RatingService {
  private static instance: RatingService | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new RatingService();
    return this.instance;
  }

  private constructor() {}

  public getAllRatings(): Rating[] {
    const unit = Unit.createReadonly();
    try {
      return RatingRepository.Instance.getAll(unit);
    } finally {
      unit.complete();
    }
  }

  public getRatingsBySchool(schoolId: number): Rating[] {
    const unit = Unit.createReadonly();
    try {
      return RatingRepository.Instance.getAllBySchoolId(unit, schoolId);
    } finally {
      unit.complete();
    }
  }

  public createRating(userId: number, schoolId: number, stars: number): boolean {
    const unit = new Unit(false);
    try {
      const existing = RatingRepository.Instance.getByUserAndSchool(unit, userId, schoolId);
      if (existing) throw new Error("Rating already exists. Use PATCH to update.");
      const res = RatingRepository.Instance.create(unit, userId, schoolId, stars);
      unit.complete(true);
      return res;
    } catch (e) {
      unit.complete(false);
      throw e;
    }
  }

  public updateRating(userId: number, schoolId: number, stars: number): boolean {
    const unit = new Unit(false);
    try {
      const existing = RatingRepository.Instance.getByUserAndSchool(unit, userId, schoolId);
      if (!existing) throw new Error("Rating not found. Use POST to create.");
      const res = RatingRepository.Instance.updateStars(unit, userId, schoolId, stars);
      unit.complete(true);
      return res;
    } catch (e) {
      unit.complete(false);
      throw e;
    }
  }

  public deleteRating(userId: number, schoolId: number): boolean {
    const unit = new Unit(false);
    try {
      const res = RatingRepository.Instance.delete(unit, userId, schoolId);
      unit.complete(true);
      return res;
    } catch (e) {
      unit.complete(false);
      throw e;
    }
  }
}

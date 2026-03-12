import { SchoolRepository } from "./school_repository.js";
import { Unit } from "../unit.js";
import type { DrivingSchool } from "../models/types.js";

export class SchoolService {
  private static instance: SchoolService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new SchoolService(SchoolRepository.Instance);
    return this.instance;
  }

  private constructor(private schoolRepo: SchoolRepository) {}

  public getAllSchools(): DrivingSchool[] {
    const unit = Unit.createReadonly();
    try {
      return this.schoolRepo.getAll(unit);
    } finally {
      unit.complete();
    }
  }

  public getSchoolById(id: number): DrivingSchool | undefined {
    const unit = Unit.createReadonly();
    try {
      return this.schoolRepo.getById(unit, id);
    } finally {
      unit.complete();
    }
  }
}

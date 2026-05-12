import { SchoolRepository } from "./school_repository.js";
import { Unit } from "../unit.js";
import type { DrivingSchool } from "../models/types.js";
import { StatusCodes } from "http-status-codes";
import type { ServiceResult } from "../users/user_service.js";

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

  public getSchoolById(id: number): ServiceResult<DrivingSchool> {
    if (isNaN(id)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid schoolId" },
      };
    }

    const unit = Unit.createReadonly();
    try {
      const school = this.schoolRepo.getById(unit, id);
      if (school) {
        return {
          status: StatusCodes.OK,
          data: school,
        };
      } else {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "School not found" },
        };
      }
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete();
    }
  }

  public updateSchool(id: number, name: string, location?: string, owner?: string, email?: string, website?: string, phone?: string): ServiceResult<void> {
    if (isNaN(id)) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Invalid schoolId" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.schoolRepo.update(unit, id, name, location, owner, email, website, phone);
      if (!updated) {
        return { status: StatusCodes.NOT_FOUND, error: { message: "School not found" } };
      }
      success = true;
      return { status: StatusCodes.OK };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public getSchoolCount(): number {
    const unit = Unit.createReadonly();
    try {
      return this.schoolRepo.getCount(unit);
    } finally {
      unit.complete();
    }
  }
}

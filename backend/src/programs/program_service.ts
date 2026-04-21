import { Unit } from "../unit.js";
import { ProgramRepository } from "./program_repository.js";
import type { LicenseProgram, UserRole } from "../models/types.js";
import { StatusCodes } from "http-status-codes";
import type { ServiceResult } from "../users/user_service.js";

export class ProgramService {
  private static instance: ProgramService | null = null;

  public static get Instance() {
    if (this.instance === null) {
      this.instance = new ProgramService();
    }
    return this.instance;
  }

  private constructor() {}

  public createProgram(
    program: Omit<LicenseProgram, "LicenseProgramId" | "CurrentParticipants">,
    requestUserRole: UserRole
  ): ServiceResult {
    // Authorization check: Only ADMIN or SCHOOL
    if (requestUserRole !== UserRole.ADMIN && requestUserRole !== UserRole.SCHOOL) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "Only schools or admins can create programs" },
      };
    }

    // Basic validation
    if (!program.DrivingSchoolId || !program.LicenseTypeId || !program.DateFrom || !program.DateTo || program.Price === undefined) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Missing required fields for program creation" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const programId = ProgramRepository.create(unit, {
        ...program,
        CurrentParticipants: 0,
      });
      success = true;
      return {
        status: StatusCodes.CREATED,
        data: { id: programId },
      };
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete(success);
    }
  }

  public getProgramsBySchool(schoolId: number): ServiceResult {
    const unit = Unit.createReadonly();
    try {
      const programs = ProgramRepository.findBySchoolId(unit, schoolId);
      return {
        status: StatusCodes.OK,
        data: programs,
      };
    } finally {
      unit.complete();
    }
  }

  public getAllPrograms(): ServiceResult {
    const unit = Unit.createReadonly();
    try {
      const programs = ProgramRepository.findAll(unit);
      return {
        status: StatusCodes.OK,
        data: programs,
      };
    } finally {
      unit.complete();
    }
  }
}

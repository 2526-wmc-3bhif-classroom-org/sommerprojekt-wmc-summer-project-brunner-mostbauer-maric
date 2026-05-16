import { Unit } from "../unit.js";
import { ProgramRepository } from "./program_repository.js";
import { UserRole } from "../models/types.js";
import type { LicenseProgram } from "../models/types.js";
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

  public updateProgram(programId: number, data: any, requestUserRole: UserRole): ServiceResult {
    if (requestUserRole !== UserRole.ADMIN && requestUserRole !== UserRole.SCHOOL) {
      return { status: StatusCodes.FORBIDDEN, error: { message: "Only schools or admins can update programs" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const existing = ProgramRepository.findById(unit, programId);
      if (!existing) return { status: StatusCodes.NOT_FOUND, error: { message: "Program not found" } };
      const updated = success = ProgramRepository.update(unit, programId, { ...existing, ...data });
      return updated
        ? { status: StatusCodes.OK, data: { message: "Updated" } }
        : { status: StatusCodes.NOT_FOUND, error: { message: "Program not found" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public deleteProgram(programId: number, requestUserRole: UserRole): ServiceResult {
    if (requestUserRole !== UserRole.ADMIN && requestUserRole !== UserRole.SCHOOL) {
      return { status: StatusCodes.FORBIDDEN, error: { message: "Only schools or admins can delete programs" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const deleted = ProgramRepository.delete(unit, programId);
      success = deleted;
      return deleted
        ? { status: StatusCodes.OK, data: { message: "Deleted" } }
        : { status: StatusCodes.NOT_FOUND, error: { message: "Program not found" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public enrollUser(programId: number, targetUserId: number, requestUserId: number, requestUserRole: UserRole, goal?: string, plannerStartDate?: string): ServiceResult {
    if (requestUserRole !== "admin" && requestUserId !== targetUserId) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You can only enroll yourself unless you are an admin" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const program = ProgramRepository.findById(unit, programId);
      if (!program) {
        return { status: StatusCodes.NOT_FOUND, error: { message: "Program not found" } };
      }

      if (program.CurrentParticipants >= program.MaxParticipants) {
        return { status: StatusCodes.BAD_REQUEST, error: { message: "Program is full" } };
      }

      const existingEnrollment = ProgramRepository.checkEnrollment(unit, targetUserId, programId);
      if (existingEnrollment) {
        return { status: StatusCodes.BAD_REQUEST, error: { message: "User is already enrolled in this program" } };
      }

      const enrollmentId = ProgramRepository.enrollUser(unit, targetUserId, programId, goal, plannerStartDate);
      ProgramRepository.updateCurrentParticipants(unit, programId, 1);
      
      success = true;
      return {
        status: StatusCodes.CREATED,
        data: { id: enrollmentId, message: "Successfully enrolled" },
      };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public unenrollUser(programId: number, targetUserId: number, requestUserId: number, requestUserRole: UserRole): ServiceResult {
    if (requestUserRole !== "admin" && requestUserId !== targetUserId) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You can only unenroll yourself unless you are an admin" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const program = ProgramRepository.findById(unit, programId);
      if (!program) {
        return { status: StatusCodes.NOT_FOUND, error: { message: "Program not found" } };
      }

      const existingEnrollment = ProgramRepository.checkEnrollment(unit, targetUserId, programId);
      if (!existingEnrollment) {
        return { status: StatusCodes.BAD_REQUEST, error: { message: "User is not enrolled in this program" } };
      }

      ProgramRepository.unenrollUser(unit, targetUserId, programId);
      ProgramRepository.updateCurrentParticipants(unit, programId, -1);

      success = true;
      return {
        status: StatusCodes.OK,
        data: { message: "Successfully unenrolled" },
      };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public updateEnrollmentPlanner(programId: number, userId: number, goal: string, plannerStartDate: string): ServiceResult {
    if (!goal || !plannerStartDate) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Goal und PlannerStartDate sind erforderlich" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const updated = ProgramRepository.updateEnrollmentPlanner(unit, userId, programId, goal, plannerStartDate);
      if (updated) {
        success = true;
        return { status: StatusCodes.OK, data: { message: "Planner-Daten aktualisiert" } };
      }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Enrollment nicht gefunden" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }
}

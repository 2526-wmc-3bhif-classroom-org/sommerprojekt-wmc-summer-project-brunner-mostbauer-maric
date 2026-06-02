import { EnrollmentRepository } from "./enrollment_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";
import type { Appointment, LicenseProgram } from "../models/types.js";

export interface ServiceResult<T = any> {
  status: number;
  data?: T;
  error?: { message: string };
}

export class EnrollmentService {
  private static instance: EnrollmentService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new EnrollmentService(EnrollmentRepository.Instance);
    return this.instance;
  }

  private constructor(private enrollmentRepo: EnrollmentRepository) {}

  public getAppointmentsForEnrollment(enrollmentId: number, userId: number): ServiceResult<Appointment[]> {
    const unit = Unit.createReadonly();
    try {
      // Verify enrollment belongs to the authenticated user
      const enrollment = this.enrollmentRepo.getEnrollment(unit, enrollmentId);
      if (!enrollment || enrollment.UserId !== userId) {
        return { status: StatusCodes.FORBIDDEN, error: { message: "Zugriff verweigert" } };
      }

      const appointments = this.enrollmentRepo.getAppointmentsForEnrollment(unit, enrollmentId);
      return { status: StatusCodes.OK, data: appointments };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete();
    }
  }

  public getCourseForEnrollment(enrollmentId: number, userId: number): ServiceResult<LicenseProgram> {
    const unit = Unit.createReadonly();
    try {
      // Verify enrollment belongs to the authenticated user
      const enrollment = this.enrollmentRepo.getEnrollment(unit, enrollmentId);
      if (!enrollment || enrollment.UserId !== userId) {
        return { status: StatusCodes.FORBIDDEN, error: { message: "Zugriff verweigert" } };
      }

      const course = this.enrollmentRepo.getCourseForEnrollment(unit, enrollmentId);
      if (course) {
        return { status: StatusCodes.OK, data: course };
      }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Enrollment oder zugehöriger Kurs nicht gefunden" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete();
    }
  }
}

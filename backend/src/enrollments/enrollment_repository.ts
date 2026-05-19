import { Unit } from "../unit.js";
import type { Appointment, LicenseProgram, Enrollment } from "../models/types.js";

export class EnrollmentRepository {
  private static instance: EnrollmentRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new EnrollmentRepository();
    return this.instance;
  }

  private constructor() {}

  public getEnrollment(unit: Unit, enrollmentId: number): Enrollment | undefined {
    return unit
      .prepare<Enrollment>("SELECT * FROM Enrollment WHERE EnrollmentId = ?")
      .get(enrollmentId);
  }

  public getAppointmentsForEnrollment(unit: Unit, enrollmentId: number): Appointment[] {
    return unit
      .prepare<Appointment>("SELECT * FROM Appointment WHERE EnrollmentId = ? ORDER BY DateTime ASC")
      .all(enrollmentId);
  }

  public getCourseForEnrollment(unit: Unit, enrollmentId: number): LicenseProgram | undefined {
    return unit
      .prepare<LicenseProgram>(
        `SELECT lp.* FROM LicenseProgram lp 
         INNER JOIN Enrollment e ON lp.LicenseProgramId = e.LicenseProgramId 
         WHERE e.EnrollmentId = ?`
      )
      .get(enrollmentId);
  }
}


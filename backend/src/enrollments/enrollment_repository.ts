import { Unit } from "../unit.js";
import type { Appointment } from "../models/types.js";

export class EnrollmentRepository {
  private static instance: EnrollmentRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new EnrollmentRepository();
    return this.instance;
  }

  private constructor() {}

  public getAppointmentsForEnrollment(unit: Unit, enrollmentId: number): Appointment[] {
    return unit
      .prepare<Appointment>("SELECT * FROM Appointment WHERE EnrollmentId = ? ORDER BY DateTime ASC")
      .all(enrollmentId);
  }
}

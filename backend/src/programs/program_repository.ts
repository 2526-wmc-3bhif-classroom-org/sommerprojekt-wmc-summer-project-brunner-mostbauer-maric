import { Unit } from "../unit.js";
import type { LicenseProgram } from "../models/types.js";

export class ProgramRepository {
  public static create(unit: Unit, program: Omit<LicenseProgram, "LicenseProgramId">): number {
    const stmt = unit.prepare(`
      INSERT INTO LicenseProgram (
        DrivingSchoolId, LicenseTypeId, DateFrom, DateTo, Weekdays, 
        IsSchnellkurs, Price, MaxParticipants, CurrentParticipants
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      program.DrivingSchoolId,
      program.LicenseTypeId,
      program.DateFrom,
      program.DateTo,
      program.Weekdays ?? null,
      program.IsSchnellkurs ?? 0,
      program.Price,
      program.MaxParticipants,
      program.CurrentParticipants ?? 0
    );

    return unit.getLastRowId();
  }

  public static findBySchoolId(unit: Unit, schoolId: number): LicenseProgram[] {
    const stmt = unit.prepare<LicenseProgram>(
      "SELECT * FROM LicenseProgram WHERE DrivingSchoolId = ?"
    );
    return stmt.all(schoolId);
  }

  public static findById(unit: Unit, id: number): LicenseProgram | undefined {
    const stmt = unit.prepare<LicenseProgram>(
      "SELECT * FROM LicenseProgram WHERE LicenseProgramId = ?"
    );
    return stmt.get(id);
  }

  public static findAll(unit: Unit): LicenseProgram[] {
    const stmt = unit.prepare<LicenseProgram>("SELECT * FROM LicenseProgram");
    return stmt.all();
  }

  public static enrollUser(unit: Unit, userId: number, programId: number): number {
    const stmt = unit.prepare(`
      INSERT INTO Enrollment (UserId, LicenseProgramId, Status)
      VALUES (?, ?, 'active')
    `);
    stmt.run(userId, programId);
    return unit.getLastRowId();
  }

  public static unenrollUser(unit: Unit, userId: number, programId: number): void {
    const stmt = unit.prepare(`
      DELETE FROM Enrollment
      WHERE UserId = ? AND LicenseProgramId = ?
    `);
    stmt.run(userId, programId);
  }

  public static checkEnrollment(unit: Unit, userId: number, programId: number): any {
    const stmt = unit.prepare(`
      SELECT * FROM Enrollment
      WHERE UserId = ? AND LicenseProgramId = ?
    `);
    return stmt.get(userId, programId);
  }

  public static update(unit: Unit, programId: number, data: Partial<LicenseProgram>): boolean {
    const stmt = unit.prepare(`
      UPDATE LicenseProgram
      SET LicenseTypeId = ?, DateFrom = ?, DateTo = ?, Weekdays = ?,
          IsSchnellkurs = ?, Price = ?, MaxParticipants = ?
      WHERE LicenseProgramId = ?
    `);
    const result = stmt.run(
      data.LicenseTypeId,
      data.DateFrom,
      data.DateTo,
      data.Weekdays ?? null,
      data.IsSchnellkurs ?? 0,
      data.Price,
      data.MaxParticipants,
      programId
    );
    return (result.changes as number) > 0;
  }

  public static delete(unit: Unit, programId: number): boolean {
    const result = unit.prepare('DELETE FROM LicenseProgram WHERE LicenseProgramId = ?').run(programId);
    return (result.changes as number) > 0;
  }

  public static updateCurrentParticipants(unit: Unit, programId: number, change: number): void {
    const stmt = unit.prepare(`
      UPDATE LicenseProgram
      SET CurrentParticipants = CurrentParticipants + ?
      WHERE LicenseProgramId = ?
    `);
    stmt.run(change, programId);
  }

  public static getEnrollmentsByUser(unit: Unit, userId: number): any[] {
    const stmt = unit.prepare(`
      SELECT e.*, p.* 
      FROM Enrollment e
      JOIN LicenseProgram p ON e.LicenseProgramId = p.LicenseProgramId
      WHERE e.UserId = ?
    `);
    return stmt.all(userId);
  }
}

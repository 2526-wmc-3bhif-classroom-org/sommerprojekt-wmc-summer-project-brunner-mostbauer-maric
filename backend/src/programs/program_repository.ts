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
}

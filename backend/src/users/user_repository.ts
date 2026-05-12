import { Unit } from "../unit.js";
import { UserRole } from "../models/types.js";

export interface User {
  UserId: number;
  UserName: string;
  Email: string;
  PasswordHash: string;
  Role: UserRole;
  AvatarPath?: string | null;
  DrivingSchoolId?: number | null;
}

export class UserRepository {
  private static instance: UserRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new UserRepository();
    return this.instance;
  }

  private constructor() {}

  public getCount(unit: Unit): number {
    const result = unit
      .prepare<{ count: number }>("SELECT COUNT(*) AS count FROM User")
      .get();
    return result?.count ?? 0;
  }

  public getByEmail(unit: Unit, email: string): User | undefined {
    return unit
      .prepare<User>("SELECT * FROM User WHERE Email = ?")
      .get(email);
  }

  public getById(unit: Unit, userId: number): User | undefined {
    return unit
      .prepare<User>("SELECT * FROM User WHERE UserId = ?")
      .get(userId);
  }

  public create(unit: Unit, userName: string, email: string, passwordHash: string, role: UserRole): number {
    const result = unit
      .prepare("INSERT INTO User (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)")
      .run(userName, email, passwordHash, role);
    return result.lastInsertRowid as number;
  }

  public getAll(unit: Unit): User[] {
    return unit.prepare<User>("SELECT * FROM User").all();
  }

  public delete(unit: Unit, userId: number): boolean {
    const result = unit
      .prepare("DELETE FROM User WHERE UserId = ?")
      .run(userId);
    return result.changes > 0;
  }

  public update(unit: Unit, userId: number, userName: string, email: string): boolean {
    const result = unit
      .prepare("UPDATE User SET UserName = ?, Email = ? WHERE UserId = ?")
      .run(userName, email, userId);
    return result.changes > 0;
  }

  public linkDrivingSchool(unit: Unit, userId: number, drivingSchoolId: number): boolean {
    const result = unit
      .prepare("UPDATE User SET DrivingSchoolId = ? WHERE UserId = ?")
      .run(drivingSchoolId, userId);
    return result.changes > 0;
  }

  public updateAvatarPath(unit: Unit, userId: number, avatarPath: string | null): boolean {
    const result = unit
      .prepare("UPDATE User SET AvatarPath = ? WHERE UserId = ?")
      .run(avatarPath, userId);
    return result.changes > 0;
  }

  public updatePassword(unit: Unit, userId: number, passwordHash: string): boolean {
    const result = unit
      .prepare("UPDATE User SET PasswordHash = ? WHERE UserId = ?")
      .run(passwordHash, userId);
    return result.changes > 0;
  }
}

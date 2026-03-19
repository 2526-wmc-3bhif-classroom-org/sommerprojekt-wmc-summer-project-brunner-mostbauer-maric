import { Unit } from "../unit.js";
import type { User } from "../models/types.js";

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

  public create(unit: Unit, userName: string, email: string, passwordHash: string, role: string): number {
    const result = unit
      .prepare("INSERT INTO User (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)")
      .run(userName, email, passwordHash, role);
    return result.lastInsertRowid as number;
  }
}

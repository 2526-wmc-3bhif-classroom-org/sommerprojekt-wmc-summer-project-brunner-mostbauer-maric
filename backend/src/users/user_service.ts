import { UserRepository } from "./user_repository.js";
import type { User } from "./user_repository.js";
import { Unit } from "../unit.js";

export class UserService {
  private static instance: UserService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new UserService(UserRepository.Instance);
    return this.instance;
  }

  private constructor(private userRepo: UserRepository) {}

  public getUserCount(): number {
    const unit = Unit.createReadonly();
    try {
      return this.userRepo.getCount(unit);
    } finally {
      unit.complete();
    }
  }

  public getAllUsers(): User[] {
    const unit = Unit.createReadonly();
    try {
      return this.userRepo.getAll(unit);
    } finally {
      unit.complete();
    }
  }

  public deleteUser(userId: number): boolean {
    const unit = new Unit(false);
    let success = false;
    try {
      success = this.userRepo.delete(unit, userId);
      return success;
    } finally {
      unit.complete(success);
    }
  }
}

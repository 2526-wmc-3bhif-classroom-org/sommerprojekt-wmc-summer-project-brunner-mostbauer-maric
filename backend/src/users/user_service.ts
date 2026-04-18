import { UserRepository } from "./user_repository.js";
import type { User } from "./user_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "../models/types.js";

export interface ServiceResult<T = any> {
  status: number;
  data?: T;
  error?: { message: string };
}

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

  public deleteUser(userId: number): ServiceResult {
    if (isNaN(userId)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid user ID" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const deleted = this.userRepo.delete(unit, userId);
      if (deleted) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "User deleted successfully" },
        };
      } else {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "User not found" },
        };
      }
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete(success);
    }
  }

  public updateUser(
    userId: number,
    userName: string,
    email: string,
    requestUserId: number,
    requestUserRole: UserRole
  ): ServiceResult {
    if (isNaN(userId)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid user ID" },
      };
    }

    if (!userName || !email) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Username and email are required" },
      };
    }

    if (requestUserId !== userId && requestUserRole !== UserRole.ADMIN) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You are not authorized to update this account" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.userRepo.update(unit, userId, userName, email);
      if (updated) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "User updated successfully" },
        };
      } else {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "User not found" },
        };
      }
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete(success);
    }
  }
}

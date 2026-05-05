import { UserRepository } from "./user_repository.js";
import type { User } from "./user_repository.js";
import { ProgramRepository } from "../programs/program_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "../models/types.js";
import bcrypt from "bcrypt";

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

  public updateUserAvatar(
    userId: number,
    avatarPath: string | null,
    requestUserId: number,
    requestUserRole: UserRole
  ): ServiceResult {
    if (isNaN(userId)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid user ID" },
      };
    }

    if (requestUserId !== userId && requestUserRole !== UserRole.ADMIN) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You are not authorized to update this user's avatar" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.userRepo.updateAvatarPath(unit, userId, avatarPath);
      if (updated) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "Avatar uploaded successfully", avatarPath },
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

  public changePassword(
    userId: number,
    newPassword?: string,
    currentPassword?: string,
    requestUserId?: number,
    requestUserRole?: UserRole
  ): ServiceResult {
    if (isNaN(userId)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid user ID" },
      };
    }

    if (!newPassword) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "New password is required" },
      };
    }

    if (requestUserId !== userId && requestUserRole !== UserRole.ADMIN) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You are not authorized to change this password" },
      };
    }

    if (requestUserRole !== UserRole.ADMIN && requestUserId === userId) {
      if (!currentPassword) {
        return {
          status: StatusCodes.BAD_REQUEST,
          error: { message: "Current password is required" },
        };
      }
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const user = this.userRepo.getById(unit, userId);
      if (!user) {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "User not found" },
        };
      }

      if (requestUserRole !== UserRole.ADMIN) {
        if (!bcrypt.compareSync(currentPassword!, user.PasswordHash)) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            error: { message: "Incorrect current password" },
          };
        }
      }

      const passwordHash = bcrypt.hashSync(newPassword, 10);
      const updated = this.userRepo.updatePassword(unit, userId, passwordHash);

      if (updated) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "Password updated successfully" },
        };
      } else {
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: { message: "Failed to update password" },
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

  public getUserEnrollments(userId: number, requestUserId: number, requestUserRole: UserRole): ServiceResult {
    if (isNaN(userId)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Invalid user ID" },
      };
    }

    if (requestUserId !== userId && requestUserRole !== UserRole.ADMIN) {
      return {
        status: StatusCodes.FORBIDDEN,
        error: { message: "You are not authorized to view these enrollments" },
      };
    }

    const unit = Unit.createReadonly();
    try {
      const enrollments = ProgramRepository.getEnrollmentsByUser(unit, userId);
      return {
        status: StatusCodes.OK,
        data: enrollments
      };
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete();
    }
  }
}

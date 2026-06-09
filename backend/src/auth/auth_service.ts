import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Unit } from "../unit.js";
import { UserRole } from "../models/types.js";
import { UserRepository } from "../users/user_repository.js";
import { SchoolRepository } from "../schools/school_repository.js";
import { SECRET_KEY } from "../middleware/auth_handlers.js";

export class AuthService {
  private static instance: AuthService | null = null;
  private repo = UserRepository.Instance;
  private schoolRepo = SchoolRepository.Instance;

  public static get Instance() {
    if (this.instance === null) this.instance = new AuthService();
    return this.instance;
  }

  private constructor() {}

  public async login(email: string, password: string) {
    const unit = Unit.createReadonly();
    try {
      const user = this.repo.getByEmail(unit, email);
      if (!user) {
        return { 
          status: StatusCodes.UNAUTHORIZED, 
          error: { message: "User does not exist" } 
        };
      }

      if (!bcrypt.compareSync(password, user.PasswordHash)) {
        return { 
          status: StatusCodes.UNAUTHORIZED, 
          error: { message: "Wrong password" } 
        };
      }

      const userClaims = {
        UserId: user.UserId,
        UserName: user.UserName,
        Email: user.Email,
        Role: user.Role,
        IsSchool: user.Role === UserRole.SCHOOL,
        AvatarPath: user.AvatarPath,
        DrivingSchoolId: user.DrivingSchoolId ?? null,
        HasSkipped: user.HasSkipped === 1,
        Location: user.Location ?? null,
        Latitude: user.Latitude ?? null,
        Longitude: user.Longitude ?? null
      };

      const token = jwt.sign({ user: userClaims }, SECRET_KEY, { expiresIn: "30m" });
      const decoded = jwt.decode(token) as { exp: number };
      const expires = new Date(decoded.exp * 1000);

      return {
        status: StatusCodes.OK,
        data: {
          user: userClaims,
          expiresAt: expires,
          message: "Login successful",
          accessToken: token
        }
      };
    } finally {
      unit.complete();
    }
  }

  public async register(
    userName: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
    isSchool: boolean = false,
    schoolData?: { location?: string; owner?: string; phone?: string; website?: string; latitude?: number; longitude?: number },
    location?: string,
    latitude?: number,
    longitude?: number
  ) {
    const unit = new Unit(false);
    let success = false;
    try {
      const existingUser = this.repo.getByEmail(unit, email);
      if (existingUser) {
        success = false;
        return {
          status: StatusCodes.CONFLICT,
          error: { message: "User already exists" }
        };
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const finalRole = isSchool ? UserRole.SCHOOL : role;
      const userId = this.repo.create(unit, userName, email, passwordHash, finalRole, location, latitude, longitude);

      let drivingSchoolId: number | null = null;
      if (finalRole === UserRole.SCHOOL) {
        drivingSchoolId = this.schoolRepo.create(
          unit,
          userName,
          schoolData?.location || location,
          schoolData?.owner,
          email,
          schoolData?.website,
          schoolData?.phone,
          schoolData?.latitude ?? latitude,
          schoolData?.longitude ?? longitude
        );
        this.repo.linkDrivingSchool(unit, userId, drivingSchoolId);
      }

      success = true;
      return {
        status: StatusCodes.CREATED,
        data: {
          UserId: userId,
          UserName: userName,
          Email: email,
          Role: finalRole,
          IsSchool: finalRole === UserRole.SCHOOL,
          DrivingSchoolId: drivingSchoolId,
          Location: location ?? null,
          Latitude: latitude ?? null,
          Longitude: longitude ?? null
        }
      };
    } catch (e: any) {
      success = false;
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message }
      };
    } finally {
      unit.complete(success);
    }
  }
}

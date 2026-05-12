import { KmLogRepository } from "./km_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";
import type { KmLog } from "../models/types.js";

export interface ServiceResult<T = any> {
  status: number;
  data?: T;
  error?: { message: string };
}

export class KmLogService {
  private static instance: KmLogService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new KmLogService(KmLogRepository.Instance);
    return this.instance;
  }

  private constructor(private kmRepo: KmLogRepository) {}

  public getKmLogsForUser(userId: number): ServiceResult<KmLog[]> {
    const unit = Unit.createReadonly();
    try {
      const logs = this.kmRepo.getByUserId(unit, userId);
      return {
        status: StatusCodes.OK,
        data: logs,
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

  public addKmLog(
    userId: number,
    startKm: number,
    endKm: number,
    startLocation: string,
    endLocation: string,
    conditions: string | null
  ): ServiceResult {
    if (startKm < 0 || endKm < 0 || endKm < startKm) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "End KM muss größer als Start KM sein" },
      };
    }

    if (!startLocation || !endLocation || !conditions || !conditions.trim()) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Alle Felder müssen ausgefüllt werden" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const logId = this.kmRepo.create(
        unit,
        userId,
        startKm,
        endKm,
        startLocation,
        endLocation,
        conditions
      );
      success = true;
      return {
        status: StatusCodes.CREATED,
        data: { KmLogId: logId, message: "KM entry saved successfully" },
      };
    } catch (e: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { message: e.message },
      };
    } finally {
      unit.complete(success);
    }
  }

  public deleteKmLog(kmLogId: number, userId: number): ServiceResult {
    const unit = new Unit(false);
    let success = false;
    try {
      const deleted = this.kmRepo.delete(unit, kmLogId, userId);
      if (deleted) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "KM entry deleted successfully" },
        };
      } else {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "KM entry not found or unauthorized" },
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

  public updateKmLog(
    kmLogId: number,
    userId: number,
    startKm: number,
    endKm: number,
    startLocation: string,
    endLocation: string,
    conditions: string | null
  ): ServiceResult {
    if (startKm < 0 || endKm < 0 || endKm < startKm) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "End KM muss größer als Start KM sein" },
      };
    }

    if (!startLocation || !endLocation || !conditions || !conditions.trim()) {
      return {
        status: StatusCodes.BAD_REQUEST,
        error: { message: "Alle Felder müssen ausgefüllt werden" },
      };
    }

    const unit = new Unit(false);
    let success = false;
    try {
      const updated = this.kmRepo.update(
        unit,
        kmLogId,
        userId,
        startKm,
        endKm,
        startLocation,
        endLocation,
        conditions
      );
      if (updated) {
        success = true;
        return {
          status: StatusCodes.OK,
          data: { message: "KM entry updated successfully" },
        };
      } else {
        return {
          status: StatusCodes.NOT_FOUND,
          error: { message: "KM entry not found or unauthorized" },
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

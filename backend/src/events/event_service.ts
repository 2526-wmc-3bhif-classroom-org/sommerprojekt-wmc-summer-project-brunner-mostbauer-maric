import { EventRepository } from "./event_repository.js";
import { Unit } from "../unit.js";
import { StatusCodes } from "http-status-codes";

export interface ServiceResult<T = any> {
  status: number;
  data?: T;
  error?: { message: string };
}

export class EventService {
  private static instance: EventService | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new EventService(EventRepository.Instance);
    return this.instance;
  }

  private constructor(private eventRepo: EventRepository) {}

  public getEventsForUser(userId: number): ServiceResult {
    const unit = Unit.createReadonly();
    try {
      const events = this.eventRepo.getByUserId(unit, userId);
      return { status: StatusCodes.OK, data: events };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete();
    }
  }

  public addEvent(userId: number, type: string, date: string): ServiceResult {
    if (!type || !type.trim()) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Type darf nicht leer sein" } };
    }
    if (!date || !date.trim()) {
      return { status: StatusCodes.BAD_REQUEST, error: { message: "Date darf nicht leer sein" } };
    }
    const unit = new Unit(false);
    let success = false;
    try {
      const eventId = this.eventRepo.create(unit, userId, type.trim(), date.trim());
      success = true;
      return { status: StatusCodes.CREATED, data: { EventId: eventId, message: "Event gespeichert" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }

  public deleteEvent(eventId: number, userId: number): ServiceResult {
    const unit = new Unit(false);
    let success = false;
    try {
      const deleted = this.eventRepo.delete(unit, eventId, userId);
      if (deleted) {
        success = true;
        return { status: StatusCodes.OK, data: { message: "Event gelöscht" } };
      }
      return { status: StatusCodes.NOT_FOUND, error: { message: "Event nicht gefunden" } };
    } catch (e: any) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, error: { message: e.message } };
    } finally {
      unit.complete(success);
    }
  }
}

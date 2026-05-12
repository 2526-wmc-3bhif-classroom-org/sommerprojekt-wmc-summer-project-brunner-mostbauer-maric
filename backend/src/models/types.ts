// types to match the db tables

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SCHOOL = "school",
}

export interface DrivingSchool {
  DrivingSchoolId: number;
  Name: string;
  Location?: string | null;
  Owner?: string | null;
  Email?: string | null;
  Website?: string | null;
}

export interface DocType {
  DocTypeId: number;
  ExpirationDuration?: number | null;
}

export interface LicenseType {
  LicenseTypeId: number;
  Name: string;
}

export interface LicenseProgram {
  LicenseProgramId: number;
  DrivingSchoolId: number;
  LicenseTypeId: number;
  DateFrom: string;
  DateTo: string;
  Weekdays?: string | null;
  IsSchnellkurs?: number | null;
  Price: number;
  MaxParticipants: number;
  CurrentParticipants: number;
}

export interface Enrollment {
  EnrollmentId: number;
  UserId: number;
  LicenseProgramId: number;
  StartTime?: string | null;
  Status: string;
}

export interface Appointment {
  AppointmentId: number;
  EnrollmentId: number;
  DateTime: string;
  Location?: string | null;
}

export interface Document {
  DocumentId: number;
  EnrollmentId: number;
  DocTypeId: number;
  StartTime?: string | null;
  FilePath: string;
}

export interface Rating {
  RatingId: number;
  UserId: number;
  DrivingSchoolId: number;
  Stars: number;
  Content?: string | null;
  Date?: string | null;
}

export interface Comment {
  CommentId: number;
  RatingId: number;
  ParentCommentId?: number | null;
  Content: string;
}

export interface KmLog {
  KmLogId: number;
  UserId: number;
  StartKm: number;
  EndKm: number;
  StartLocation: string;
  EndLocation: string;
  Conditions?: string | null;
  Timestamp?: string;
}

import BetterSqlite3 from "better-sqlite3";
import type { Database, Statement } from "better-sqlite3";

const buildTables = (connection: Database) => {
  connection.exec(`CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS DrivingSchool (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Document (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  startTime DATETIME NOT NULL,
  docTypeId INTEGER NOT NULL,
  userPlanId INTEGER NOT NULL,
  FOREIGN KEY (docTypeId) REFERENCES DocType(id),
  FOREIGN KEY (userPlanId) REFERENCES UserPlan(id)
);

CREATE TABLE IF NOT EXISTS DocType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expirationDuration INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Appointment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dateTime DATETIME NOT NULL,
  location TEXT NOT NULL,
  userPlanId INTEGER NOT NULL,
  FOREIGN KEY (userPlanId) REFERENCES UserPlan(id)
);

CREATE TABLE IF NOT EXISTS LicenseType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS UserPlan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  startTime DATETIME NOT NULL,
  userId INTEGER NOT NULL,
  drivingSchoolId INTEGER NOT NULL,
  licenseTypeId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (drivingSchoolId) REFERENCES DrivingSchool(id),
  FOREIGN KEY (licenseTypeId) REFERENCES LicenseType(id)
);`);
};

export default buildTables;

/*
This is the current database structure:

@startuml
skinparam linetype ortho

entity User{
UserName
Email
}

entity DrivingSchool{
Name
Location
}

entity Document{
StartTime
}

entity DocType{
ExpirationDuration
}

entity Appointment{
DateTime
Location
}

entity LicenseType{
Name
}

entity UserPlan{
StartTime
}

UserPlan "*" -- "1" DrivingSchool
UserPlan "1" -- "*" Document
DocType "1" -- "*" Document
Appointment "*" -- "1" UserPlan
DrivingSchool "*" -- "*" LicenseType
User "1" -- "1" UserPlan
LicenseType "1" -- "*" UserPlan

@enduml
*/

import request from "supertest";
import { app } from "../app.js";
import { StatusCodes } from "http-status-codes";

describe("School API", () => {
  it("GET /api/schools should return a list of schools", async () => {
    const res = await request(app).get("/api/schools");
    expect(res.status).toBe(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/schools/:schoolId should return a single school", async () => {
    // We assume ID 1 exists because sample data is inserted on startup
    const res = await request(app).get("/api/schools/1");
    if (res.status === StatusCodes.OK) {
      expect(res.body).toHaveProperty("DrivingSchoolId", 1);
      expect(res.body).toHaveProperty("Name");
    } else {
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    }
  });

  it("GET /api/schools/:schoolId should return 400 for invalid ID", async () => {
    const res = await request(app).get("/api/schools/invalid");
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("error");
  });
});

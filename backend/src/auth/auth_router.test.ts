import request from "supertest";
import { app } from "../app.js";
import { StatusCodes } from "http-status-codes";

describe("Authentication & Protected Routes", () => {
  let accessToken: string;

  it("POST /api/auth/login should log in the admin user and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@admin.com",
      password: "admin",
    });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user).toHaveProperty("Email", "admin@admin.com");
    expect(res.body.user).toHaveProperty("Role", "admin");

    accessToken = res.body.accessToken;
  });

  it("GET /api/schools should be accessible with a valid token", async () => {
    const res = await request(app)
      .get("/api/schools")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/schools should return 401 with an invalid token", async () => {
    const res = await request(app)
      .get("/api/schools")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/login should return 401 for wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@admin.com",
      password: "wrong-password",
    });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error).toHaveProperty("message", "Wrong password");
  });
});

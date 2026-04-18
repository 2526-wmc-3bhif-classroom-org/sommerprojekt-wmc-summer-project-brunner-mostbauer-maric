import express from "express";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unit, ensureSampleDataInserted } from "./unit.js";
import { schoolRouter } from "./schools/school_router.js";
import { userRouter } from "./users/user_router.js";
import { authRouter } from "./auth/auth_router.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Driving School API",
      version: "1.0.0",
      description: "API for managing driving schools and enrollments",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const PORT = 3000;
const app = express();
export { app };

app.use(cors());
app.use(express.json());

app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Invalid JSON provided" } });
    return;
  }
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== "test") {
  try {
    const unit = new Unit(false);
    const result = ensureSampleDataInserted(unit);
    unit.complete(true);
    console.log(`Sample data status: ${result}`);
  } catch (err) {
    console.error("Failed to ensure sample data:", err);
  }
} else {
  try {
    const unit = new Unit(false);
    ensureSampleDataInserted(unit);
    unit.complete(true);
  } catch (err: any) {
    console.error("Test mode initialization error:", err.message);
  }
}

app.use("/api/schools", schoolRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Backend running on: http://localhost:" + PORT);
  });
}

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
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const PORT = 3000;
const app = express();
export { app };

app.use(cors());
app.use(express.json());

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
}

app.use("/api/schools", schoolRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
  });
}

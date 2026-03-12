import express from "express";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unit, ensureSampleDataInserted } from "./unit.js";

const PORT = 3000;
const app = express();

app.use(express.json());

try {
  const unit = new Unit(false);
  const result = ensureSampleDataInserted(unit);
  unit.complete(true);
  console.log(`Sample data status: ${result}`);
} catch (err) {
  console.error("Failed to ensure sample data:", err);
}

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

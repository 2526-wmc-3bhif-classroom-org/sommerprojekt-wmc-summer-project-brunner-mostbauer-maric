import express from "express";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

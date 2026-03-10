import express from "express";
import { StatusCodes } from "http-status-codes";
// import { User } from "./user_repository";
// import { AirportService } from "../services/airport_service";

export const userRouter = express.Router();
// const userService: UserService = UserService.Instance;

userRouter.get("/", (req, res) => {
  try {
    // const users: User[] = userService.getAllUsers();
    // res.status(StatusCodes.OK).json(users);
    throw new Error("Not implemented");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: (error as Error).message } });
  }
});

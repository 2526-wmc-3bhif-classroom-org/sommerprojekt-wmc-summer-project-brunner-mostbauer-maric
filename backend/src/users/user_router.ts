import express from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user_service.js";

export const userRouter = express.Router();
const userService: UserService = UserService.Instance;

/**
 * @swagger
 * /api/users/count:
 *   get:
 *     summary: Retrieve the total number of users
 *     responses:
 *       200:
 *         description: The total number of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
userRouter.get("/count", (req, res) => {
  try {
    const count = userService.getUserCount();
    res.status(StatusCodes.OK).json({ count });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

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

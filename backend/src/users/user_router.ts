import express from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user_service.js";

import { isAuthenticated } from "../middleware/auth_handlers.js";

export const userRouter = express.Router();
const userService: UserService = UserService.Instance;

/**
 * @swagger
 * /api/users/count:
 *   get:
 *     summary: Retrieve the total number of users
 *     security: []
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *       400:
 *         description: Bad request
 */
userRouter.get("/", isAuthenticated, (req, res) => {
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

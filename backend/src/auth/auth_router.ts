import express from "express";
import { AuthService } from "./auth_service.js";

export const authRouter = express.Router();
const authService = AuthService.Instance;

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: { message: "Email and password are required" } });
    return;
  }

  const result = await authService.login(email, password);
  if (result.error) {
    res.status(result.status).json({ error: result.error });
  } else {
    res.status(result.status).json(result.data);
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
authRouter.post("/register", async (req, res) => {
  const { userName, email, password, role } = req.body;
  if (!userName || !email || !password) {
    res.status(400).json({ error: { message: "Username, email and password are required" } });
    return;
  }

  const result = await authService.register(userName, email, password, role);
  if (result.error) {
    res.status(result.status).json({ error: result.error });
  } else {
    res.status(result.status).json({ data: result.data });
  }
});

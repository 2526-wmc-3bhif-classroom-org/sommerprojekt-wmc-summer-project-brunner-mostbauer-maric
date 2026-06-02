import express from "express";
import { StatusCodes } from "http-status-codes";
import { TaskService } from "./task_service.js";
import { isAuthenticated } from "../middleware/auth_handlers.js";
import type { AuthRequest } from "../middleware/auth_handlers.js";

export const taskRouter = express.Router();
const taskService: TaskService = TaskService.Instance;

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
taskRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const result = taskService.getTasksForUser(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Task text/description
 *               isDefault:
 *                 type: boolean
 *                 description: Whether this is a default task template
 *     responses:
 *       201:
 *         description: Task created successfully. Returns the full Task object with all fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TaskId:
 *                   type: integer
 *                 UserId:
 *                   type: integer
 *                 Text:
 *                   type: string
 *                 Done:
 *                   type: integer
 *                   description: 0 = not done, 1 = done
 *                 IsDefault:
 *                   type: integer
 *                   description: 0 = user task, 1 = default task
 *       400:
 *         description: Invalid input (missing text)
 *       401:
 *         description: Unauthorized
 */
taskRouter.post("/", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const { text, isDefault } = req.body;
    const result = taskService.addTask(userId, text, !!isDefault);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/tasks/{id}/done:
 *   put:
 *     summary: Update task done status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - done
 *             properties:
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
taskRouter.put("/:id/done", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const taskId = parseInt(req.params.id);
    const { done } = req.body;
    const result = taskService.updateDone(taskId, userId, !!done);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/tasks/{id}/text:
 *   put:
 *     summary: Update task text (only for user-created tasks, not default tasks)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task text updated
 *       400:
 *         description: Invalid input (missing/empty text)
 *       404:
 *         description: Task not found or is a default task (cannot edit)
 *       401:
 *         description: Unauthorized
 */
taskRouter.put("/:id/text", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const taskId = parseInt(req.params.id);
    const { text } = req.body;
    const result = taskService.updateText(taskId, userId, text);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
taskRouter.delete("/:id", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const taskId = parseInt(req.params.id);
    const result = taskService.deleteTask(taskId, userId);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

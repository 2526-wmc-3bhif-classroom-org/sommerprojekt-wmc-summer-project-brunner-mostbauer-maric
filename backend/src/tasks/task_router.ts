import express from "express";
import { StatusCodes } from "http-status-codes";
import { TaskService } from "./task_service.js";
import { isAuthenticated } from "../middleware/auth_handlers.js";
import type { AuthRequest } from "../middleware/auth_handlers.js";

export const taskRouter = express.Router();
const taskService: TaskService = TaskService.Instance;

taskRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const result = taskService.getTasksForUser(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

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

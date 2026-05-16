import express from "express";
import { StatusCodes } from "http-status-codes";
import { EventService } from "./event_service.js";
import { isAuthenticated } from "../middleware/auth_handlers.js";
import type { AuthRequest } from "../middleware/auth_handlers.js";

export const eventRouter = express.Router();
const eventService: EventService = EventService.Instance;

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events for the logged-in user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
 *       401:
 *         description: Unauthorized
 */
eventRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const result = eventService.getEventsForUser(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Add a new event for the logged-in user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
eventRouter.post("/", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const { type, date } = req.body;
    const result = eventService.addEvent(userId, type, date);
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
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
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
 *         description: Event deleted
 *       404:
 *         description: Event not found
 *       401:
 *         description: Unauthorized
 */
eventRouter.delete("/:id", isAuthenticated, (req, res) => {
  try {
    const userId = (req as AuthRequest).payload?.user.UserId || 0;
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Invalid event ID" } });
      return;
    }
    const result = eventService.deleteEvent(eventId, userId);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

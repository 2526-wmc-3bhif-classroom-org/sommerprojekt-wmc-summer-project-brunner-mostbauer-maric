import express from "express";
import { StatusCodes } from "http-status-codes";
import { KmLogService } from "./km_service.js";
import { isAuthenticated } from "../middleware/auth_handlers.js";
import type { AuthRequest } from "../middleware/auth_handlers.js";

export const kmLogRouter = express.Router();
const kmLogService: KmLogService = KmLogService.Instance;

/**
 * @swagger
 * components:
 *   schemas:
 *     KmLog:
 *       type: object
 *       properties:
 *         KmLogId:
 *           type: integer
 *         UserId:
 *           type: integer
 *         StartKm:
 *           type: number
 *         EndKm:
 *           type: number
 *         StartLocation:
 *           type: string
 *         EndLocation:
 *           type: string
 *         Conditions:
 *           type: string
 *           nullable: true
 *         Timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/kmlog:
 *   get:
 *     summary: Retrieve KM logs for the authenticated user
 *     tags: [KM Log]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of KM logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KmLog'
 */
kmLogRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.payload?.user.UserId || 0;
    const result = kmLogService.getKmLogsForUser(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/kmlog:
 *   post:
 *     summary: Create a new KM log entry
 *     tags: [KM Log]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [startKm, endKm, startLocation, endLocation, conditions]
 *             properties:
 *               startKm:
 *                 type: number
 *                 description: Initial odometer reading
 *               endKm:
 *                 type: number
 *                 description: Final odometer reading
 *               startLocation:
 *                 type: string
 *               endLocation:
 *                 type: string
 *               conditions:
 *                 type: string
 *                 description: Mandatory driving conditions (e.g., Rain, Night)
 *     responses:
 *       201:
 *         description: KM entry saved successfully
 *       400:
 *         description: Invalid input (e.g., missing fields or invalid KM values)
 *       401:
 *         description: Unauthorized
 */
kmLogRouter.post("/", isAuthenticated, (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.payload?.user.UserId || 0;
    const { startKm, endKm, startLocation, endLocation, conditions } = req.body;
    
    const result = kmLogService.addKmLog(
      userId,
      parseFloat(startKm),
      parseFloat(endKm),
      startLocation,
      endLocation,
      conditions
    );

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/kmlog/{id}:
 *   put:
 *     summary: Update a KM log entry
 *     tags: [KM Log]
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
 *             required: [startKm, endKm, startLocation, endLocation, conditions]
 *             properties:
 *               startKm:
 *                 type: number
 *               endKm:
 *                 type: number
 *               startLocation:
 *                 type: string
 *               endLocation:
 *                 type: string
 *               conditions:
 *                 type: string
 *     responses:
 *       200:
 *         description: KM entry updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: KM entry not found
 */
kmLogRouter.put("/:id", isAuthenticated, (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.payload?.user.UserId || 0;
    const kmLogId = parseInt(req.params.id);
    const { startKm, endKm, startLocation, endLocation, conditions } = req.body;

    const result = kmLogService.updateKmLog(
      kmLogId,
      userId,
      parseFloat(startKm),
      parseFloat(endKm),
      startLocation,
      endLocation,
      conditions
    );

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/kmlog/{id}:
 *   delete:
 *     summary: Delete a KM log entry
 *     tags: [KM Log]
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
 *         description: KM entry deleted successfully
 *       404:
 *         description: KM entry not found
 */
kmLogRouter.delete("/:id", isAuthenticated, (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.payload?.user.UserId || 0;
    const kmLogId = parseInt(req.params.id);
    
    const result = kmLogService.deleteKmLog(kmLogId, userId);
    
    if (result.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

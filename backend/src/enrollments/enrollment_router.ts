import express from "express";
import { StatusCodes } from "http-status-codes";
import { EnrollmentService } from "./enrollment_service.js";
import { isAuthenticated } from "../middleware/auth_handlers.js";

export const enrollmentRouter = express.Router();
const enrollmentService: EnrollmentService = EnrollmentService.Instance;

/**
 * @swagger
 * /api/enrollments/{id}/appointments:
 *   get:
 *     summary: Get all appointments for an enrollment
 *     tags: [Enrollments]
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
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   AppointmentId:
 *                     type: integer
 *                   EnrollmentId:
 *                     type: integer
 *                   DateTime:
 *                     type: string
 *                     format: date-time
 *                   Location:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
enrollmentRouter.get("/:id/appointments", isAuthenticated, (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);
    if (isNaN(enrollmentId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Invalid enrollment ID" } });
      return;
    }
    const result = enrollmentService.getAppointmentsForEnrollment(enrollmentId);
    res.status(result.status).json(result.error ? { error: result.error } : { data: result.data });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: (error as Error).message } });
  }
});

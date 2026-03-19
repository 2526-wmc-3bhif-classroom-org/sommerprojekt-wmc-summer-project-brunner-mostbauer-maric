import express from "express";
import { StatusCodes } from "http-status-codes";
import { SchoolService } from "./school_service.js";
import { isAuthenticated, isAdmin } from "../middleware/auth_handlers.js";

export const schoolRouter = express.Router();
const schoolService: SchoolService = SchoolService.Instance;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DrivingSchool:
 *       type: object
 *       properties:
 *         DrivingSchoolId:
 *           type: integer
 *         Name:
 *           type: string
 *         Location:
 *           type: string
 *           nullable: true
 *         Owner:
 *           type: string
 *           nullable: true
 *         Email:
 *           type: string
 *           nullable: true
 *         Website:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Retrieve a list of driving schools
 *     responses:
 *       200:
 *         description: A list of driving schools.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DrivingSchool'
 */
schoolRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const schools = schoolService.getAllSchools();
    res.status(StatusCodes.OK).json(schools);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/schools/count:
 *   get:
 *     summary: Retrieve the total number of driving schools
 *     responses:
 *       200:
 *         description: The total number of driving schools.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
schoolRouter.get("/count", (req, res) => {
  try {
    const count = schoolService.getSchoolCount();
    res.status(StatusCodes.OK).json({ count });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

/**
 * @swagger
 * /api/schools/{schoolId}:
 *   get:
 *     summary: Retrieve a single driving school
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the school to retrieve
 *     responses:
 *       200:
 *         description: A single driving school.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrivingSchool'
 *       404:
 *         description: School not found
 *       400:
 *         description: Invalid schoolId
 */
schoolRouter.get("/:schoolId", (req, res) => {
  try {
    const id = parseInt(req.params.schoolId);
    if (isNaN(id)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: { message: "Invalid schoolId" } });
      return;
    }
    const school = schoolService.getSchoolById(id);
    if (school) {
      res.status(StatusCodes.OK).json(school);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: { message: "School not found" } });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

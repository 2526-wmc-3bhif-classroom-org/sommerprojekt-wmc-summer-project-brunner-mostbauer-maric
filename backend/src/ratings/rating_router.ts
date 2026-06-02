import { Router } from "express";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RatingService } from "./rating_service.js";
import { isAuthenticated, type AuthRequest } from "../middleware/auth_handlers.js";

const ratingRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rating management
 */

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     summary: Returns all ratings
 *     tags: [Ratings]
 *     responses:
 *       200:
 *         description: List of ratings
 */
ratingRouter.get("/", (req, res: Response) => {
  res.json(RatingService.Instance.getAllRatings());
});

/**
 * @swagger
 * /api/ratings/school/{id}:
 *   get:
 *     summary: Returns all ratings for a specific school
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The school ID
 *     responses:
 *       200:
 *         description: List of ratings for the school
 */
ratingRouter.get("/school/:id", (req, res: Response) => {
  const schoolId = parseInt(req.params.id);
  res.json(RatingService.Instance.getRatingsBySchool(schoolId));
});

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a new rating for a school
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - stars
 *             properties:
 *               schoolId:
 *                 type: integer
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Bad request or rating already exists
 */
ratingRouter.post("/", isAuthenticated, (req: AuthRequest, res: Response) => {
  const userId = req.payload?.user.UserId;
  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: "User ID not found" } });
    return;
  }
  const { schoolId, stars } = req.body;
  try {
    RatingService.Instance.createRating(userId, schoolId, stars);
    res.status(StatusCodes.CREATED).json({ message: "Rating created" });
  } catch (err: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message: err.message } });
  }
});

/**
 * @swagger
 * /api/ratings:
 *   patch:
 *     summary: Update an existing rating's stars
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - stars
 *             properties:
 *               schoolId:
 *                 type: integer
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Rating not found or invalid data
 */
ratingRouter.patch("/", isAuthenticated, (req: AuthRequest, res: Response) => {
  const userId = req.payload?.user.UserId;
  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: "User ID not found" } });
    return;
  }
  const { schoolId, stars } = req.body;
  try {
    RatingService.Instance.updateRating(userId, schoolId, stars);
    res.status(StatusCodes.OK).json({ message: "Rating updated" });
  } catch (err: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message: err.message } });
  }
});

/**
 * @swagger
 * /api/ratings/{schoolId}:
 *   delete:
 *     summary: Delete your rating for a school
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 */
ratingRouter.delete("/:schoolId", isAuthenticated, (req: AuthRequest, res: Response) => {
  const userId = req.payload?.user.UserId;
  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: "User ID not found" } });
    return;
  }
  const schoolId = parseInt(req.params.schoolId);
  try {
    RatingService.Instance.deleteRating(userId, schoolId);
    res.status(StatusCodes.OK).json({ message: "Rating deleted" });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: err.message } });
  }
});

export { ratingRouter };

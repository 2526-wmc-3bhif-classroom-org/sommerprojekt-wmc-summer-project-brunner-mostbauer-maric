import express from "express";
import { StatusCodes } from "http-status-codes";
import { SchoolService } from "./school_service.js";

export const schoolRouter = express.Router();
const schoolService: SchoolService = SchoolService.Instance;

schoolRouter.get("/", (req, res) => {
  try {
    const schools = schoolService.getAllSchools();
    res.status(StatusCodes.OK).json(schools);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { message: (error as Error).message } });
  }
});

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

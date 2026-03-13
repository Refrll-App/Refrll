import express from "express";
import {
  createApplication,
  getSeekerApplications,
  getReferrerApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { protect, requireReferrerMode } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createApplication);
router.get("/seeker", getSeekerApplications);
router.get("/referrer", requireReferrerMode, getReferrerApplications);
router.patch("/:id/status", requireReferrerMode, updateApplicationStatus);

export default router;

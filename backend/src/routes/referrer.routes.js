import express from "express";
import { getMyReferrerProfile, toggleAvailability, updatePrivacySettings } from "../controllers/referrer.controller.js";
import { protect, requireReferrerMode } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(requireReferrerMode);

router.get("/profile",          getMyReferrerProfile);
router.patch("/toggle-availability", toggleAvailability);
router.patch("/privacy",        updatePrivacySettings);

export default router;

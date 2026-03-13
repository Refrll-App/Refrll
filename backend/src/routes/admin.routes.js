import express from "express";
import { getAllUsers, getAllApplications, getStats } from "../controllers/admin.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get("/users", getAllUsers);
router.get("/applications", getAllApplications);
router.get("/stats", getStats);

export default router;



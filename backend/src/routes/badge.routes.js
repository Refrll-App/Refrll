import express from "express";
import { getBadgeData, getBadgePage } from "../controllers/badge.controller.js";

const router = express.Router();

// Public — no auth
router.get("/:userId",      getBadgePage); // HTML page with OG tags (LinkedIn scrapes this)
router.get("/:userId/data", getBadgeData); // JSON for frontend

export default router;


import express from "express";
import { getMe, updateProfile, switchRoleMode } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);
router.get("/me", getMe);
router.patch("/profile", upload.single("resume"), updateProfile);
router.patch("/role-mode", switchRoleMode);

export default router;
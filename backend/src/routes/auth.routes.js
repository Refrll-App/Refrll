import express from "express";
import {
  register, login, logout, refresh,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword,
} from "../controllers/auth.controller.js";
import { validate, registerSchema, loginSchema } from "../validators/schemas.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",            validate(registerSchema), register);
router.post("/login",               validate(loginSchema),    login);
router.post("/logout",              logout);
router.post("/refresh",             refresh);
router.get ("/verify-email",        verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password",     forgotPassword);
router.post("/reset-password",      resetPassword);

export default router;

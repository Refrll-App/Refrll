import User from "../models/User.model.js";
import EmailVerification from "../models/EmailVerification.model.js";
import PasswordReset from "../models/PasswordReset.model.js";
import {
  generateAccessToken, generateRefreshToken,
  setRefreshTokenCookie, clearRefreshTokenCookie,
  saveRefreshToken, validateRefreshTokenInDB, deleteRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendEmail, emails } from "../config/email.js";

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "This email is already registered. Please sign in." });

    const user = await User.create({ name, email, password });

    // Send verification email (non-blocking)
    const token = await EmailVerification.generate(user._id);
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    sendEmail({ to: email, subject: "Verify your Refrll account", html: emails.verifyEmail({ name, verifyUrl }) });

    // DO NOT log them in yet — force email verification
    res.status(201).json({
      message: "Account created! Please check your email to verify your account before signing in.",
    });
  } catch (err) { next(err); }
};

// ── Verify Email ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Verification token required" });

    const record = await EmailVerification.findOne({ token });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "This verification link has expired. Please request a new one." });
    }

    const user = await User.findByIdAndUpdate(record.userId, { isEmailVerified: true }, { new: true }).populate("currentCompanyId");
    await EmailVerification.deleteOne({ _id: record._id });

    // Auto-login after verification
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await saveRefreshToken(user._id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ message: "Email verified successfully!", accessToken, user });
  } catch (err) { next(err); }
};

// ── Resend Verification ───────────────────────────────────────────────────────
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email" });
    if (user.isEmailVerified) return res.status(400).json({ message: "This email is already verified" });

    const token = await EmailVerification.generate(user._id);
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail({ to: user.email, subject: "Verify your Refrll account", html: emails.verifyEmail({ name: user.name, verifyUrl }) });

    res.json({ message: "Verification email sent — check your inbox" });
  } catch (err) { next(err); }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
        unverified: true,
        email: user.email,
      });
    }

    const populated = await User.findById(user._id).populate("currentCompanyId");
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await saveRefreshToken(user._id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ accessToken, user: populated });
  } catch (err) { next(err); }
};

// ── Refresh ───────────────────────────────────────────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // Verify JWT signature first
    let decoded;
    try { decoded = verifyRefreshToken(token); }
    catch {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "Session expired. Please sign in again." });
    }

    // Check token exists in DB (not logged out)
    const dbToken = await validateRefreshTokenInDB(token);
    if (!dbToken) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "Session invalidated. Please sign in again." });
    }

    const user = await User.findById(decoded.userId).populate("currentCompanyId");
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "User not found" });
    }

    // Rotate — delete old, issue new
    await deleteRefreshToken(token);
    const newAccessToken  = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    await saveRefreshToken(user._id, newRefreshToken);
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken, user });
  } catch (err) {
    clearRefreshTokenCookie(res);
    next(err);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await deleteRefreshToken(token); // invalidate in DB
    clearRefreshTokenCookie(res);
    res.json({ message: "Logged out" });
  } catch (err) { next(err); }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: "If an account with that email exists, a reset link has been sent." });

    const token = await PasswordReset.generate(user._id);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail({ to: email, subject: "Reset your Refrll password", html: emails.forgotPassword({ name: user.name, resetUrl }) });

    res.json({ message: "If an account with that email exists, a reset link has been sent." });
  } catch (err) { next(err); }
};

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const record = await PasswordReset.findOne({ token });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "This reset link has expired. Please request a new one." });
    }

    const user = await User.findById(record.userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();
    await PasswordReset.deleteOne({ _id: record._id });

    // Invalidate all sessions for security
    const { deleteAllUserRefreshTokens } = await import("../utils/jwt.js");
    await deleteAllUserRefreshTokens(user._id);
    clearRefreshTokenCookie(res);

    res.json({ message: "Password reset successfully. Please sign in with your new password." });
  } catch (err) { next(err); }
};

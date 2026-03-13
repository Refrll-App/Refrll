import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.model.js";

export const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d",
  });

export const verifyAccessToken  = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// Store refresh token in DB so we can invalidate on logout
export const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await RefreshToken.create({ userId, token, expiresAt });
};

// Validate token exists in DB (not invalidated by logout)
export const validateRefreshTokenInDB = async (token) => {
  return await RefreshToken.findOne({ token });
};

// Delete on logout or rotation
export const deleteRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

// Delete ALL sessions for a user (logout from all devices)
export const deleteAllUserRefreshTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" required for cross-origin on Render
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

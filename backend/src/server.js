import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import referrerRoutes from "./routes/referrer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import companyRoutes from "./routes/company.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import badgeRoutes from "./routes/badge.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { startAutoForwardCron } from "./utils/cron.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false })); // CSP off so badge HTML page loads correctly
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  standardHeaders: true, legacyHeaders: false, message: { message: "Too many attempts, try again later" } });

app.use("/api", globalLimiter);
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/companies",     companyRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/referrer",      referrerRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/leaderboard",   leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/badge",             badgeRoutes); // public OG badge pages — no /api prefix

app.use(errorHandler);

startAutoForwardCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

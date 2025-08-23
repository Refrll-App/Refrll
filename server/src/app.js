import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import uploadSignedRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from "./routes/admin.routes.js"

import referralRoutes from './routes/referral.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import passport from 'passport';
import './config/passport.js'
config();
import session from 'express-session';
import dotenv from 'dotenv';
import cron from 'node-cron';
import Job from './models/Job.js';
dotenv.config();

const app = express();


app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(session({ secret: 'yoursecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// ✅ Trust proxy so Express knows it's behind HTTPS on Render
app.set('trust proxy', 1);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadSignedRoutes);

app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes)


app.use('/api/referrals',referralRoutes)
app.use('/api/admin', adminRoutes);






// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  try {
    const result = await Job.updateMany(
      { autoExpire: true, expiresAt: { $lte: now }, isActive: true },
      { $set: { status: 'closed', isActive: false } }
    );
    console.log(`Expired jobs updated: ${result.modifiedCount}`);
  } catch (err) {
    console.error('Error updating expired jobs:', err);
  }
});


export default app;





// import rateLimit from 'express-rate-limit';

// const globalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 100, // Max 100 requests per minute
//   message: 'Too many requests from this IP. Please slow down.',
// });

// app.use(globalLimiter); // Use early in middleware stack
import express from 'express';
import {
  registerEmployee,
  registerHr,
  login,
  logout,
  refreshToken,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/authUtils.js';

import crypto from 'crypto';

import { sendEmail } from '../utils/sendEmail.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/register', registerEmployee);           
router.post('/register-hr',authLimiter, registerHr);            
router.post('/login', login);



const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 3600 * 1000,
  });
};

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Step 2: Handle callback from Google
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  async (req, res) => {
    // Here, user info is available as req.user
    const user = req.user;



    // Issue your access + refresh token here
    // Set in HttpOnly cookies or return to frontend
       const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        setCookies(res, accessToken, refreshToken);
    

    // Example redirect
    res.redirect(`${process.env.CLIENT_URL}/employee/dashboard`); // or set cookies first
  }
);


router.get('/verify-email', verifyEmail);


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Click below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({ message: 'Password reset email sent' });
});


router.post('/reset-password/:token', async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

     const hashed = await bcrypt.hash(password, 12);


  user.password = password; 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});


router.get('/refresh-token',authLimiter, refreshToken); 


router.post('/logout', protect(['employee', 'hr']), logout);



export default router;
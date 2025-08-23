// server/src/routes/user.routes.js
import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import { updateProfile, uploadAvatar } from '../controllers/user.controller.js';
import upload from '../middlewares/upload.js';
const router = express.Router();

// GET current user
router.get('/me', protect(['employee', 'hr']), async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('companyId', 'name logoUrl');
  res.json(user);
});

// PUT update profile
router.put('/me', protect(['employee', 'hr']), updateProfile);


// routes/userRoutes.js
router.post('/upload-avatar', protect(['employee', 'hr']), upload.single('avatar'), uploadAvatar);


router.patch('/toggle-role', protect(['employee']), async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.type !== 'employee') return res.status(403).json({ message: 'Not allowed' });
  user.currentRole = user.currentRole === 'seeker' ? 'referrer' : 'seeker';
  await user.save();
  res.json({ currentRole: user.currentRole });
});


export default router;
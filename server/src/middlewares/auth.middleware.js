

import User from '../models/User.js';
import { verifyAccessToken } from '../utils/authUtils.js';

export const protect =(allowedTypes = [])=> async(req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

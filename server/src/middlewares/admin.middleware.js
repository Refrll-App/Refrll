import User from '../models/User.js';
import { verifyAccessToken } from '../utils/authUtils.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.user = user; // attach admin user to request
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

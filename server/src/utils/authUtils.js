import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, type: user.type }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

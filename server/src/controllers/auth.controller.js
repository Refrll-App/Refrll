


import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/authUtils.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

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



export const registerEmployee = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

       // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });


if (existingUser) {
  if (!existingUser.isVerified) {
    // Overwrite the old unverified user with new registration
    await User.deleteOne({ _id: existingUser._id });
  } else {
    return res.status(409).json({ message: "Email already exists" });
  }
}


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);


      // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24*60*60*1000); // 24h expiry

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      type: 'employee',
      roles: ['seeker', 'referrer'],
      currentRole: 'seeker',
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });


     // Send verification email
    // Frontend verification page
const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: 'Verify your Refrll account',
      html: `<p>Hi ${name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>
             <p>This link expires in 24 hours.</p>`
    });

 

    // Return user info
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      roles: user.roles,
      currentRole: user.currentRole,
    };

    res.status(201).json({ user: userData });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



export const registerHr = async (req, res) => {
  try {
    const { email, password, name, companyName, website } = req.body;

    // Basic validation
    if (!email || !password || !name || !companyName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Overwrite old unverified HR user
        await User.deleteOne({ _id: existingUser._id });
      } else {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    // Find or create the company
    let company = await Company.findOne({ name: companyName });
    if (!company) {
      company = await Company.create({ name: companyName, website });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create HR user with verification fields
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      type: 'hr',
      roles: ['hr'],
      currentRole: 'hr',
      companyId: company._id,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Associate user with company
    company.hrIds.push(user._id);
    await company.save();

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your Refrll HR account',
      html: `<p>Hi ${name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>
             <p>This link expires in 24 hours.</p>`,
    });

    // Return HR user data (without tokens yet)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      companyId: user.companyId,
      roles: user.roles,
      currentRole: user.currentRole,
    };

    res.status(201).json({ user: userData });
  } catch (err) {
    console.error('Register HR Error:', err);
    const errorMessage = err.code === 11000 ? 'Email already exists' : err.message;
    res.status(400).json({ message: errorMessage });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input presence
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password'); // in case password is select: false
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
  return res.status(403).json({ message: "Please verify your email before logging in." });
}


    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set httpOnly cookies
    setCookies(res, accessToken, refreshToken);

    // Send response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        roles: user.roles,
        currentRole: user.currentRole,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};




export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,               // use `false` only on local HTTP (not HTTPS)
      sameSite: 'None',           // for cross-site cookies (frontend on different domain)
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({  message: "Not logged in" });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id).select('_id email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  

      // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set httpOnly cookies
    setCookies(res, accessToken, refreshToken);

 

    res.status(200).json({ accessToken: accessToken,  refreshToken:refreshToken});

  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Invalid token' });

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

   

    if (!user) return res.status(400).json({ message: 'Token expired or invalid' });




    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

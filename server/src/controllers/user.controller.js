// server/src/controllers/user.controller.js  (append)
import cloudinary from '../config/cloudinary.js';
import Company from '../models/Company.js';
import User from '../models/User.js';


export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'linkedinUrl', 'githubUrl', 'yearsOfExp',
      'skills', 'avatarUrl', 'resumeUrl', 'location', 'designation', 'website'
    ];

    // Only allow companyName for employees
    if (req.user.type === 'employee') {
      allowedFields.push('companyName');
    }

    // Pick only allowed fields from request body
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Convert companyName → companyId if provided
    if (req.user.type === 'employee' && req.body.companyName?.trim()) {
      const companyName = req.body.companyName.trim();
      // let company = await Company.findOne({ name: companyName });
      let company = await Company.findOne({ 
  name: { $regex: new RegExp(`^${companyName}$`, "i") } 
});


      if (!company) {
        company = await Company.create({ name: companyName });
      }

      updates.companyId = company._id;
    }

    // Perform update and return updated user (excluding password)
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true
    })
      .select('-password')
      .populate('companyId', 'name logoUrl');

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ message: err.message || 'Failed to update profile' });
  }
};



export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Wrap cloudinary stream in a Promise
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Update user with avatar URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ avatarUrl: result.secure_url });
  } catch (err) {
    console.error('❌ Avatar upload error:', err);
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
};
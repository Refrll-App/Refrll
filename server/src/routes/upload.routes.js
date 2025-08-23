
import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import User from '../models/User.js';
import streamifier from 'streamifier';
import axios from 'axios';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/resume', protect(['employee']), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No valid resume file provided' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
          public_id: `resume_${req.user._id}`,
          overwrite: true,
          access_mode: 'public',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });


    res.status(200).json({
      url: uploadResult.secure_url,
      downloadUrl: uploadResult.secure_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
});



router.get('/download-resume/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resumeUrl) return res.status(404).json({ message: 'Resume not found' });

    // Fetch PDF from Cloudinary as a stream
    const response = await axios.get(user.resumeUrl, { responseType: 'stream' });

    // Force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Resume.pdf"');

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to download resume' });
  }
});


export default router;

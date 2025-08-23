import cloudinary from '../config/cloudinary.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'resumes' },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


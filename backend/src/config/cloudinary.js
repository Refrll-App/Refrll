

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage — we upload manually for full control
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files are allowed"), false);
  },
});

export const uploadToCloudinary = (buffer, userId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",      // PDFs stored as image serve with correct Content-Type
        format:        "pdf",        // explicitly tell Cloudinary this is a PDF
        folder:        "referral-platform/resumes",
        public_id:     `resume_${userId}`,
        overwrite:     true,
        invalidate:    true,
        access_mode:   "public",
      },
      (error, result) => (error ? reject(error) : resolve(result))
    ).end(buffer);
  });

export default cloudinary;
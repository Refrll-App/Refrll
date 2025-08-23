import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
  getApplicationsForJob,
  getReferrerApplications,
  checkIfApplied,
  downloadApplicationsExcel
} from '../controllers/application.controller.js';

const router = express.Router();

// Seeker
router.post('/', protect(['employee']), applyToJob);
router.get('/me', protect(['employee']), getMyApplications);
router.get('/status/:jobId', protect(['employee'] ), checkIfApplied);

// Referrer / HR
router.get('/referrer', protect(['employee']), getReferrerApplications);
router.patch('/:id/status', protect(['employee', 'hr']), updateApplicationStatus);
router.get('/job/:jobId', protect(['employee', 'hr']), getApplicationsForJob);

// In routes file, like routes/applicationRoutes.js
router.get('/download-excel', downloadApplicationsExcel);


export default router;
import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getJobs,
  getJobById,
  createCompanyJob,
  createReferralJob,
  updateJob,
  deleteJob,
  claimJob,
  getMyReferrals,
  getClaimableCompanyJobs,
  getHrJobs,
  getHrDashboardMetrics,
  getApplicationsForHrJob
} from '../controllers/job.controller.js';

const router = express.Router();


// PUBLIC
router.get('/', getJobs);
// Employee-only
router.get('/my-referrals', protect(['employee']), getMyReferrals); // 👈 BEFORE /:id
router.get('/claimable', protect(['employee']), getClaimableCompanyJobs);

router.post('/referral', protect(['employee']), createReferralJob);
router.post('/:id/claim', protect(['employee']), claimJob);

// HR-only
router.get('/hr',  protect(['hr']), getHrJobs);
router.get('/hr/dashboard/metrics',  protect(['hr']), getHrDashboardMetrics);
router.get('/:jobId/applications', protect(['hr']), getApplicationsForHrJob );


router.post('/company', protect(['hr']), createCompanyJob);
router.patch('/:id', protect(['hr']), updateJob);
router.delete('/:id', protect(['hr']), deleteJob);

// PUBLIC (detail)
router.get('/:id', getJobById); 


export default router;



// routes/referralRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/referrals/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Fetch users with referral counts, sorted by count descending
    const topReferrers = await User.aggregate([
      {
        $match: {
          'referralBadge.count': { $gt: 0 }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatarUrl: 1,
          designation: 1,
          createdAt: 1,
          referralCount: '$referralBadge.count',
          // Calculate level based on referral count
          level: {
            $switch: {
              branches: [
                { case: { $gte: ['$referralBadge.count', 20] }, then: 'platinum' },
                { case: { $gte: ['$referralBadge.count', 15] }, then: 'gold' },
                { case: { $gte: ['$referralBadge.count', 10] }, then: 'silver' },
                { case: { $gte: ['$referralBadge.count', 1] }, then: 'bronze' },
              ],
              default: 'none'
            }
          }
        }
      },
      {
        $sort: { referralCount: -1 } // Sort by highest referral count first
      },
      {
        $limit: 20 // Limit to top 10 referrers
      }
    ]);

    res.status(200).json(topReferrers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
});

export default router;
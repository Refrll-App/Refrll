import express from 'express';
import { getNotifications, markAllRead, markAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';


const router = express.Router();



// ✅ Get user notifications
router.get('/', protect(['employee']), getNotifications);

// ✅ Mark notification as read
router.put('/:id/read', protect(['employee']), markAsRead);

router.put('/mark-all-read', protect(['employee']),markAllRead);


export default router;


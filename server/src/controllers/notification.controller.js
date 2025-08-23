import mongoose from "mongoose";
import Notification from "../models/Notification.js";
// ✅ Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {

  const userId = req.user?._id?.toString(); 

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No userId' });
    }

    const notifications = await Notification.find({ userId:new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// ✅ Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark Notification as Read Error:', err);
    res.status(500).json({ message: 'Error updating notification' });
  }
};



export const markAllRead = async (req, res) => {
   try {

    
    const userId = req.user?._id?.toString(); 

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No userId' });
    }

    const result = await Notification.updateMany(
      { userId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({
      message: 'All notifications marked as read.',
      modifiedCount: result.modifiedCount
    });

  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ message: 'Server error while marking notifications as read.' });
  }
};
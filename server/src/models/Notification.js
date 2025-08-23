// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['info', 'success', 'warning'], default: 'info' },
  title: String,
  message: String,
  link: String,
  isRead: { type: Boolean, default: false },
  
},{
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);

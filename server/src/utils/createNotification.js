import Notification from "../models/Notification.js";

const createNotification = async (userId, title, message, link = '') => {
  try {
   const notification= await Notification.create({ userId, title, message, link });


 
        return notification;
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
};



export default createNotification;


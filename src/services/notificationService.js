import Notification from "../models/Notification.js";

import { getIO } from "../sockets/notificationSocket.js";

import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";

// Create Notification
export const createNotification = async (
  userId,
  message,
  type = NOTIFICATION_TYPES.SYSTEM,
  jobId = null,
) => {
  const notification = await Notification.create({
    user: userId,

    message,

    type,

    job: jobId,
  });

  // Emit Realtime Notification
  try {
    const io = getIO();

    io.to(userId.toString()).emit("new_notification", notification);
  } catch (error) {
    console.log("Socket emit skipped");
  }

  return notification;
};

// Get User Notifications
export const getUserNotifications = async (userId) => {
  return await Notification.find({
    user: userId,
  })
    .populate("job", "title company")
    .sort({
      createdAt: -1,
    });
};

// Mark Notification As Read
export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,

    user: userId,
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

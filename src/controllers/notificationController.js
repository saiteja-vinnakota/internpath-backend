import asyncHandler
from "../utils/asyncHandler.js";

import {
  successResponse
} from "../utils/responseFormatter.js";

import {

  getUserNotifications,

  markNotificationAsRead

} from "../services/notificationService.js";




// Get Logged-In User Notifications
export const getMyNotifications =
  asyncHandler(
    async (req, res) => {

      const notifications =
        await getUserNotifications(
          req.user._id
        );


      successResponse(

        res,

        "Notifications fetched successfully",

        notifications,

        200
      );
    }
  );




// Mark Notification As Read
export const markAsRead =
  asyncHandler(
    async (req, res) => {

      const notification =
        await markNotificationAsRead(

          req.params.id,

          req.user._id
        );


      successResponse(

        res,

        "Notification marked as read",

        notification,

        200
      );
    }
  );
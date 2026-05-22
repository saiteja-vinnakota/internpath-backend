import express from "express";

import {

  getMyNotifications,

  markAsRead

} from "../controllers/notificationController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import validate
from "../middleware/validateMiddleware.js";

import {
  notificationIdSchema
} from "../validators/notificationValidator.js";


const router =
  express.Router();




// Get Logged-In User Notifications
router.get(

  "/",

  protect,

  getMyNotifications
);




// Mark Notification As Read
router.put(

  "/:id/read",

  protect,

  validate(
    notificationIdSchema
  ),

  markAsRead
);


export default router;
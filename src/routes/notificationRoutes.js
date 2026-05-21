import express from "express";

import {

  getMyNotifications,

  markAsRead

} from "../controllers/notificationController.js";

import {
  protect
} from "../middleware/authMiddleware.js";


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

  markAsRead
);


export default router;
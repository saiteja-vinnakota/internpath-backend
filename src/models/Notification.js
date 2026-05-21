import mongoose from "mongoose";




const notificationSchema =
  new mongoose.Schema(
    {

      // Receiver User
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },



      // Notification Message
      message: {
        type: String,
        required: true,
        trim: true
      },



      // Notification Type
      type: {
        type: String,
        enum: [

          "APPLICATION",

          "SHORTLIST",

          "REJECT",

          "JOB",

          "SYSTEM"
        ],
        default: "SYSTEM"
      },



      // Related Job
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        default: null
      },



      // Read Status
      isRead: {
        type: Boolean,
        default: false
      }

    },
    {
      timestamps: true
    }
  );




// Latest Notifications First
notificationSchema.index({
  createdAt: -1
});




const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;
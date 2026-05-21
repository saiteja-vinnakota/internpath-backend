import mongoose from "mongoose";




const savedJobSchema =
  new mongoose.Schema(
    {

      // Student
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },



      // Saved Job
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true
      }

    },
    {
      timestamps: true
    }
  );




// Prevent Duplicate Saves
savedJobSchema.index(
  {
    student: 1,
    job: 1
  },
  {
    unique: true
  }
);




const SavedJob =
  mongoose.model(
    "SavedJob",
    savedJobSchema
  );

export default SavedJob;
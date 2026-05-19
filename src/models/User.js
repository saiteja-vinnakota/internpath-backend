import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: [
        ROLES.STUDENT,
        ROLES.RECRUITER
      ],
      default: ROLES.STUDENT
    },

    profilePicture: {
      type: String,
      default: ""
    },

    resumeUrl: {
      type: String,
      default: ""
    },

    resumeText: {
      type: String,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300
    }
  },
  {
    timestamps: true
  }
);


userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});
// Compare Password Method
userSchema.methods.comparePassword =
  async function (enteredPassword) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


const User =
  mongoose.model("User", userSchema);

export default User;
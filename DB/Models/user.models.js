// user model use mongoose


import mongoose from "mongoose";

import { systemRoles } from "../../src/utils/index.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      default: Date.now,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(systemRoles),
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: "version_key",
  }
);

// The username value is the combination of the value of the first name and the second name
// Middleware to set username before saving
userSchema.pre("validate", function (next) {
  this.username = `${this.firstName}${this.lastName}`;
  next();
});

export const User = mongoose.models.User || model("User", userSchema);

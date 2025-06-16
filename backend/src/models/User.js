import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "", 
    },
    rating: {
      type: Number,
      default: 1500,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    submissions: [
      {
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        status: { type: String, enum: ["Accepted", "Wrong Answer", "TLE", "MLE", "Runtime Error", "Compilation Error"] },
        language: String,
        code: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);

export default User;

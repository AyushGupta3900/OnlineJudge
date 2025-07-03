import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 1500,
    },
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        default: [],
      },
    ],
    solvedCountByDifficulty: {
      Easy: { type: Number, default: 0 },
      Medium: { type: Number, default: 0 },
      Hard: { type: Number, default: 0 },
    },
    submissions: [
      {
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        status: {
          type: String,
          enum: [
            "Accepted",
            "Wrong Answer",
            "Time Limit Exceeded",
            "Memory Limit Exceeded",
            "Runtime Error",
            "Compilation Error",
            "Pending",
          ],
        },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("computedRating").get(function () {
  const solvedCount = Array.isArray(this.solvedProblems) ? this.solvedProblems.length : 0;

  const totalSubmissions = Array.isArray(this.submissions) ? this.submissions.length : 0;
  const acceptedSubmissions = Array.isArray(this.submissions)
    ? this.submissions.filter((s) => s.status === "Accepted").length
    : 0;

  const accuracy =
    totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

  const bonus =
    accuracy > 0
      ? Math.round((Math.log2(accuracy) / Math.log2(100)) * 100)
      : 0;

  return 1500 + solvedCount * 10 + bonus;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const signupUser = TryCatch(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must have more than 6 letters", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists, please use a different one", 400);
  }

  const idx = Math.floor(Math.random() * 100) + 1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

  const newUser = await User.create({
    email,
    username,
    password,
    avatar: randomAvatar,
  });

  const token = jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "Signup successful",
    user: newUser,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

export const logoutUser = TryCatch(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const onboardingUser = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { fullName, bio } = req.body;

  if (!fullName || !bio) {
    throw new AppError("Full name and bio are required", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      bio,
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Onboarding completed",
    user: updatedUser,
  });
});
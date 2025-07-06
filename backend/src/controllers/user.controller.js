import User from "../models/User.js";
import Submission from "../models/Submission.js";
import redisClient from "../utils/config/redisClient.js";
import { paginateQuery } from "../utils/paginateQuery.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const getAllUsers = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "rating",
    order = "desc",
  } = req.query;

  const redisKey = `users:${page}:${limit}:${search}:${sortBy}:${order}`;

  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = {};
  const searchFields = ["username", "email"];

  const { results, total, totalPages } = await paginateQuery({
    model: User,
    query,
    search,
    searchFields,
    page: Number(page),
    limit: Number(limit),
    sortBy,
    order,
  });

  if (!results.length) {
    throw new AppError("No users found", 404);
  }

  const response = {
    data: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    ...response,
  });
});

export const makeAdmin = TryCatch(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("User is already an admin", 400);
  }

  user.role = "admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User promoted to admin successfully",
    user,
  });
});

export const updateUserAccount = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const allowedFields = ["fullName", "bio"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided to update", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Account updated successfully",
    user: updatedUser,
  });
});

export const deleteUserAccount = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await Submission.deleteMany({ user: userId });
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Account and all related submissions deleted successfully",
  });
});

export const getLeaderboard = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "-rating", // default sort: highest rating first
  } = req.query;

  const redisKey = `leaderboard:${page}:${limit}:${search}:${sort}`;

  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = {};
  if (search) {
    query.username = { $regex: search, $options: "i" };
  }

  const { results, total, totalPages } = await paginateQuery({
    model: User,
    query,
    page: Number(page),
    limit: Number(limit),
    sortBy: "rating",
    order: sort.startsWith("-") ? "desc" : "asc",
    projection: "username rating avatar solvedProblems",
  });

  const response = {
    data: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "Leaderboard fetched successfully",
    ...response,
  });
});

export const getProfileStats = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const redisKey = `profileStats:${userId}`;
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Profile stats fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const user = await User.findById(userId).select(
    "username avatar solvedProblems solvedCountByDifficulty"
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Count wrong submissions
  const wrongCount = await Submission.countDocuments({
    user: userId,
    verdict: { $ne: "Accepted" },
  });

  const response = {
    username: user.username,
    avatar: user.avatar,
    solvedCountByDifficulty: user.solvedCountByDifficulty || {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    },
    totalSolved: user.solvedProblems.length,
    totalWrongSubmissions: wrongCount,
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "Profile stats fetched successfully",
    ...response,
  });
});

export const getUserSubmissions = TryCatch(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const redisKey = `userSubmissions:${userId}:${page}:${limit}`;
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "User submissions fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const { results, total, totalPages } = await paginateQuery({
    model: Submission,
    query: { user: userId },
    page: Number(page),
    limit: Number(limit),
    sortBy: "submittedAt",
    order: "desc",
    populate: { path: "problem", select: "title" },
  });

  const response = {
    submissions: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "User submissions fetched successfully",
    ...response,
  });
});

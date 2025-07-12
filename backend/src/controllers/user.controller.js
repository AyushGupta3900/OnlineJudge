import User from "../models/User.js";
import Submission from "../models/Submission.js";
import redisClient from "../utils/config/redisClient.js";
import { paginateQuery } from "../utils/paginateQuery.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";
import { deleteKeysByPattern } from "../utils/deleteKeysByPattern.js";

// on delete account invalidate profileStats, Leaderboard and adminUsers
export const deleteUserAccount = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await Submission.deleteMany({ user: userId });
  await user.deleteOne();

  await deleteKeysByPattern(`user:${userId}:*`);
  await deleteKeysByPattern(`profileStats:${userId}`);
  await deleteKeysByPattern("leaderboard:*");
  await deleteKeysByPattern("users:*");

  res.status(200).json({
    success: true,
    message: "Account and all related submissions deleted successfully",
  });
});

// on update account invalidate profileStats, Leaderboard and adminUsers
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

  await deleteKeysByPattern(`profileStats:${userId}`);
  await deleteKeysByPattern("leaderboard:*");
  await deleteKeysByPattern("users:*");

  res.status(200).json({
    success: true,
    message: "Account updated successfully",
    user: updatedUser,
  });
});

// on submission it should be invalidated 
export const getLeaderboard = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = "",
    sort = "-computedRating",
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

  // Fetch users
  let allUsers = await User.find(query)
    .select(
      "username fullName email avatar solvedProblems solvedCountByDifficulty submissions rating role"
    )
    .exec();

  // Convert to plain objects with virtuals
  allUsers = allUsers.map((user) => user.toObject({ virtuals: true }));

  // Sort based on computedRating
  allUsers.sort((a, b) => {
    const aVal = a.computedRating ?? 0;
    const bVal = b.computedRating ?? 0;

    if (sort.startsWith("-")) {
      return bVal - aVal;
    } else {
      return aVal - bVal;
    }
  });

  const total = allUsers.length;
  const totalPages = Math.ceil(total / limit);

  // Top 3 globally
  const topThree = allUsers.slice(0, 3);

  // Remove top 3 from rest of list
  const excludeIds = new Set(topThree.map((u) => String(u._id)));
  const rest = allUsers.filter((u) => !excludeIds.has(String(u._id)));

  // Paginate remaining
  const paginated = rest.slice((page - 1) * limit, page * limit);

  const response = {
    topThree,
    users: paginated,
    total,
    totalPages,
    page: Number(page),
  };

  // Cache for 60 seconds
  await redisClient.set(redisKey, JSON.stringify(response), "EX", 60);

  res.status(200).json({
    success: true,
    message: "Leaderboard fetched successfully",
    ...response,
  });
});

// on submission it should be invalidated 
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
    "username fullName email bio avatar solvedProblems solvedCountByDifficulty rating role submissions"
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Count wrong submissions
  const wrongCount = await Submission.countDocuments({
    user: userId,
    verdict: { $ne: "Accepted" },
  });

  // Count total submissions
  const totalSubmissions = await Submission.countDocuments({
    user: userId,
  });

  const response = {
    username: user.username,
    fullName: user.fullName || "",
    email: user.email || "",
    bio: user.bio || "",
    avatar: user.avatar,
    rating: user.rating || 0,
    computedRating: user.computedRating, 
    role: user.role || "user",
    solvedCountByDifficulty: user.solvedCountByDifficulty || {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    },
    totalSolved: user.solvedProblems.length,
    totalWrongSubmissions: wrongCount,
    totalSubmissions,
  };

  await redisClient.set(redisKey, JSON.stringify(response), 'EX', 60);

  res.status(200).json({
    success: true,
    message: "Profile stats fetched successfully",
    ...response,
  });
});

// on submission it should be invalidated 
export const getUserSubmissions = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    verdict,
    language,
    sortBy = "submittedAt",
    order = "desc",
  } = req.query;

  const userId = req.user._id;

  const redisKey = `userSubmissions:${userId}:${page}:${limit}:${verdict || "all"}:${language || "all"}:${sortBy}:${order}`;
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "User submissions fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = { user: userId };
  if (verdict) query.verdict = verdict;
  if (language) query.language = language;

  const { results, total, totalPages } = await paginateQuery({
    model: Submission,
    query,
    page: Number(page),
    limit: Number(limit),
    sortBy,
    order,
    populate: { path: "problem", select: "title difficulty" },
  });

  const response = {
    submissions: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.set(redisKey, JSON.stringify(response), 'EX', 60);

  res.status(200).json({
    success: true,
    message: "User submissions fetched successfully",
    ...response,
  });
});

// on submission it should be invalidated 
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

  await redisClient.set(redisKey, JSON.stringify(response), 'EX', 60);

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
  
  await deleteKeysByPattern("users:*");

  res.status(200).json({
    success: true,
    message: "User promoted to admin successfully",
    user,
  });
});
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { TryCatch } from "../utils/TryCatch.js";
import redisClient from "../utils/config/redisClient.js";
import { AppError } from "../utils/AppError.js";
import { publishToQueue } from "../utils/rabbitmq.js";
import { paginateQuery } from "../utils/paginateQuery.js"
import { deleteKeysByPattern } from "../utils/deleteKeysByPattern.js";
import mongoose  from "mongoose";

// on submitting problem invalidate leaderboard, profileStats, users, userSubmissions,
// This invalidation is not working  
export const submitProblem = TryCatch(async (req, res) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    throw new AppError("Problem ID, code, and language are required", 400);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    code,
    language,
    verdict: "Pending",
    submittedAt: new Date(),
  });
  
  await publishToQueue("submissionQueue", {
    submissionId: submission._id.toString()
  });

  const userId = req.user?._id;
  await deleteKeysByPattern("leaderboard:*");
  await deleteKeysByPattern(`profileStats:${userId}`);
  await deleteKeysByPattern("users:*");
  await deleteKeysByPattern(`userSubmissions:${userId}:*`);
  await deleteKeysByPattern(`problemStatus:${userId}:${problemId}`);
  await deleteKeysByPattern(`user:${userId}:*`);


  res.status(201).json({
    success: true,
    message: "Your submission has been received and queued for judging.",
    data: {
      submissionId: submission._id,
      status: "Pending"
    }
  });
});

export const getSubmissionsByUserOnProblem = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new AppError("Invalid problem ID", 400);
  }

  const {
    page = 1,
    limit = 10,
    verdict,
    language,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;
  const redisKey = `userSubmissions:${userId}:${problemId}:${page}:${limit}:${verdict || "all"}:${language || "all"}:${sortBy}:${order}`;
  
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "User submissions fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }
  
  const query = { user: userId, problem: problemId };
  if (verdict) query.verdict = verdict;
  if (language) query.language = language;

  const { results, total, totalPages } = await paginateQuery({
    model: Submission,
    query,
    page: Number(page),
    limit: Number(limit),
    sortBy,
    order,
    populate: { path: "problem", select: "title" },
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

export const getSingleSubmission = TryCatch(async (req, res) => {
  const submissionId = req.params.id;
  const userId = req.user._id;

  const submission = await Submission.findById(submissionId)
    .populate("problem", "title")
    .populate("user", "username");

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  if (submission.user._id.toString() !== userId.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  return res.status(200).json({
    success: true,
    submission,
    source: "db",
  });
});
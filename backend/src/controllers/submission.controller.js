import Submission from "../models/Submission.js";
import axios from "axios";
import { TryCatch } from "../middlewares/TryCatch.js";
import { AppError } from "../utils/AppError.js";
import { publishToQueue } from "../utils/rabbitmq.js";

export const submitProblem = TryCatch(async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user._id;

  if (!problemId || !code || !language) {
    throw new AppError("All fields are required", 400);
  }

  // Save submission with 'Pending'
  const submission = await Submission.create({
    user: userId,
    problem: problemId,
    code,
    language,
    verdict: "Pending",
  });

  // Publish to RabbitMQ queue for judging
  await publishToQueue("submissionQueue", {
    submissionId: submission._id.toString(),
  });

  res.status(201).json({
    success: true,
    message: "Submission received and sent to judge system",
    data: submission,
  });
});

export const getSubmissionsByUserOnProblem = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const redisKey = `userSubmissions:${userId}:${page}:${limit}`;
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "User submissions fetched from cache",
      ...JSON.parse(cached),
    });
  }

  const { results, total, totalPages } = await paginateQuery(Submission, { user: userId }, {
    page,
    limit,
    sort: "-submittedAt",
    populate: { path: "problem", select: "title" },
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
    message: "User submissions fetched successfully",
    ...response,
  });
});

export const getSingleSubmission = TryCatch(async (req, res) => {
  const submissionId = req.params.id;
  const userId = req.user._id;

  const redisKey = `submission:${submissionId}`;

  // Check cache
  const cached = await redisClient.get(redisKey);
  if (cached) {
    const submission = JSON.parse(cached);
    if (submission.user._id !== userId.toString()) {
      throw new AppError("Unauthorized", 403);
    }

    return res.status(200).json({
      success: true,
      submission,
      source: "cache",
    });
  }

  // Fetch from DB
  const submission = await Submission.findById(submissionId)
    .populate("problem", "title")
    .populate("user", "username");

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  if (submission.user._id.toString() !== userId.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  // Save to Redis for next requests
  await redisClient.setEx(redisKey, 300, JSON.stringify(submission));

  return res.status(200).json({
    success: true,
    submission,
    source: "db",
  });
});

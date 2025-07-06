import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../middlewares/TryCatch.js";
import { redisClient } from "../config/redis.js";
import { paginateQuery } from "../utils/paginateQuery.js";

export const getAllProblems = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    difficulty,
    status,
    tag,
  } = req.query;

  const redisKey = `problems:${page}:${limit}:${search}:${sortBy}:${order}:${difficulty}:${status}:${tag}`;

  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = {};
  const searchFields = ["title", "tags"];

  if (difficulty) query.difficulty = difficulty;
  if (tag) query.tags = tag;

  // optional: filter by solved/unsolved for logged-in user
  if (status && req.user) {
    if (status === "solved") query._id = { $in: req.user.solvedProblems };
    if (status === "unsolved") query._id = { $nin: req.user.solvedProblems };
  }

  const { results, total, totalPages } = await paginateQuery({
    model: Problem,
    query,
    search,
    searchFields,
    page: Number(page),
    limit: Number(limit),
    sortBy,
    order,
    populate: { path: "createdBy", select: "username email" },
  });

  if (!results.length) throw new AppError("No problems found", 404);

  const response = {
    data: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "Problems fetched successfully",
    ...response,
  });
});

export const getProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;
  if (!problemId) throw new AppError("Problem ID is required", 400);

  const redisKey = `problem:${problemId}`;
  const cached = await redisClient.get(redisKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully (from cache)",
      data: JSON.parse(cached),
    });
  }

  const problem = await Problem.findById(problemId).populate("createdBy", "username email");
  if (!problem) throw new AppError("Problem not found", 404);

  await redisClient.setEx(redisKey, 60, JSON.stringify(problem));

  res.status(200).json({
    success: true,
    message: "Problem fetched successfully",
    data: problem,
  });
});

export const createProblem = TryCatch(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    constraints = [],
    inputFormat = [],
    outputFormat = [],
    sampleTestCases,
    hiddenTestCases,
    timeLimit,
    memoryLimit,
  } = req.body;

  if (!title || !description || !sampleTestCases?.length) {
    throw new AppError("Title, description and at least one sample test case are required.", 400);
  }

  const existing = await Problem.findOne({ title });
  if (existing) throw new AppError("A problem with this title already exists.", 409);

  const newProblem = await Problem.create({
    title,
    description,
    difficulty,
    tags,
    constraints,
    inputFormat,
    outputFormat,
    sampleTestCases,
    hiddenTestCases,
    timeLimit,
    memoryLimit,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Problem created successfully",
    data: newProblem,
  });
});

export const editProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;
  const updates = req.body;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError("Problem not found", 404);

  if (problem.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized to edit this problem", 403);
  }

  Object.assign(problem, updates);
  await problem.save();

  res.status(200).json({
    success: true,
    message: "Problem updated successfully",
    data: problem,
  });
});

export const deleteProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError("Problem not found", 404);

  if (problem.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized to delete this problem", 403);
  }

  await Submission.deleteMany({ problem: problemId });
  await User.updateMany({}, { $pull: { submissions: { problemId } } });
  const users = await User.find({ solvedProblems: problemId });
  for (const user of users) {
    user.solvedProblems.pull(problemId);
    if (problem.difficulty && user.solvedCountByDifficulty[problem.difficulty] > 0) {
      user.solvedCountByDifficulty[problem.difficulty] -= 1;
    }
    await user.save();
  }
  await problem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Problem, related submissions and user references deleted successfully",
  });
});

export const createProblemFromArray = TryCatch(async (req, res) => {
  const problemsArray = req.body;

  if (!Array.isArray(problemsArray) || problemsArray.length === 0) {
    throw new AppError("Request body must be a non-empty array of problems.", 400);
  }

  const createdProblems = [];
  const skippedProblems = [];

  for (const problem of problemsArray) {
    const {
      title,
      description,
      difficulty,
      tags,
      constraints = [],
      inputFormat = [],
      outputFormat = [],
      sampleTestCases,
      hiddenTestCases,
      timeLimit,
      memoryLimit,
    } = problem;

    if (!title || !description || !sampleTestCases?.length) {
      skippedProblems.push({ title, reason: "Missing required fields" });
      continue;
    }

    const existing = await Problem.findOne({ title });
    if (existing) {
      skippedProblems.push({ title, reason: "Duplicate title" });
      continue;
    }

    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      inputFormat,
      outputFormat,
      sampleTestCases,
      hiddenTestCases,
      timeLimit,
      memoryLimit,
      createdBy: req.user._id,
    });

    createdProblems.push(newProblem);
  }

  res.status(201).json({
    success: true,
    message: "Batch problem creation completed",
    createdCount: createdProblems.length,
    skippedCount: skippedProblems.length,
    createdProblems,
    skippedProblems,
  });
});

export const getProblemStatus = TryCatch(async (req, res) => {
  const { problemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new AppError("Invalid problem ID", 400);
  }

  const isSolved = req.user.solvedProblems.some(
    (id) => id.toString() === problemId
  );

  res.status(200).json({
    success: true,
    problemId,
    status: isSolved ? "solved" : "unsolved",
  });
});


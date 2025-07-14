import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";
import redisClient from "../utils/config/redisClient.js";
import { paginateQuery } from "../utils/paginateQuery.js";
import { deleteKeysByPattern } from "../utils/deleteKeysByPattern.js";

export const getAllProblems = TryCatch(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    difficulty,
    tag,
    status,
  } = req.query;

  const userId = req.user?._id || "guest";
  const redisKey = `problems:${userId}:${page}:${limit}:${search}:${sortBy}:${order}:${difficulty}:${tag}:${status}`;

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

  const { results: allResults } = await paginateQuery({
    model: Problem,
    query,
    search,
    searchFields,
    page: 1,
    limit: Number.MAX_SAFE_INTEGER,
    sortBy,
    order,
    populate: { path: "createdBy", select: "username email" },
  });

  let solvedSet = new Set();
  if (req.user?._id) {
    const user = await User.findById(req.user._id).select("solvedProblems");
    if (!user) throw new AppError("User not found", 404);
    solvedSet = new Set(user.solvedProblems.map(id => id.toString()));
  }

  let problemsWithStatus = allResults.map(problem => {
    return {
      ...problem.toObject(),
      isSolved: solvedSet.has(problem._id.toString()),
    };
  });


  if (status === "solved") {
    problemsWithStatus = problemsWithStatus.filter(p => p.isSolved);
  } else if (status === "unsolved") {
    problemsWithStatus = problemsWithStatus.filter(p => !p.isSolved);
  }

  const total = problemsWithStatus.length;
  const totalPages = Math.ceil(total / limit);
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + Number(limit);
  const paginatedData = problemsWithStatus.slice(startIdx, endIdx);

  const response = {
    data: paginatedData,
    total,
    totalPages,
    page: Number(page),
  };

await redisClient.set(redisKey, JSON.stringify(response), 'EX', 60);

  res.status(200).json({
    success: true,
    message: "Problems fetched successfully",
    ...response,
  });
});

// on creating problem invalidate getAllProblems 
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
    throw new AppError(
      "Title, description and at least one sample test case are required.",
      400
    );
  }

  const existing = await Problem.findOne({ title });
  if (existing)
    throw new AppError("A problem with this title already exists.", 409);

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

  await deleteKeysByPattern("problems:*");

  res.status(201).json({
    success: true,
    message: "Problem created successfully",
    data: newProblem,
  });
});

// on editing problem invalidate getAllProblems, getProblem, ProfileStats, Submissions (All Submissions, Problem Submissions)
export const editProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;
  const updates = req.body;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError("Problem not found", 404);

  const isSuperadmin = req.user.isSuperadmin === true;

  if (!isSuperadmin && problem.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized to edit this problem", 403);
  }

  Object.assign(problem, updates);
  await problem.save();

  await deleteKeysByPattern("problems:*");
  await deleteKeysByPattern(`problem:${problemId}`);
  await deleteKeysByPattern(`userSubmissions:*`);
  await deleteKeysByPattern(`profileStats:*`);

  res.status(200).json({
    success: true,
    message: "Problem updated successfully",
    data: problem,
  });
});

// on deleting problem invalidate getAllProblems, getProblem, ProfileStats, Submissions(All Submissions, Problem Submissions)
export const deleteProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError("Problem not found", 404);

  const isSuperadmin = req.user.isSuperadmin === true;

  if (!isSuperadmin && problem.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized to delete this problem", 403);
  }

  // Delete all submissions of this problem
  await Submission.deleteMany({ problem: problemId });

  // Remove problem from all user submission arrays
  await User.updateMany({}, { $pull: { submissions: { problemId } } });

  // Update solvedProblems and difficulty counts
  const users = await User.find({ solvedProblems: problemId });
  for (const user of users) {
    user.solvedProblems.pull(problemId);

    if (
      problem.difficulty &&
      user.solvedCountByDifficulty[problem.difficulty] > 0
    ) {
      user.solvedCountByDifficulty[problem.difficulty] -= 1;
    }

    await user.save();
  }

  await problem.deleteOne();

  await deleteKeysByPattern("problems:*");
  await deleteKeysByPattern(`problem:${problemId}`);
  await deleteKeysByPattern(`userSubmissions:*`);
  await deleteKeysByPattern(`profileStats:*`);

  res.status(200).json({
    success: true,
    message:
      "Problem, related submissions and user references deleted successfully",
  });
});

export const getProblem = TryCatch(async (req, res) => {
  const problemId = req.params.id;
  console.log(problemId)
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
  const problem = await Problem.findById(problemId).populate(
    "createdBy",
    "username email"
  );
  if (!problem) throw new AppError("Problem not found", 404);
  console.log(problem)

  await redisClient.set(redisKey, JSON.stringify(problem), "EX", 60);

  res.status(200).json({
    success: true,
    message: "Problem fetched successfully",
    data: problem,
  });
});

// on creating problem invalidate getAllProblems 
export const createProblemFromArray = TryCatch(async (req, res) => {
  const problemsArray = req.body;

  if (!Array.isArray(problemsArray) || problemsArray.length === 0) {
    throw new AppError(
      "Request body must be a non-empty array of problems.",
      400
    );
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

  await deleteKeysByPattern("problems:*");

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
  const problemId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new AppError("Invalid problem ID", 400);
  }

  // If user is not logged in
  if (!req.user || !req.user._id) {
    const response = {
      success: true,
      problemId,
      status: "unsolved",
    };
    return res.status(200).json(response);
  }

  const cacheKey = `problemStatus:${req.user._id}:${problemId}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const user = await User.findById(req.user._id).select("solvedProblems");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isSolved = user.solvedProblems.some(
    (id) => id.toString() === problemId
  );

  const response = {
    success: true,
    problemId,
    status: isSolved ? "solved" : "unsolved",
  };

  await redisClient.set(cacheKey, JSON.stringify(response), "EX", 60);

  return res.status(200).json(response);
});

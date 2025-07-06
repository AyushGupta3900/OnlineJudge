// utils/workerUtils.js
import axios from "axios";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import redisClient from "./redisClient.js";

const COMPILER_BACKEND_URL =
  process.env.COMPILER_BACKEND_URL || "http://localhost:5001";

export const handleSubmissionJob = async ({ submissionId }) => {
  console.log(`[Worker] Processing submission ${submissionId}`);

  const submission = await Submission.findById(submissionId)
    .populate("user")
    .populate("problem");

  if (!submission) {
    throw new Error(`Submission ${submissionId} not found`);
  }

  const { data: result } = await axios.post(
    `${COMPILER_BACKEND_URL}/api/v1/judge`,
    {
      code: submission.code,
      language: submission.language,
      problemId: submission.problem._id,
    }
  );

  submission.verdict = result.verdict;
  submission.executionTime = result.executionTime;
  submission.memoryUsed = result.memoryUsed;
  submission.passedTestCases = result.passedTestCases;
  submission.totalTestCases = result.totalTestCases;
  submission.error = result.error || null;
  submission.testCaseResults = result.testCaseResults;

  await submission.save();

  if (result.verdict === "Accepted") {
    const user = await User.findById(submission.user._id);

    if (!user.solvedProblems.includes(submission.problem._id)) {
      user.solvedProblems.push(submission.problem._id);
      user.solvedCountByDifficulty[submission.problem.difficulty] =
        (user.solvedCountByDifficulty[submission.problem.difficulty] || 0) + 1;
    }

    await user.save();
  }

  console.log(`[Worker] Submission ${submissionId} -> ${result.verdict}`);


  await Promise.all([
    redisClient.del(`submission:${submissionId}`),
    redisClient.del(`userSubmissions:${submission.user._id}:1:10`),
    redisClient.del(`profileStats:${submission.user._id}`),
  ]);
};

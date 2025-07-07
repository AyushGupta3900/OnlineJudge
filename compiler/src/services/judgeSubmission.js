import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { runCodeAgainstTestCases } from "../utils/runAgainstTestCases.js";

export const judgeSubmission = async (submissionId) => {
  if (!submissionId) {
    throw new Error("submissionId is required");
  }

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  const problem = await Problem.findById(submission.problem);
  if (!problem) {
    throw new Error("Problem not found");
  }

  const testCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];

  const result = await runCodeAgainstTestCases({
    code: submission.code,
    language: submission.language,
    testCases,
    timeLimit: problem.timeLimit || 1,
    memoryLimit: problem.memoryLimit || 256,
  });

  submission.verdict = result.verdict;
  submission.executionTime = result.executionTime ?? null;
  submission.memoryUsed = result.memoryUsed ?? null;
  submission.totalTestCases = testCases.length;
  submission.passedTestCases = result.passedTestCases ?? 0;
  submission.output = result.output ?? "";
  submission.error = result.error ?? "";
  submission.testCaseResults = result.testCaseResults ?? [];

  await submission.save();

  const user = await User.findById(submission.user);
  if (user) {
    user.submissions.push({
      problemId: submission.problem,
      status: submission.verdict,
      language: submission.language,
      code: submission.code,
      submittedAt: new Date(),
    });

    if (
      submission.verdict === "Accepted" &&
      !user.solvedProblems.includes(submission.problem)
    ) {
      user.solvedProblems.push(submission.problem);

      const difficulty = problem.difficulty;
      if (["Easy", "Medium", "Hard"].includes(difficulty)) {
        if (!user.solvedCountByDifficulty) {
          user.solvedCountByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        }
        user.solvedCountByDifficulty[difficulty] += 1;
      }
    }

    await user.save();
  }

  return {
    verdict: submission.verdict,
    executionTime: submission.executionTime,
    memoryUsed: submission.memoryUsed,
    passedTestCases: submission.passedTestCases,
    totalTestCases: submission.totalTestCases,
  };
};

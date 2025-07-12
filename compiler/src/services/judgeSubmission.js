import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { runCodeAgainstTestCases } from "../utils/runAgainstTestCases.js";

export const judgeSubmission = async (submissionId) => {
  //  check if submission is present 
  if (!submissionId) {
    throw new Error("submissionId is required");
  }

  // get the submission 
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  // get the problem 
  const problem = await Problem.findById(submission.problem);
  if (!problem) {
    throw new Error("Problem not found");
  }

  // get the test-cases
  const testCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];

  // run them against testcases
  const result = await runCodeAgainstTestCases({
    code: submission.code,
    language: submission.language,
    testCases,
    timeLimit: problem.timeLimit || 1,
    memoryLimit: problem.memoryLimit || 256,
  });

  // update the result 
  submission.verdict = result.verdict;
  submission.executionTime = result.executionTime ?? null;
  submission.memoryUsed = result.memoryUsed ?? null;
  submission.totalTestCases = testCases.length;
  submission.passedTestCases = result.passedTestCases ?? 0;
  submission.output = result.output ?? "";
  submission.error = result.error ?? "";
  submission.testCaseResults = result.testCaseResults ?? [];

  // save the submission 
  await submission.save();

  // find the user who submitted
  const user = await User.findById(submission.user);

  // push in user-submissions 
  if (user) {
    user.submissions.push({
      problemId: submission.problem,
      status: submission.verdict,
      language: submission.language,
      code: submission.code,
      submittedAt: new Date(),
    });

    // push in user solved problems 
    if (
      submission.verdict === "Accepted" &&
      !user.solvedProblems.includes(submission.problem)
    ) {
      user.solvedProblems.push(submission.problem);

      // update the difficulty count 
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

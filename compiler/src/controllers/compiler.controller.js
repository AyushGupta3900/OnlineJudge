import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { runCodeAgainstTestCases } from "../utils/runAgainstTestCases.js";

export async function judgeSubmission(req, res) {
  try {
    const { submissionId } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: "submissionId is required" });
    }

    // 1. Fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 2. Fetch problem
    const problem = await Problem.findById(submission.problem);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // 3. Combine sample + hidden test cases
    const testCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];

    // 4. Run the code against test cases
    const result = await runCodeAgainstTestCases({
      code: submission.code,
      language: submission.language,
      testCases,
      timeLimit: problem.timeLimit || 1,
      memoryLimit: problem.memoryLimit || 256,
    });

    // 5. Update verdict and performance stats
    submission.verdict = result.verdict;
    submission.executionTime = result.executionTime;
    submission.memoryUsed = result.memoryUsed;

    await submission.save();

    // 6. Update user document
    const user = await User.findById(submission.user);
    if (user) {
      // Push the current submission to user's submissions array
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

    return res.status(200).json({
      message: "Submission judged successfully",
      verdict: submission.verdict,
    });
  } catch (error) {
    console.error("Error judging submission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

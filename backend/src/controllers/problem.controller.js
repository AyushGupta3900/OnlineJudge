import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js"

export async function getAllProblems(req, res) {
  try {
    const problems = await Problem.find({});
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      data: problems,
    });
  } catch (error) {
    console.log("Error in getAllProblems controller", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching problems",
    });
  }
}

export async function getProblem(req, res) {
  try {
    const problemId = req.params.id;
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const problem = await Problem.findById(problemId).populate("createdBy", "username email");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      data: problem,
    });

  } catch (error) {
    console.error("Error in getProblem controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching problem",
    });
  }
}

export async function createProblem(req, res) {
  try {
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
    console.log("Running")
    if (!title || !description || !sampleTestCases || sampleTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and at least one sample test case are required.",
      });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists.",
      });
    }

    const newProblem = new Problem({
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

    await newProblem.save();

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: newProblem,
    });

  } catch (error) {
    console.error("Error in createProblem controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating problem",
    });
  }
}

export async function editProblem(req, res) {
  try {
    const problemId = req.params.id;
    const updates = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (problem.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to edit this problem",
      });
    }

    Object.keys(updates).forEach((key) => {
      problem[key] = updates[key];
    });

    await problem.save();

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    });

  } catch (error) {
    console.error("Error in editProblem controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while editing problem",
    });
  }
}

export async function deleteProblem(req, res) {
  try {
    const problemId = req.params.id;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (problem.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this problem",
      });
    }

    // 1. Delete all submissions related to this problem
    await Submission.deleteMany({ problem: problemId });

    // 2. Remove related submissions from all users
    await User.updateMany(
      {},
      {
        $pull: {
          submissions: { problemId: problemId },
        },
      }
    );

    // 3. Remove the problem from users' solvedProblems
    const users = await User.find({ solvedProblems: problemId });

    for (const user of users) {
      const difficulty = problem.difficulty;
      user.solvedProblems.pull(problemId);
      if (difficulty && user.solvedCountByDifficulty[difficulty] > 0) {
        user.solvedCountByDifficulty[difficulty] -= 1;
      }
      await user.save();
    }

    // 4. Delete the problem itself
    await problem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Problem, related submissions, and user references deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProblem controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting problem",
    });
  }
}

export async function createProblemFromArray(req, res) {
  try {
    const problemsArray = req.body;

    if (!Array.isArray(problemsArray) || problemsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array of problems.",
      });
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

      if (!title || !description || !sampleTestCases || sampleTestCases.length === 0) {
        skippedProblems.push({
          title,
          reason: "Missing required fields: title, description, or sampleTestCases",
        });
        continue;
      }

      const existing = await Problem.findOne({ title });
      if (existing) {
        skippedProblems.push({
          title,
          reason: "Duplicate title",
        });
        continue;
      }

      const newProblem = new Problem({
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

      await newProblem.save();
      createdProblems.push(newProblem);
    }

    return res.status(201).json({
      success: true,
      message: "Batch problem creation completed.",
      createdCount: createdProblems.length,
      skippedCount: skippedProblems.length,
      createdProblems,
      skippedProblems,
    });

  } catch (error) {
    console.error("Error in createProblemFromArray controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating problems in batch.",
    });
  }
}

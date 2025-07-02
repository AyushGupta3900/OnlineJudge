import Submission from "../models/Submission.js";
import axios from "axios";

export async function submitProblem(req, res) {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user._id;
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // 1. Save with "Pending"
    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: "Pending",
    });

    await submission.save();
    // 2. Send submissionId to compiler
    const compilerBaseURL = process.env.COMPILER_BASE_URL;
    await axios.post(`${compilerBaseURL}/api/compile/submit`, {
      submissionId: submission._id,
    });

    // 3. Respond to frontend
    res.status(201).json({
      message: "Submission received and sent to judge system.",
      submission,
    });
  } catch (error) {
    console.error("Error in submitProblem:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
} 

export async function  getSubmissionsByUserOnProblem(req, res){
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const submissions = await Submission.find({
      user: userId,
      problem: problemId,
    }).sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error("Error in getSubmissionsByUserOnProblem:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export async function getSingleSubmission(req, res) {
  try {
    const submissionId = req.params.id;
    const userId = req.user._id;

    const submission = await Submission.findById(submissionId)
      .populate("problem", "title")
      .populate("user", "username");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      submission,
    });

  } catch (err) {
    console.error("Error in getSingleSubmission:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
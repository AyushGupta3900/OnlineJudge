import Submission from "../models/Submission.js";

export async function submitProblem(req, res) {
  try {
    const { userId, problemId, code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: "Pending", 
    });

    await submission.save();

    res.status(201).json({
      message: "Submission received and pending judgment.",
      submission,
    });
  } catch (error) {
    console.error("Error in submitProblem:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getSubmissionsByUser(req, res) {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ user: userId })
      .populate("problem", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in getSubmissionsByUser:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getSubmissionToProblem(req, res) {
  try {
    const { problemId } = req.params;
    const { userId } = req.query;

    const filter = { problem: problemId };
    if (userId) filter.user = userId;

    const submissions = await Submission.find(filter)
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in getSubmissionToProblem:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

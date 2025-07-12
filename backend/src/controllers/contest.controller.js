import  {Contest} from "../models/Contest.js";
import  Submission  from "../models/Submission.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";
import redisClient from "../utils/config/redisClient.js"; 
import { publishToQueue } from "../utils/rabbitmq.js"

// Helper: is contest active
const isContestActive = (contest) => {
  const now = new Date();
  return now >= contest.startTime && now <= contest.endTime;
};

// Admin: Create contest
export const createContest = TryCatch(async (req, res) => {
  const { title, description, startTime, endTime, problems } = req.body;

  if (!title || !startTime || !endTime || !Array.isArray(problems)) {
    throw new AppError("All required fields must be provided", 400);
  }

  const contest = await Contest.create({
    title,
    description,
    startTime,
    endTime,
    problems,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, contest });
});

// Admin: Update contest
export const updateContest = TryCatch(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);
  if (!contest) throw new AppError("Contest not found", 404);

  const { title, description, startTime, endTime, problems } = req.body;

  if (title) contest.title = title;
  if (description) contest.description = description;
  if (startTime) contest.startTime = startTime;
  if (endTime) contest.endTime = endTime;
  if (problems) contest.problems = problems;

  await contest.save();

  res.status(200).json({ success: true, contest });
});

// Admin: Delete contest
export const deleteContest = TryCatch(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);
  if (!contest) throw new AppError("Contest not found", 404);

  await contest.deleteOne();

  await redisClient.del(`contest:leaderboard:${id}`);

  res.status(200).json({ success: true, message: "Contest deleted" });
});

// Get all contests
export const getAllContests = TryCatch(async (req, res) => {
  const now = new Date();

  const contests = await Contest.find();

  const categorized = {
    upcoming: [],
    active: [],
    past: [],
  };

  contests.forEach((c) => {
    if (now < c.startTime) categorized.upcoming.push(c);
    else if (now >= c.startTime && now <= c.endTime) categorized.active.push(c);
    else categorized.past.push(c);
  });

  res.status(200).json({ success: true, contests: categorized });
});

// Get single contest
export const getContest = TryCatch(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id).populate("problems createdBy", "title username");
  if (!contest) throw new AppError("Contest not found", 404);

  res.status(200).json({ success: true, contest });
});

// Register for contest
export const registerForContest = TryCatch(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);
  if (!contest) throw new AppError("Contest not found", 404);

  const now = new Date();
  if (now >= contest.startTime) throw new AppError("Cannot register after contest has started", 400);

  if (!contest.participants.includes(req.user._id)) {
    contest.participants.push(req.user._id);
    await contest.save();
  }

  res.status(200).json({ success: true, message: "Registered successfully" });
});

// Get leaderboard
export const getLeaderboard = TryCatch(async (req, res) => {
  const { id } = req.params;

  const leaderboardKey = `contest:leaderboard:${id}`;

  const entries = await redisClient.zrevrange(leaderboardKey, 0, -1, "WITHSCORES");

  const leaderboard = [];
  for (let i = 0; i < entries.length; i += 2) {
    leaderboard.push({
      userId: entries[i],
      score: Number(entries[i + 1]),
    });
  }

  res.status(200).json({ success: true, leaderboard });
});

// Submit solution during contest
export const submitContestSolution = TryCatch(async (req, res) => {
  const { id: contestId, problemId } = req.params;
  const { code, language } = req.body;

  if (!code || !language) {
    throw new AppError("Code and language are required", 400);
  }

  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError("Contest not found", 404);

  if (!contest.participants.includes(req.user._id)) {
    throw new AppError("You are not registered for this contest", 403);
  }

  if (!isContestActive(contest)) {
    throw new AppError("Contest is not active", 400);
  }

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    code,
    language,
    verdict: "Pending",
    contest: contestId,
    submittedAt: new Date()
  });

  await publishToQueue("submissionQueue", {
    submissionId: submission._id.toString(),
    contestId: contestId,
  });

  res.status(201).json({
    success: true,
    message: "Submission received. Judging in progress.",
    submissionId: submission._id,
    status: "Pending"
  });
});

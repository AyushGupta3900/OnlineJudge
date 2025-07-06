import ContactMessage from "../models/ContactMessage.js";
import { TryCatch } from "../middlewares/TryCatch.js";
import { AppError } from "../utils/AppError.js";
import { paginateQuery } from "../utils/paginateQuery.js";
import { redisClient } from "../config/redis.js";

export const sendContactMessage = TryCatch(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new AppError("All fields are required.", 400);
  }

  const newMessage = await ContactMessage.create({ name, email, message });

  res.status(201).json({
    success: true,
    message: "Your message has been received. We'll get back to you soon!",
    data: newMessage,
  });
});

export const getAllContactMessages = TryCatch(async (req, res) => {
  const { page = 1, limit = 10, search = "", sort = "-createdAt" } = req.query;

  const redisKey = `contactMessages:${page}:${limit}:${search}:${sort}`;
  const cached = await redisClient.get(redisKey);

  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Contact messages fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const { results, total, totalPages } = await paginateQuery(ContactMessage, query, {
    page,
    limit,
    sort,
  });

  const response = {
    data: results,
    total,
    totalPages,
    page: Number(page),
  };

  await redisClient.setEx(redisKey, 60, JSON.stringify(response));

  res.status(200).json({
    success: true,
    message: "Contact messages fetched successfully",
    ...response,
  });
});

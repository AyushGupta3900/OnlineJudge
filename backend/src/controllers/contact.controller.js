import ContactMessage from "../models/ContactMessage.js";
import { TryCatch } from "../utils/TryCatch.js";
import redisClient from "../utils/config/redisClient.js";
import { AppError } from "../utils/AppError.js";
import { paginateQuery } from "../utils/paginateQuery.js";

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
  const { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

  const redisKey = `contactMessages:${page}:${limit}:${search}:${sortBy}:${order}`;
  const cached = await redisClient.get(redisKey);

  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Contact messages fetched successfully (from cache)",
      ...JSON.parse(cached),
    });
  }

  const query = {};
  const searchFields = ["name", "email", "message"];

  const { results, total, totalPages } = await paginateQuery({
    model: ContactMessage,
    query,
    search,
    searchFields,
    page: Number(page),
    limit: Number(limit),
    sortBy,
    order,
  });

  const response = {
    data: results,
    total,
    totalPages,
    page: Number(page),
  };

await redisClient.set(redisKey, JSON.stringify(response), 'EX', 60);


  res.status(200).json({
    success: true,
    message: "Contact messages fetched successfully",
    ...response,
  });
});

// worker.js
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import redisClient from "./utils/redisClient.js";
import { connectRabbitMQ, consumeFromQueue } from "./utils/rabbitmq.js";
import { handleSubmissionJob } from "./utils/workerUtils.js";

const startWorker = async () => {
  try {
    await connectDB();

    if (!redisClient.status || redisClient.status !== "ready") {
      await redisClient.connect();
      console.log("[Worker] Redis connected");
    }

    await connectRabbitMQ();

    await consumeFromQueue("submissionQueue", handleSubmissionJob);

    console.log("[Worker] Listening for jobs on submissionQueue…");
  } catch (err) {
    console.error("[Worker] Failed to start:", err);
    process.exit(1);
  }
};

startWorker();

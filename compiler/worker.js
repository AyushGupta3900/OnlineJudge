import dotenv from "dotenv";
import {connectDB} from "./src/config/db.js"
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import { consumeFromQueue } from "./src/rabbitmq.js";
import { judgeSubmission } from "./src/services/judgeSubmission.js"; 

dotenv.config();
connectDB();

async function startWorker() {
  const channel = await connectRabbitMQ();
  console.log("[Worker] Listening for jobs on submissionQueue…");

  await consumeFromQueue("submissionQueue", async ({ submissionId }) => {
    console.log(`[Worker] Processing submission ${submissionId}`);

    try {
      const result = await judgeSubmission(submissionId);

      console.log(
        `Worker] Submission ${submissionId} judged: ${result.verdict}`
      );
    } catch (err) {
      console.error(`[Worker] Error processing submission ${submissionId}:`, err);
    }
  });
}

startWorker();

import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import { judgeSubmission } from "./src/services/judgeSubmission.js";

dotenv.config();
connectDB();

process.on("unhandledRejection", (err) => {
  console.error("[Worker] Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("[Worker] Uncaught Exception:", err);
});

async function startWorker() {
  const channel = await connectRabbitMQ();
  const queueName = "submissionQueue";

  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  console.log(`[Worker] Listening for jobs on ${queueName}…`);

  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) return;

      const content = msg.content.toString();
      let submissionId;

      try {
        const job = JSON.parse(content);
        submissionId = job.submissionId;

        if (!submissionId) throw new Error("Invalid job: Missing submissionId");

        console.log(`[Worker] Processing submission ${submissionId}`);
        const result = await judgeSubmission(submissionId);

        console.log(
          `[Worker] Submission ${submissionId} judged: ${result.verdict}`
        );
        channel.ack(msg);

      } catch (err) {
        console.error(
          `[Worker] Failed to process submission ${
            submissionId || "unknown"
          }:`,
          err
        );
        try {
          channel.nack(msg, false, false); // discard bad job
        } catch (nackErr) {
          console.error(`[Worker] Failed to nack message:`, nackErr);
        }
      }
    },
    { noAck: false }
  );
}

startWorker().catch((err) => {
  console.error("[Worker] Fatal error:", err);
  process.exit(1);
});

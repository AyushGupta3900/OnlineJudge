import { AppError } from "./AppError.js";
import { getRabbitChannel } from "../config/rabbitmq.js";

export const publishToQueue = async (queue, message) => {
  const channel = getRabbitChannel();

  try {
    await channel.assertQueue(queue, { durable: true });
    const sent = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    if (!sent) {
      throw new AppError("Failed to publish message to queue", 500);
    }
  } catch (err) {
    throw new AppError(`Failed to publish to queue: ${queue}`, 500);
  }
};

export const consumeFromQueue = async (queue, onMessage) => {
  const channel = getRabbitChannel();

  try {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        try {
          await onMessage(content);
          channel.ack(msg);
        } catch (err) {
          console.error("Worker processing error:", err);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (err) {
    throw new AppError(`Failed to consume from queue: ${queue}`, 500);
  }
};

import { AppError } from "./AppError.js";
import { getRabbitChannel } from "../utils/config/rabbitmq.js";

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
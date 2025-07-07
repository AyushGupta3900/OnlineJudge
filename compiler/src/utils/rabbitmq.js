import { getRabbitChannel } from "../config/rabbitmq.js";

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
    throw new Error(`Failed to consume from queue: ${queue}`, 500);
  }
};
import amqplib from "amqplib";
import { AppError } from "../../utils/AppError.js";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    return channel;
  } catch (err) {
    console.error("Error in connecting to RabbitMQ", err);
    throw new AppError("Failed to connect to RabbitMQ", 500);
  }
};

export const getRabbitChannel = () => {
  if (!channel) {
    throw new AppError("RabbitMQ channel not initialized", 500);
  }
  return channel;
};

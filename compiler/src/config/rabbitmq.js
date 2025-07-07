import amqplib from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    return channel;
  } catch (err) {
    console.error("Error in connecting to RabbitMQ", err);
    throw new Error("Failed to connect to RabbitMQ", 500);
  }
};

export const getRabbitChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized", 500);
  }
  return channel;
};

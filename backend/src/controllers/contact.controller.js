import ContactMessage from "../models/ContactMessage.js";

export async function sendContactMessage(req, res){
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = await ContactMessage.create({ name, email, message });
    console.log(newMessage)
    res.status(201).json({
      message: "Your message has been received. We'll get back to you soon!",
      data: newMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message." });
  }
};

export async function getContactMessages(req, res){
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};
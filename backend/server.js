// importing packages
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// importing routes 
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import problemRoutes from "./src/routes/problem.routes.js"
import submissionRoutes from "./src/routes/submission.routes.js"
import contactRoutes from "./src/routes/contact.routes.js";

import {connectDB} from "./src/utils/config/db.js"
import {connectRabbitMQ} from "./src/utils/config/rabbitmq.js"
import {redisClient} from "./src/utils/config/redisClient.js"
import { globalErrorHandler } from "./src/middlewares/error.middleware.js";

// configuring .env
dotenv.config();

// connecting to DB 
connectDB();

// Connect to Redis
redisClient.on("ready", () => console.log("Redis is connected"));

// Connect to RabbitMQ
connectRabbitMQ();

const app = express();
const PORT = process.env.PORT || 5000; 

// middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(
    {
        origin: process.env.ORIGIN_URL,
        methods: ['GET','POST','PUT','PATCH','DELETE'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true,
    }
));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("This server is working");
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/problem",problemRoutes);
app.use("/api/v1/submission",submissionRoutes);
app.use("/api/v1/contact", contactRoutes);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

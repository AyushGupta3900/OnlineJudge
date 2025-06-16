import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import {connectDB} from "./utils/db.js"

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5002; 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(
    {
        origin: "http://localhost:5174",
        methods: ['GET','POST','PUT','PATCH','DELETE'],
        credentials: true,
    }
));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>")
})

app.use("/api/v1/auth",authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

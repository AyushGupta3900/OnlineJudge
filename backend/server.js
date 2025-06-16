import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002; 

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

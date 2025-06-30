import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003; 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(
    {
        origin: "http://localhost:5174",
        methods: ['GET','POST','PUT','PATCH','DELETE'],
        credentials: true,
    }
));

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>")
})

// app.use("/api/v1/",);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

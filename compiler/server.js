import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateFile } from "./generateFile.js";
import { executeCpp } from "./excecuteCpp.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003; 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(
    {
        origin: process.env.ORIGIN_URL,
        methods: ['GET','POST','PUT','PATCH','DELETE'],
        credentials: true,
    }
));

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>")
})

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Empty Code Body",
    });
  }

  try {
    const filePath = await generateFile(language, code);
    const output = await executeCpp(filePath, input); 
    res.status(200).json({
      success: true,
      output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error?.stderr || error?.error || "Something went wrong",
    });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
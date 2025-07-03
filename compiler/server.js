import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateFile } from "./src/utils/generateFile.js";
import { executeCpp } from "./src/utils/executeCpp.js";
import { executePython } from "./src/utils/executePython.js";
import { executeJava } from "./src/utils/executeJava.js";
import { executeJs } from "./src/utils/executeJS.js";
import { connectDB } from "./src/utils/db.js";
import compileRoutes from "./src/routes/compile.routes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ORIGIN_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

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
    let result;
    switch (language) {
      case "cpp":
        result = await executeCpp(filePath, input);
        break;
      case "python":
        result = await executePython(filePath, input);
        break;
      case "java":
        result = await executeJava(filePath, input);
        break;
      case "javascript":
        result = await executeJs(filePath, input);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Unsupported language",
        });
    }

    return res.status(200).json({
      success: true,
      output: result.output,
      timeMs: result.timeMs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.stderr || error?.error || "Something went wrong",
      type: error?.type || "unknown",
      timeMs: error?.timeMs || null,
    });
  }
});

app.use("/api/compile", compileRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

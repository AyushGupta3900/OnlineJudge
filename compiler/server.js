import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateFile } from "./src/utils/generateFile.js";
import { compileCpp, runCpp, cleanCppBinary } from "./src/utils/executeCode/executeCpp.js";
import { compileJava, runJava, cleanJavaClassFiles } from "./src/utils/executeCode/executeJava.js";
import { executePython } from "./src/utils/executeCode/executePython.js";
import { executeJs } from "./src/utils/executeCode/executeJS.js";
import { connectDB } from "./src/config/db.js";
import fs from "fs/promises";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials: true,
  methods: ['GET', 'POST'],
}));

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.post("/api/v1/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Empty Code Body",
    });
  }

  let filePath;
  let cleanupFn = null;

  try {
    filePath = await generateFile(language, code);

    let result;
    switch (language) {
      case "cpp": {
        const binaryPath = await compileCpp(filePath);
        result = await runCpp(binaryPath, input);
        cleanupFn = () => cleanCppBinary(binaryPath);
        break;
      }
      case "java": {
        const { className, classDir } = await compileJava(filePath);
        result = await runJava(classDir, className, input);
        cleanupFn = () => cleanJavaClassFiles(classDir);
        break;
      }
      case "python": {
        result = await executePython(filePath, input);
        break;
      }
      case "javascript": {
        result = await executeJs(filePath, input);
        break;
      }
      default: {
        return res.status(400).json({
          success: false,
          error: "Unsupported language",
        });
      }
    }

    return res.status(200).json({
      success: true,
      output: result.output,
      timeMs: result.timeMs,
      memoryKb: result.memoryKb,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.stderr || error?.error || "Something went wrong",
      type: error?.type || "unknown",
      timeMs: error?.timeMs || null,
      memoryKb: error?.memoryKb || null,
    });
  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log(`Deleted source file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete source file: ${filePath}`, err);
      }
    }

    if (cleanupFn) {
      try {
        await cleanupFn();
      } catch (err) {
        console.error(`Cleanup failed:`, err);
      }
    }
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Compiler Server is running at http://0.0.0.0:${PORT}`);
});

import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

import { executeCpp } from "./executeCpp.js";
import { executePython } from "./executePython.js";
import { executeJava } from "./executeJava.js";
import { executeJs } from "./executeJS.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const codeDir = path.join(__dirname, "codes");

const extensionMap = {
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
};

const executorMap = {
  cpp: executeCpp,
  python: executePython,
  java: executeJava,
  javascript: executeJs,
};

export async function runCodeAgainstTestCases({ code, testCases, language }) {
  const ext = extensionMap[language];
  const jobId = uuid();
  const codeFile = path.join(codeDir, `${jobId}.${ext}`);

  try {
    await fs.mkdir(codeDir, { recursive: true });
    await fs.writeFile(codeFile, code);

    const execute = executorMap[language];
    if (!execute) throw new Error(`Unsupported language: ${language}`);

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      let output;

      try {
        output = await execute(codeFile, test.input);
      } catch (err) {
        if (err.type === "compile") {
          return {
            verdict: "Compilation Error",
            error: err.stderr || err.error,
            testCase: i + 1,
          };
        }
        if (err.type === "timeout") {
          return {
            verdict: "Time Limit Exceeded",
            testCase: i + 1,
          };
        }
        return {
          verdict: "Runtime Error",
          error: err.stderr || err.error,
          testCase: i + 1,
        };
      }

      if (output.trim() !== test.output.trim()) {
        return {
          verdict: "Wrong Answer",
          testCase: i + 1,
          expected: test.output.trim(),
          received: output.trim(),
        };
      }
    }

    return {
      verdict: "Accepted",
      totalTestCases: testCases.length,
    };

  } catch (err) {
    return {
      verdict: "Internal Error",
      error: err.message || "Something went wrong while running test cases.",
    };
  } finally {
    try {
      await fs.unlink(codeFile);
    } catch (_) {}
  }
}

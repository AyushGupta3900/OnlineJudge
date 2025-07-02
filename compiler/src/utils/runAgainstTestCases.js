import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { executeCpp } from "./excecuteCpp.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const codeDir = path.join(__dirname, "codes");

export async function runCodeAgainstTestCases({ code, testCases, timeLimit = 2 }) {
  const jobId = uuid();
  const codeFile = path.join(codeDir, `${jobId}.cpp`);

  try {
    await fs.mkdir(codeDir, { recursive: true });

    await fs.writeFile(codeFile, code);

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      let output;

      try {
        output = await executeCpp(codeFile, test.input);
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
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
export async function runCodeAgainstTestCases({
  code,
  testCases,
  language,
  timeLimit = 1,
  memoryLimit = 256,
}) {
  const ext = extensionMap[language];
  const jobId = uuid();
  const codeFile = path.join(codeDir, `${jobId}.${ext}`);

  const timeLimitMs = timeLimit * 1000;
  const memoryLimitKb = memoryLimit * 1024;

  try {
    await fs.mkdir(codeDir, { recursive: true });
    await fs.writeFile(codeFile, code);

    const execute = executorMap[language];
    if (!execute) throw new Error(`Unsupported language: ${language}`);

    let totalTimeMs = 0;
    let totalMemoryKb = 0;
    let passedTestCases = 0;
    const testCaseResults = [];
    let wrongAnswer = false;

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];

      try {
        const result = await execute(codeFile, test.input);

        totalTimeMs += Number(result.timeMs || 0);
        if (result.memoryKb != null) {
          totalMemoryKb += Number(result.memoryKb);
        }

        const expected = test.output.trim();
        const actual = result.output.trim();
        const passed = expected === actual;

        if (passed) passedTestCases++;
        else wrongAnswer = true;

        testCaseResults.push({
          testCase: i + 1,
          input: test.input,
          expectedOutput: expected,
          actualOutput: actual,
          executionTimeMs: result.timeMs?.toFixed(2) || "0.00",
          memoryKb: result.memoryKb ?? null,
          status: passed ? "Passed" : "Failed",
        });

      } catch (err) {
        testCaseResults.push({
          testCase: i + 1,
          input: test.input,
          expectedOutput: test.output.trim(),
          actualOutput: "",
          executionTimeMs: "0.00",
          memoryKb: null,
          status: "Error",
          error: err.stderr || err.error,
        });

        const baseErrorResult = {
          executionTime: totalTimeMs.toFixed(2),
          memoryUsed: totalMemoryKb || null,
          passedTestCases,
          output: "",
          error: err.stderr || err.error,
          testCaseResults,
        };

        if (err.type === "compile") {
          return { verdict: "Compilation Error", ...baseErrorResult };
        }

        if (err.type === "timeout") {
          return {
            verdict: "Time Limit Exceeded",
            ...baseErrorResult,
            error: "Time Limit Exceeded",
          };
        }

        return { verdict: "Runtime Error", ...baseErrorResult };
      }
    }

    // 🔷 Check limits after running all test cases
    if (totalTimeMs > timeLimitMs) {
      return {
        verdict: "Time Limit Exceeded",
        executionTime: totalTimeMs.toFixed(2),
        memoryUsed: totalMemoryKb || null,
        passedTestCases,
        output: "",
        error: "Time Limit Exceeded",
        testCaseResults,
      };
    }

    if (totalMemoryKb > memoryLimitKb) {
      return {
        verdict: "Memory Limit Exceeded",
        executionTime: totalTimeMs.toFixed(2),
        memoryUsed: totalMemoryKb || null,
        passedTestCases,
        output: "",
        error: "Memory Limit Exceeded",
        testCaseResults,
      };
    }

    if (wrongAnswer) {
      return {
        verdict: "Wrong Answer",
        executionTime: totalTimeMs.toFixed(2),
        memoryUsed: totalMemoryKb || null,
        passedTestCases,
        output: "",
        error: "",
        testCaseResults,
      };
    }

    return {
      verdict: "Accepted",
      executionTime: totalTimeMs.toFixed(2),
      memoryUsed: totalMemoryKb || null,
      passedTestCases,
      output: testCaseResults.map(tc => tc.actualOutput).join("\n"),
      error: "",
      testCaseResults,
    };

  } catch (err) {
    return {
      verdict: "Internal Error",
      executionTime: 0,
      memoryUsed: null,
      passedTestCases: 0,
      output: "",
      error: err.message || "Something went wrong while running test cases.",
      testCaseResults: [],
    };
  } finally {
    try {
      await fs.unlink(codeFile);
    } catch (_) {}
  }
}

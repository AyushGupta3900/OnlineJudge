import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

import { executeCpp } from "./executeCode/executeCpp.js";
import { executePython } from "./executeCode/executePython.js";
import { executeJava } from "./executeCode/executeJava.js";
import { executeJs } from "./executeCode/executeJS.js";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to save temporary code files
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

/**
 * Run user-submitted code against provided test cases.
 */
export async function runCodeAgainstTestCases({
  code,
  testCases,
  language,
  timeLimit = 1,
  memoryLimit = 256,
}) {
  const ext = extensionMap[language];
  if (!ext) {
    return {
      verdict: "Internal Error",
      executionTime: 0,
      memoryUsed: null,
      passedTestCases: 0,
      output: "",
      error: `Unsupported language: ${language}`,
      testCaseResults: [],
    };
  }

  const jobId = uuid();
  const codeFile = path.join(codeDir, `${jobId}.${ext}`);

  const timeLimitMs = timeLimit * 1000;
  const memoryLimitKb = memoryLimit * 1024;

  try {
    // Ensure temp directory exists
    await fs.mkdir(codeDir, { recursive: true });

    // writing code into the codefile
    await fs.writeFile(codeFile, code);

    const execute = executorMap[language];
    if (!execute) throw new Error(`No executor defined for: ${language}`);

    let totalTimeMs = 0;
    let totalMemoryKb = 0;
    let passedTestCases = 0;
    let wrongAnswer = false;

    const testCaseResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];

      try {
        const result = await execute(codeFile, test.input);

        const timeMs = Number(result.timeMs || 0);
        const memoryKb = result.memoryKb != null ? Number(result.memoryKb) : 0;

        totalTimeMs += timeMs;
        totalMemoryKb += memoryKb;

        const expected = test.output.trim();
        const actual = result.output.trim();
        const passed = expected === actual;

        if (passed) passedTestCases++;
        else wrongAnswer = true;

        const thisTestCaseResult = {
          testCase: i + 1,
          input: test.input,
          expectedOutput: expected,
          actualOutput: actual,
          executionTimeMs: timeMs.toFixed(2),
          memoryKb: memoryKb || null,
          status: passed ? "Passed" : "Failed",
        };

        // Check per-test-case time limit
        if (timeMs > timeLimitMs) {
          thisTestCaseResult.status = "Time Limit Exceeded";
          testCaseResults.push(thisTestCaseResult);
          return {
            verdict: "Time Limit Exceeded",
            executionTime: timeMs.toFixed(2),
            memoryUsed: memoryKb || null,
            passedTestCases,
            output: "",
            error: `Test case ${i + 1} exceeded time limit`,
            testCaseResults,
          };
        }

        // Check per-test-case memory limit
        if (memoryKb > memoryLimitKb) {
          thisTestCaseResult.status = "Memory Limit Exceeded";
          testCaseResults.push(thisTestCaseResult);
          return {
            verdict: "Memory Limit Exceeded",
            executionTime: timeMs.toFixed(2),
            memoryUsed: memoryKb || null,
            passedTestCases,
            output: "",
            error: `Test case ${i + 1} exceeded memory limit`,
            testCaseResults,
          };
        }

        testCaseResults.push(thisTestCaseResult);

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
      output: testCaseResults.map((tc) => tc.actualOutput).join("\n"),
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
      console.log(`🧹 Deleted code file: ${codeFile}`);
    } catch (err) {
      console.warn(`⚠️ Could not delete code file: ${codeFile} (${err.message})`);
    }
  }
}

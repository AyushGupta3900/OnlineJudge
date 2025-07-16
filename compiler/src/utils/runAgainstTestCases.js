import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

import { compileCpp, runCpp, cleanCppBinary } from "./executeCode/executeCpp.js";
import { compileJava, runJava, cleanJavaClassFiles } from "./executeCode/executeJava.js";
import { executePython } from "./executeCode/executePython.js";
import { executeJs } from "./executeCode/executeJS.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const codeDir = path.join(__dirname, "codes");

await fs.mkdir(codeDir, { recursive: true });

const extensionMap = {
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
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

  if (!ext) return errorResponse("Runtime Error", `Unsupported language: ${language}`, testCases.length);

  const codeFile =
    language === "java"
      ? path.join(codeDir, "Main.java")
      : path.join(codeDir, `${jobId}.${ext}`);

  const timeLimitMs = timeLimit * 1000;
  const memoryLimitKb = memoryLimit * 1024;

  let compiledArtifact = null;
  let passedTestCases = 0;
  let totalTimeMs = 0;
  let totalMemoryKb = 0;

  const testCaseResults = [];

  try {
    const finalCode =
      language === "java"
        ? code.replace(/public\s+class\s+\w+/, "public class Main")
        : code;

    await fs.writeFile(codeFile, finalCode);

    const executeFn = await getExecutor(language, codeFile);

    for (let i = 0; i < testCases.length; i++) {
      const { input, output: expectedOutput = "" } = testCases[i];
      const expected = expectedOutput.trim();

      const result = {
        testCase: i + 1,
        input,
        expectedOutput: expected,
        actualOutput: "",
        executionTimeMs: 0,
        memoryKb: null,
        status: "Error",
        error: "",
      };

      try {
        const { output, timeMs = 0, memoryKb = 0 } = await executeFn(input);
        const actual = (output || "").trim();
        const passed = actual === expected;

        result.actualOutput = actual;
        result.executionTimeMs = timeMs.toFixed(2);
        result.memoryKb = memoryKb;
        result.status = passed ? "Passed" : "Failed";

        totalTimeMs += timeMs;
        totalMemoryKb += memoryKb;

        if (passed) passedTestCases++;

        if (timeMs > timeLimitMs) {
          result.status = "Time Limit Exceeded";
          return earlyExit("Time Limit Exceeded", `Test case ${i + 1} exceeded time limit`, [...testCaseResults, result]);
        }

        if (memoryKb > memoryLimitKb) {
          result.status = "Memory Limit Exceeded";
          return earlyExit("Memory Limit Exceeded", `Test case ${i + 1} exceeded memory limit`, [...testCaseResults, result]);
        }

      } catch (err) {
        result.error = err.stderr || err.error || "Unknown error";
        result.status =
          err.type === "timeout"
            ? "Time Limit Exceeded"
            : err.type === "compile"
            ? "Compilation Error"
            : "Runtime Error";

        return earlyExit(result.status, result.error, [...testCaseResults, result]);
      }

      testCaseResults.push(result);
    }

    const verdict = passedTestCases === testCases.length ? "Accepted" : "Wrong Answer";

    return {
      verdict,
      executionTime: totalTimeMs.toFixed(2),
      memoryUsed: totalMemoryKb,
      passedTestCases,
      totalTestCases: testCases.length,
      output: testCaseResults.map(tc => tc.actualOutput).join("\n"),
      error: "",
      testCaseResults,
    };

  } catch (err) {
    if (err.verdict) {
      return errorResponse(err.verdict, err.error || err.message || "Failed", testCases.length);
    }
    return errorResponse("Runtime Error", err.message || "Something went wrong.", testCases.length);
  } finally {
    await safeCleanup(codeFile, language, compiledArtifact);
  }

  async function getExecutor(lang, filePath) {
    if (lang === "cpp") {
      const binary = await compileCpp(filePath).catch(err => {
        if (err.type === "compile") throw { verdict: "Compilation Error", error: err.stderr || err.error };
        throw err;
      });
      compiledArtifact = binary;
      return input => runCpp(binary, input, timeLimitMs);
    }
    if (lang === "java") {
      const { classDir, className } = await compileJava(filePath).catch(err => {
        if (err.type === "compile") throw { verdict: "Compilation Error", error: err.stderr || err.error };
        throw err;
      });
      compiledArtifact = classDir;
      return input => runJava(classDir, className, input, timeLimitMs);
    }
    if (lang === "python") return input => executePython(filePath, input, timeLimitMs);
    if (lang === "javascript") return input => executeJs(filePath, input, timeLimitMs);
  }

  function earlyExit(verdict, error, results) {
    return {
      verdict,
      executionTime: totalTimeMs.toFixed(2),
      memoryUsed: totalMemoryKb,
      passedTestCases,
      totalTestCases: testCases.length,
      output: "",
      error,
      testCaseResults: results,
    };
  }

  function errorResponse(verdict, error, totalTestCases) {
    return {
      verdict,
      executionTime: 0,
      memoryUsed: null,
      passedTestCases: 0,
      totalTestCases,
      output: "",
      error,
      testCaseResults: [],
    };
  }

  async function safeCleanup(codeFile, lang, artifact) {
    const tasks = [];
    if (codeFile) tasks.push(fs.unlink(codeFile).catch(() => {}));
    if (artifact) {
      if (lang === "cpp" && typeof cleanCppBinary === "function") {
        tasks.push(Promise.resolve(cleanCppBinary(artifact)).catch(() => {}));
      }
      if (lang === "java" && typeof cleanJavaClassFiles === "function") {
        tasks.push(Promise.resolve(cleanJavaClassFiles(artifact)).catch(() => {}));
      }
    }
    await Promise.allSettled(tasks);
  }
}

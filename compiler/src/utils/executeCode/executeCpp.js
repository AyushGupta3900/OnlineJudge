import { exec, spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "../outputs");
await fs.mkdir(outputPath, { recursive: true });

// const GNU_TIME = "/opt/homebrew/bin/gtime";
const GNU_TIME = "/usr/bin/time";

export const compileCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const binaryPath = path.join(outputPath, jobId);

  return new Promise((resolve, reject) => {
    const compileCommand = `g++ -std=c++17 "${filepath}" -o "${binaryPath}"`;
    exec(compileCommand, (err, _, stderr) => {
      if (err) {
        reject({ type: "compile", error: err.message, stderr: stderr.trim() });
      } else {
        resolve(binaryPath);
      }
    });
  });
};

export const runCpp = (binaryPath, input = "", timeoutMs = 5000) => {
  const memFile = path.join(outputPath, `mem_${Date.now()}.txt`);

  return new Promise((resolve, reject) => {
    let settled = false;
    const startTime = process.hrtime();

    const child = spawn(
      GNU_TIME,
      ["-f", "%M", "-o", memFile, binaryPath],
      { cwd: outputPath }
    );

    let stdout = "", stderr = "";

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill("SIGKILL");
        reject({ type: "timeout", error: "Execution timed out." });
      }
    }, timeoutMs);

    child.stdout.on("data", (data) => { stdout += data.toString(); });
    child.stderr.on("data", (data) => { stderr += data.toString(); });

    if (input) child.stdin.write(input);
    child.stdin.end();

    child.on("close", async (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      const [sec, ns] = process.hrtime(startTime);
      const elapsedMs = sec * 1000 + ns / 1e6;

      let memoryKb = null;
      try {
        const memData = await fs.readFile(memFile, "utf8");
        memoryKb = parseInt(memData.trim(), 10);
      } catch { memoryKb = null; }

      await fs.unlink(memFile).catch(() => {});

      if (signal === "SIGKILL" || code !== 0) {
        reject({
          type: signal === "SIGKILL" ? "timeout" : "runtime",
          code,
          stderr: stderr.trim() || (signal === "SIGKILL" ? "Execution timed out." : ""),
          timeMs: elapsedMs,
          memoryKb,
        });
      } else {
        resolve({ output: stdout.trim(), timeMs: elapsedMs, memoryKb });
      }
    });

    child.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject({ type: "spawn", error: err.message });
      }
    });
  });
};

export const cleanCppBinary = async (binaryPath) => {
  await fs.unlink(binaryPath).catch(() => {});
};

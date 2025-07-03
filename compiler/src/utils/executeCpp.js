import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const GNU_TIME = "/opt/homebrew/bin/gtime"; // adjust if needed

export const executeCpp = (filepath, input = "") => {
  const jobId = path.basename(filepath).split(".")[0];
  const binaryPath = path.join(outputPath, jobId);
  const memFile = path.join(outputPath, `mem_${Date.now()}.txt`);

  return new Promise((resolve, reject) => {
    const compileCommand = `g++ -std=c++17 "${filepath}" -o "${binaryPath}"`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({
          type: "compile",
          error: compileErr.message,
          stderr: compileStderr,
        });
      }

      const startTime = process.hrtime();

      const child = spawn(
        GNU_TIME,
        ["-f", "%M", "-o", memFile, binaryPath],
        { cwd: outputPath }
      );

      let stdout = "";
      let stderr = "";

      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        return reject({
          type: "timeout",
          error: "Execution timed out.",
        });
      }, 5000);

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      if (input) {
        child.stdin.write(input);
      }
      child.stdin.end();

      child.on("close", (code) => {
        clearTimeout(timeout);

        const [sec, nanosec] = process.hrtime(startTime);
        const elapsedMs = sec * 1000 + nanosec / 1e6;

        fs.readFile(memFile, "utf8", (err, memData) => {
          fs.unlink(memFile, () => {}); // cleanup

          const memoryKb = err ? null : parseInt(memData.trim(), 10);

          if (code !== 0) {
            return reject({
              type: "runtime",
              code,
              stderr,
              timeMs: elapsedMs,
              memoryKb,
            });
          }

          return resolve({
            output: stdout,
            timeMs: elapsedMs,
            memoryKb,
          });
        });
      });

      child.on("error", (err) => {
        clearTimeout(timeout);
        return reject({
          type: "spawn",
          error: err.message,
        });
      });
    });
  });
};

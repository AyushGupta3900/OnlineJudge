import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const GNU_TIME = "/usr/bin/time";

export const executePython = (filepath, input = "") => {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();

    const memFile = path.join(outputPath, `mem_${Date.now()}.txt`);

    const child = spawn(
      GNU_TIME,
      ["-f", "%M", "-o", memFile, "python3", filepath],
      { cwd: outputPath }
    );

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      return reject({ type: "timeout", error: "Execution timed out." });
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
        console.log(memoryKb)
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
      return reject({ type: "spawn", error: err.message });
    });
  });
};

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export const executeJava = (filepath, input = "") => {
  return new Promise((resolve, reject) => {
    const child = spawn("java", [filepath], { cwd: outputPath });

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
      if (code !== 0) {
        return reject({ type: "runtime", code, stderr });
      }
      return resolve(stdout);
    });

    child.on("error", (err) => {
      clearTimeout(timeout);
      return reject({ type: "spawn", error: err.message });
    });
  });
};

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

export const executeCpp = (filepath, input = "") => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, jobId);

  return new Promise((resolve, reject) => {
    // Compile the C++ file
    const compileCommand = `g++ -std=c++17 "${filepath}" -o "${outPath}"`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({ type: "compile", error: compileErr.message, stderr: compileStderr });
      }

      // Spawn the process to run the program
      const child = spawn(outPath, [], { cwd: outputPath });

      let stdout = "";
      let stderr = "";

      // Timeout safeguard (e.g. 5 seconds)
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        return reject({ type: "timeout", error: "Execution timed out." });
      }, 5000);

      // Capture output
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      // Feed stdin if any
      if (input) {
        child.stdin.write(input);
      }
      child.stdin.end();

      // Resolve when done
      child.on("close", (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          return reject({ type: "runtime", code, stderr });
        }
        return resolve(stdout);
      });
    });
  });
};

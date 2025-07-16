import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";

// adjust to your system:
// const GNU_TIME = "/opt/homebrew/bin/gtime";
const GNU_TIME = "/usr/bin/time";

export const compileJava = (filepath) => {
  const classDir = path.dirname(filepath);
  const fileName = path.basename(filepath);
  const className = fileName.replace(".java", "");
  return new Promise((resolve, reject) => {
    exec(`javac "${filepath}"`, (err, _, stderr) => {
      if (err) {
        reject({ type: "compile", error: err.message, stderr });
      } else {
        resolve({ className, classDir });
      }
    });
  });
};

export const runJava = (classDir, className, input = "", timeoutMs = 5000) => {
  const memFile = path.join(classDir, `mem_${Date.now()}.txt`);

  return new Promise((resolve, reject) => {
    let settled = false;
    const startTime = process.hrtime();

    const child = spawn(
      GNU_TIME,
      ["-f", "%M", "-o", memFile, "java", "-cp", ".", className],
      { cwd: classDir }
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

    child.on("close", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      const [s, ns] = process.hrtime(startTime);
      const elapsedMs = s * 1000 + ns / 1e6;

      fs.readFile(memFile, "utf8", (err, memData) => {
        fs.unlink(memFile, () => {});
        const memoryKb = err ? null : parseInt(memData.trim(), 10);

        if (stderr.trim()) {
          reject({ type: "runtime", stderr, timeMs: elapsedMs, memoryKb });
        } else {
          resolve({ output: stdout.trim(), timeMs: elapsedMs, memoryKb });
        }
      });
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

export const cleanJavaClassFiles = (classDir) => {
  fs.readdir(classDir, (err, files) => {
    if (err) return;
    files.filter(f => f.endsWith(".class")).forEach(f =>
      fs.unlink(path.join(classDir, f), () => {})
    );
  });
};

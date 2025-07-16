import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const codeDir = path.join(__dirname, "codes");
await fs.mkdir(codeDir, { recursive: true });

const extensions = {
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
};

export const generateFile = async (language, code) => {
  const ext = extensions[language];
  if (!ext) throw new Error("Unsupported language");

  let filename;

  if (language === "java") {
    filename = `Main.java`; 
  } else {
    filename = `${uuid()}.${ext}`;
  }

  const filepath = path.join(codeDir, filename);
  await fs.writeFile(filepath, code);
  return filepath;
};

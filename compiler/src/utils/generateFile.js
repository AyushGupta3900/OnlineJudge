import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

export const generateFile = (format, content) => {
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
};

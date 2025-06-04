import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadModels = async () => {
  const modelsPath = path.join(__dirname, "./");
  const files = fs.readdirSync(modelsPath);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const fileUrl = pathToFileURL(path.join(modelsPath, file)).href;
      await import(fileUrl); // ✅ Dynamically import as ESM module
    }
  }
};

export default loadModels;

import { access, copyFile } from "node:fs/promises";
import { constants } from "node:fs";

const source = new URL("../amplify_outputs.json", import.meta.url);
const destination = new URL("../dist/amplify_outputs.json", import.meta.url);

// Local builds can run without cloud outputs; deployed builds copy them into dist.
try {
  await access(source, constants.R_OK);
} catch (error) {
  if (error.code === "ENOENT") {
    process.exit(0);
  }
  throw error;
}

await copyFile(source, destination);

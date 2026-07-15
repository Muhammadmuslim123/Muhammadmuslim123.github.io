import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const forbidden = ["—", "–", "Matrix rain", "fake XP", "OSCP certified", "production SOC"];
const files = [];

for await (const file of glob(["index.html", "src/**/*.{js,jsx,css}"])) {
  files.push(file);
}

let failed = false;

for (const file of files) {
  const contents = await readFile(file, "utf8");
  for (const value of forbidden) {
    if (contents.includes(value)) {
      console.error(`${file}: forbidden text found: ${value}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`Content check passed across ${files.length} files.`);

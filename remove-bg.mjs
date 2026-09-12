// remove-bg.mjs
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const inputPath = process.argv[2] ?? "src/assets/rai-1.png";
const outputPath = process.argv[3] ?? "src/assets/rai-1-nobg.png";

const blob = await removeBackground(inputPath);
const buffer = Buffer.from(await blob.arrayBuffer());
await writeFile(outputPath, buffer);
console.log(`Salvo em ${outputPath}`);
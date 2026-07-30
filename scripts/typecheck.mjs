import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { BIRTHDAY_CONFIG as c } from "../config/birthday-config.js";

const errors = [];
const isText = (value) => typeof value === "string" && value.trim().length > 0;
if (!isText(c.recipient?.name)) errors.push("recipient.name must be non-empty text");
if (!Number.isInteger(c.recipient?.age) || c.recipient.age < 1 || c.recipient.age > 120) errors.push("recipient.age must be an integer 1-120");
if (!isText(c.recipient?.birthdayLabel)) errors.push("recipient.birthdayLabel must be non-empty text");
if (!isText(c.from?.name)) errors.push("from.name must be non-empty text");
if (!Array.isArray(c.memories) || c.memories.length < 3 || c.memories.length > 8) errors.push("memories must contain 3-8 items");
if (!Array.isArray(c.reasons) || c.reasons.length !== 4) errors.push("reasons must contain exactly 4 items for the designed grid");
if (!Array.isArray(c.stats) || c.stats.length !== 3) errors.push("stats must contain exactly 3 items");
if (!Array.isArray(c.copy?.letter) || c.copy.letter.length < 2) errors.push("copy.letter must contain at least 2 paragraphs");

const assetPaths = [c.media?.heroPhoto, c.media?.finalPhoto, c.media?.music, ...c.memories.map((m) => m.src)].filter(Boolean);
for (const relative of assetPaths) {
  try { await access(path.join(process.cwd(), relative)); }
  catch { errors.push(`Missing configured asset: ${relative}`); }
}

for (const [index, memory] of c.memories.entries()) {
  if (!isText(memory.caption) || !isText(memory.note) || !isText(memory.src)) errors.push(`memory ${index + 1} is missing src/caption/note`);
}

if (errors.length) {
  console.error(`Configuration contract failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("Type/data contract passed: birthday configuration and required media paths are valid.");

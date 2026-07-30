import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignored = new Set(["dist", ".git", "node_modules"]);
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.push(full);
  }
}
await walk(root);

let failures = 0;
for (const file of files.filter((file) => /\.(m?js)$/.test(file))) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) { failures += 1; console.error(result.stderr || result.stdout); }
}

for (const file of files.filter((file) => file.endsWith(".css"))) {
  const css = await readFile(file, "utf8");
  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  if (open !== close) { failures += 1; console.error(`${path.relative(root,file)}: unbalanced CSS braces (${open}/${close})`); }
}

for (const file of files.filter((file) => file.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  if (!/<!doctype html>/i.test(html) || !/<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
    failures += 1; console.error(`${path.relative(root,file)}: incomplete HTML document`);
  }
}

const forbidden = ["TODO", "FIXME", "javascript:"];
for (const file of files.filter((file) => /\.(html|css|m?js)$/.test(file) && path.basename(file) !== "lint.mjs")) {
  const text = await readFile(file, "utf8");
  for (const token of forbidden) if (text.includes(token)) { failures += 1; console.error(`${path.relative(root,file)}: contains forbidden marker ${token}`); }
}

if (failures) process.exit(1);
console.log(`Lint passed: ${files.length} project files scanned; JS syntax, CSS balance, HTML shells and forbidden markers are clean.`);

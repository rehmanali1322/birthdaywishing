import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const out = path.join(root, "dist");
const entries = ["index.html", "styles.css", "app.js", "config", "assets", "studio"];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const entry of entries) {
  const source = path.join(root, entry);
  await stat(source);
  await cp(source, path.join(out, entry), { recursive: true });
}
console.log(`Built ${entries.length} source entries into ${path.relative(root, out)}/`);

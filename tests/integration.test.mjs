import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const html = await readFile(path.join(root, "index.html"), "utf8");
const app = await readFile(path.join(root, "app.js"), "utf8");

test("all nine story scenes exist exactly once", () => {
  for (let i = 0; i <= 8; i += 1) {
    const matches = html.match(new RegExp(`data-scene=["']${i}["']`, "g")) || [];
    assert.equal(matches.length, 1, `scene ${i} should exist once`);
  }
});

test("every simple ID selector used by app.js exists in index.html", () => {
  const ids = [...app.matchAll(/\$\(["']#([A-Za-z0-9_-]+)["']\)/g)].map((match) => match[1]);
  for (const id of new Set(ids)) assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
});

test("all declared story actions have handlers", () => {
  const actions = [...html.matchAll(/data-action=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const action of new Set(actions)) assert.ok(app.includes(`action === "${action}"`) || ["memory-prev","memory-next","replay"].includes(action), `No handler found for ${action}`);
});

test("local static image/audio references in HTML exist", async () => {
  const refs = [...html.matchAll(/(?:src|href)=["']((?:assets|config)\/[^"']+)["']/g)].map((m) => m[1]);
  for (const ref of refs) await access(path.join(root, ref));
});

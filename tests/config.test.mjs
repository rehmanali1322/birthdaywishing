import test from "node:test";
import assert from "node:assert/strict";
import { BIRTHDAY_CONFIG } from "../config/birthday-config.js";
import { mergeConfig } from "../config/runtime.js";

test("the shipped wish is configured for a first birthday", () => {
  assert.equal(BIRTHDAY_CONFIG.recipient.age, 1);
  assert.equal(BIRTHDAY_CONFIG.recipient.birthdayLabel, "1st");
});

test("birthday content stays data-driven", () => {
  const changed = mergeConfig(BIRTHDAY_CONFIG, { recipient: { name: "Zayan" }, from: { name: "Chachu" } });
  assert.equal(changed.recipient.name, "Zayan");
  assert.equal(changed.from.name, "Chachu");
  assert.equal(changed.recipient.age, 1);
});

test("memory array replacement is deterministic", () => {
  const memories = [{ src: "x", caption: "One", note: "Note", alt: "One" }];
  const changed = mergeConfig(BIRTHDAY_CONFIG, { memories });
  assert.deepEqual(changed.memories, memories);
  assert.notEqual(changed.memories, memories);
});

import { BIRTHDAY_CONFIG } from "./birthday-config.js";

const STORAGE_KEY = "little-star-studio-v2";

export function getBirthdayConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? mergeConfig(BIRTHDAY_CONFIG, saved) : structuredClone(BIRTHDAY_CONFIG);
  } catch {
    return structuredClone(BIRTHDAY_CONFIG);
  }
}

export function saveStudioTextConfig(partial) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeConfig(existing, partial)));
}

export function resetStudioConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

export function mergeConfig(base, override) {
  if (!override || typeof override !== "object") return structuredClone(base);
  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (Array.isArray(value)) output[key] = [...value];
    else if (value && typeof value === "object") output[key] = mergeConfig(base?.[key] || {}, value);
    else output[key] = value;
  }
  return output;
}

export { STORAGE_KEY };

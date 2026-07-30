import { getBirthdayConfig, saveStudioTextConfig, resetStudioConfig } from "../config/runtime.js";
import { saveMedia, clearMedia } from "../assets/media-db.js";

const config = getBirthdayConfig();
const fields = {
  name: document.querySelector("#name"),
  nickname: document.querySelector("#nickname"),
  birthdayLabel: document.querySelector("#birthdayLabel"),
  fromName: document.querySelector("#fromName"),
  introTitle: document.querySelector("#introTitle"),
  finalLine: document.querySelector("#finalLine"),
};

fields.name.value = config.recipient.name;
fields.nickname.value = config.recipient.nickname;
fields.birthdayLabel.value = config.recipient.birthdayLabel;
fields.fromName.value = config.from.name;
fields.introTitle.value = config.copy.introTitle;
fields.finalLine.value = config.copy.finalLine;

const status = document.querySelector("#mediaStatus");

document.querySelector("#saveText").addEventListener("click", () => {
  saveStudioTextConfig({
    recipient: { name: fields.name.value.trim() || config.recipient.name, nickname: fields.nickname.value.trim(), birthdayLabel: fields.birthdayLabel.value.trim() || "1st" },
    from: { name: fields.fromName.value.trim() || config.from.name },
    copy: { introTitle: fields.introTitle.value.trim() || config.copy.introTitle, finalLine: fields.finalLine.value.trim() || config.copy.finalLine },
  });
  status.textContent = "Preview text saved ✓";
});

document.querySelectorAll("[data-media-key]").forEach((input) => {
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    const isAudio = input.dataset.mediaKey === "music";
    const maxBytes = isAudio ? 12 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      status.textContent = `${file.name} is too large. ${isAudio ? "12 MB" : "5 MB"} maximum for Studio preview.`;
      input.value = "";
      return;
    }
    try {
      status.textContent = `Saving ${file.name}…`;
      await saveMedia(input.dataset.mediaKey, file);
      status.textContent = `${file.name} saved for local preview ✓`;
    } catch {
      status.textContent = "This browser could not save the file. Try Chrome/Edge or replace the file directly in the project folder.";
    }
  });
});

document.querySelector("#resetStudio").addEventListener("click", async () => {
  resetStudioConfig();
  await clearMedia();
  status.textContent = "Local Studio changes cleared. Reloading…";
  window.setTimeout(() => location.reload(), 450);
});

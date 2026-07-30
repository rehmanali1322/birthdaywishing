import { getBirthdayConfig } from "./config/runtime.js";
import { getMedia } from "./assets/media-db.js";

const state = {
  scene: 0,
  config: null,
  musicStarted: false,
  muted: false,
  memoryIndex: 0,
  openedReasons: new Set(),
  giftOpened: false,
  candleOut: false,
  letterOpened: false,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  objectUrls: [],
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pathGet = (obj, path) => path.split(".").reduce((value, key) => value?.[key], obj);

function setTheme(config) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(config.theme || {})) root.style.setProperty(`--${key}`, value);
}

function bindCopy(config) {
  $$('[data-bind]').forEach((node) => {
    const value = pathGet(config, node.dataset.bind);
    if (value !== undefined && value !== null) node.textContent = String(value);
  });
  document.title = `Happy ${config.recipient.birthdayLabel} Birthday, ${config.recipient.name}!`;
}

function makeStats(config) {
  const grid = $("#statsGrid");
  grid.innerHTML = "";
  config.stats.forEach((stat) => {
    const item = document.createElement("div");
    item.className = "stat-card";
    item.innerHTML = `<strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span>`;
    grid.append(item);
  });
}

function makeMemories(config) {
  const track = $("#memoryTrack");
  const dots = $("#memoryDots");
  track.innerHTML = "";
  dots.innerHTML = "";
  config.memories.forEach((memory, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.dataset.memory = String(index);
    card.innerHTML = `
      <div class="memory-photo-wrap">
        <img src="${escapeAttribute(memory.src)}" alt="${escapeAttribute(memory.alt || memory.caption)}" data-memory-image="${index}" />
        <span class="memory-number">0${index + 1}</span>
      </div>
      <div class="memory-copy"><span>little memory</span><h3>${escapeHtml(memory.caption)}</h3><p>${escapeHtml(memory.note)}</p></div>`;
    track.append(card);

    const dot = document.createElement("button");
    dot.className = `memory-dot${index === 0 ? " is-active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Show memory ${index + 1}`);
    dot.addEventListener("click", () => setMemory(index));
    dots.append(dot);
  });
  setMemory(0, false);
}

function makeReasons(config) {
  const grid = $("#reasonGrid");
  grid.innerHTML = "";
  config.reasons.forEach((reason, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reason-card";
    button.dataset.reason = String(index);
    button.innerHTML = `
      <span class="reason-card__front"><i>${escapeHtml(reason.icon)}</i><b>${String(index + 1).padStart(2, "0")}</b><em>tap me</em></span>
      <span class="reason-card__back"><i>${escapeHtml(reason.icon)}</i><strong>${escapeHtml(reason.title)}</strong><small>${escapeHtml(reason.text)}</small></span>`;
    button.addEventListener("click", () => openReason(button, index));
    grid.append(button);
  });
}

function makeLetter(config) {
  const holder = $("#letterCopy");
  holder.innerHTML = config.copy.letter.map((paragraph, index) => `<p${index === 0 ? ' class="letter-dear"' : ""}>${escapeHtml(paragraph)}</p>`).join("");
}

function makeRain() {
  const rain = $("#celebrationRain");
  const stickers = ["★", "✦", "●", "🎈", "✨", "☁", "◆", "🧸", "☆", "🎂"];
  rain.innerHTML = "";
  const count = state.reducedMotion ? 9 : (window.innerWidth < 600 ? 22 : 34);
  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("span");
    item.className = `rain-item rain-item--${i % 5}`;
    item.textContent = stickers[i % stickers.length];
    const left = ((i * 37) % 101) + (Math.random() * 3 - 1.5);
    const duration = 7 + ((i * 13) % 8);
    const delay = -((i * 1.83) % duration);
    item.style.setProperty("--left", `${left}%`);
    item.style.setProperty("--duration", `${duration}s`);
    item.style.setProperty("--delay", `${delay}s`);
    item.style.setProperty("--drift", `${-28 + ((i * 23) % 57)}px`);
    item.style.setProperty("--scale", String(0.62 + ((i * 17) % 40) / 100));
    item.style.setProperty("--static-top", `${5 + ((i * 19) % 88)}%`);
    rain.append(item);
  }
}

async function applyMediaOverrides(config) {
  const mappings = [
    ["heroPhoto", '[data-media="heroPhoto"]'],
    ["finalPhoto", '[data-media="finalPhoto"]'],
  ];

  for (const [key, selector] of mappings) {
    const blob = await getMedia(key);
    const node = $(selector);
    if (blob && node) {
      const url = URL.createObjectURL(blob);
      state.objectUrls.push(url);
      node.src = url;
    } else if (node && config.media[key]) node.src = config.media[key];
  }

  for (let i = 0; i < config.memories.length; i += 1) {
    const blob = await getMedia(`memory-${i}`);
    const image = $(`[data-memory-image="${i}"]`);
    if (blob && image) {
      const url = URL.createObjectURL(blob);
      state.objectUrls.push(url);
      image.src = url;
    }
  }

  const cakeBlob = await getMedia("cakeImage");
  const cakeImage = $("#customCake");
  if (cakeBlob || config.media.cakeImage) {
    const url = cakeBlob ? URL.createObjectURL(cakeBlob) : config.media.cakeImage;
    if (cakeBlob) state.objectUrls.push(url);
    cakeImage.src = url;
    cakeImage.hidden = false;
    $("#codedCake").classList.add("coded-cake--custom-cake");
  }

  const candleBlob = await getMedia("candleImage");
  const candleImage = $("#customCandle");
  if (candleBlob || config.media.candleImage) {
    const url = candleBlob ? URL.createObjectURL(candleBlob) : config.media.candleImage;
    if (candleBlob) state.objectUrls.push(url);
    candleImage.src = url;
    candleImage.hidden = false;
    $("#candleButton").classList.add("candle--custom");
  }

  const musicBlob = await getMedia("music");
  const audio = $("#birthdayAudio");
  if (musicBlob) {
    const url = URL.createObjectURL(musicBlob);
    state.objectUrls.push(url);
    audio.src = url;
  } else {
    audio.src = config.media.music;
  }
}

function installImageFallbacks() {
  $$('img').forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = "true";
      image.src = "assets/photos/hero.svg";
      image.classList.add("image-fallback");
    });
  });
}

function updateProgress(index) {
  $$(".progress-dot").forEach((dot, i) => dot.classList.toggle("is-active", i <= index));
}

function animateSceneIn(scene) {
  if (state.reducedMotion || !scene.animate) return;
  const targets = $$("h1,h2,.eyebrow,.lead,.subline,.storybook-card,.photo-stage,.stat-card,.gift-button,.cake-zone,.memory-card,.reason-card,.envelope,.final-photo-wrap,.final-copy", scene);
  targets.forEach((target, index) => {
    target.animate(
      [{ opacity: 0, transform: "translateY(22px) scale(.985)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
      { duration: 520, delay: Math.min(index * 55, 280), easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" },
    );
  });
}

function goToScene(index, { force = false } = {}) {
  const scenes = $$(".scene");
  if (!force && (index < 0 || index >= scenes.length || index === state.scene)) return;
  const current = scenes[state.scene];
  const next = scenes[index];
  current?.classList.remove("is-active");
  current?.setAttribute("aria-hidden", "true");
  next.classList.add("is-active");
  next.removeAttribute("aria-hidden");
  state.scene = index;
  updateProgress(index);
  animateSceneIn(next);
  next.focus?.({ preventScroll: true });
}

async function startExperience() {
  const audio = $("#birthdayAudio");
  if (!state.muted) {
    try {
      audio.volume = 0.55;
      await audio.play();
      state.musicStarted = true;
    } catch {
      showToast("Tap ♫ any time to start the music");
    }
  }
  goToScene(1);
}

async function toggleMusic() {
  const audio = $("#birthdayAudio");
  state.muted = !state.muted;
  audio.muted = state.muted;
  if (!state.muted && audio.paused) {
    try { await audio.play(); state.musicStarted = true; } catch { showToast("Your browser blocked audio. Tap again."); }
  }
  $("#musicIcon").textContent = state.muted ? "♪̸" : "♫";
  $("#musicButton").setAttribute("aria-label", state.muted ? "Play music" : "Mute music");
  showToast(state.muted ? "Music muted" : "Music on ✨");
}

function openGift() {
  if (state.giftOpened) return;
  state.giftOpened = true;
  const button = $("#giftButton");
  button.classList.add("is-open");
  button.disabled = true;
  const reveal = $("#giftReveal");
  reveal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => reveal.classList.add("is-visible"));
  pulseRain();
}

function blowCandle() {
  if (state.candleOut) return;
  state.candleOut = true;
  $("#candleButton").classList.add("is-out");
  $("#cakeInstruction").textContent = `Wish made for ${state.config.recipient.name} — keep it secret!`;
  $("#wishCloud").textContent = "one tiny wish, sent to the stars ★";
  $("#cakeNext").classList.remove("is-hidden");
  pulseRain(true);
}

function setMemory(index, animate = true) {
  const count = state.config?.memories?.length || 1;
  state.memoryIndex = (index + count) % count;
  const track = $("#memoryTrack");
  track.style.transform = `translate3d(${-state.memoryIndex * 100}%,0,0)`;
  if (!animate || state.reducedMotion) track.style.transition = "none";
  else track.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1)";
  $$(".memory-dot").forEach((dot, i) => dot.classList.toggle("is-active", i === state.memoryIndex));
  $$(".memory-card").forEach((card, i) => card.classList.toggle("is-current", i === state.memoryIndex));
}

function openReason(button, index) {
  button.classList.toggle("is-open");
  if (button.classList.contains("is-open")) state.openedReasons.add(index);
  if (state.openedReasons.size >= state.config.reasons.length) $("#reasonNext").classList.remove("is-hidden");
}

function openLetter() {
  if (state.letterOpened) return;
  state.letterOpened = true;
  $("#envelope").classList.add("is-open");
  const card = $("#letterCard");
  card.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => card.classList.add("is-visible"));
}

function replay() {
  state.giftOpened = false;
  state.candleOut = false;
  state.letterOpened = false;
  state.openedReasons.clear();
  $("#giftButton").classList.remove("is-open");
  $("#giftButton").disabled = false;
  $("#giftReveal").classList.remove("is-visible");
  $("#giftReveal").setAttribute("aria-hidden", "true");
  $("#candleButton").classList.remove("is-out");
  $("#cakeInstruction").textContent = "Tap the glowing candle when your tiny wish is ready.";
  $("#wishCloud").textContent = "make a little wish… ✨";
  $("#cakeNext").classList.add("is-hidden");
  $$(".reason-card").forEach((card) => card.classList.remove("is-open"));
  $("#reasonNext").classList.add("is-hidden");
  $("#envelope").classList.remove("is-open");
  $("#letterCard").classList.remove("is-visible");
  $("#letterCard").setAttribute("aria-hidden", "true");
  setMemory(0, false);
  goToScene(0, { force: true });
}

async function shareExperience() {
  const data = {
    title: `Happy ${state.config.recipient.birthdayLabel} Birthday, ${state.config.recipient.name}!`,
    text: `A tiny birthday surprise for ${state.config.recipient.name} ✨`,
    url: location.href.split("?")[0].split("#")[0],
  };
  try {
    if (navigator.share) await navigator.share(data);
    else if (navigator.clipboard) { await navigator.clipboard.writeText(data.url); showToast("Birthday link copied ✨"); }
    else showToast("Copy the link from your browser to share it");
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Sharing was cancelled — the surprise is still safe.");
  }
}

function pulseRain(strong = false) {
  const rain = $("#celebrationRain");
  rain.classList.add(strong ? "is-celebrating" : "is-pulsing");
  window.setTimeout(() => rain.classList.remove("is-pulsing", "is-celebrating"), state.reducedMotion ? 100 : 1700);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2100);
}

function installActions() {
  document.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-action]");
    if (!actionNode) return;
    const action = actionNode.dataset.action;
    if (action === "start") startExperience();
    if (action === "next") goToScene(state.scene + 1);
    if (action === "open-gift") openGift();
    if (action === "candle") blowCandle();
    if (action === "memory-prev") setMemory(state.memoryIndex - 1);
    if (action === "memory-next") setMemory(state.memoryIndex + 1);
    if (action === "open-letter") openLetter();
    if (action === "replay") replay();
  });
  $("#musicButton").addEventListener("click", toggleMusic);
  $("#shareButton").addEventListener("click", shareExperience);

  let startX = 0;
  const stage = $("#memoryStage");
  stage.addEventListener("pointerdown", (event) => { startX = event.clientX; stage.setPointerCapture?.(event.pointerId); });
  stage.addEventListener("pointerup", (event) => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 36) setMemory(state.memoryIndex + (delta < 0 ? 1 : -1));
  });
  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") setMemory(state.memoryIndex + 1);
    if (event.key === "ArrowLeft") setMemory(state.memoryIndex - 1);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.scene > 0) goToScene(state.scene - 1);
  });

  document.addEventListener("visibilitychange", () => {
    const audio = $("#birthdayAudio");
    if (document.hidden && !audio.paused) audio.pause();
    else if (!document.hidden && state.musicStarted && !state.muted) audio.play().catch(() => {});
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
function escapeAttribute(value) { return escapeHtml(value); }

async function boot() {
  const bootBar = $("#bootBar");
  try {
    bootBar.style.width = "22%";
    const config = getBirthdayConfig();
    state.config = config;
    setTheme(config);
    bindCopy(config);
    makeStats(config);
    makeMemories(config);
    makeReasons(config);
    makeLetter(config);
    makeRain();
    bootBar.style.width = "62%";
    await applyMediaOverrides(config);
    installImageFallbacks();
    installActions();
    bootBar.style.width = "100%";
    await new Promise((resolve) => window.setTimeout(resolve, state.reducedMotion ? 50 : 320));
    $("#bootScreen").classList.add("is-hidden");
    $("#app").hidden = false;
    window.setTimeout(() => $("#bootScreen")?.remove(), 700);
    animateSceneIn($(".scene.is-active"));
  } catch (error) {
    console.error("Birthday experience boot failed", error);
    $("#bootScreen").innerHTML = `<div class="boot-error"><b>Almost there…</b><p>Please refresh once. The birthday magic had a tiny hiccup.</p><button onclick="location.reload()">Try again</button></div>`;
  }
}

window.__BIRTHDAY_APP__ = {
  get state() { return { scene: state.scene, memoryIndex: state.memoryIndex, giftOpened: state.giftOpened, candleOut: state.candleOut, letterOpened: state.letterOpened }; },
  goToScene,
  replay,
};

boot();

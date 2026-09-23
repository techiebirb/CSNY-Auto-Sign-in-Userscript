// ==UserScript==
// @name         Collegiate Auto Sign-In
// @namespace    https://github.com/techiebirb/collegiateAutoSignIn
// @version      2.0.3
// @description  Auto-fills Collegiate Blackbaud and CSNY OneLogin sign-in steps.
// @author       techiebirb
// @homepageURL  https://github.com/techiebirb/collegiateAutoSignIn
// @supportURL   https://github.com/techiebirb/collegiateAutoSignIn
// @updateURL    https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js
// @downloadURL  https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js
// @match        https://collegiateschool.myschoolapp.com/*
// @match        https://csny.onelogin.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// ==/UserScript==

const CollegiateStorage = (() => {
  const STORAGE_KEY = "collegiateAutoSignIn.v1";

  const DEFAULTS = {
    enabled: true,
    email: "",
    password: "",
    autoClickNext: true,
    clickDelayMs: 300,
  };

  const saveListeners = new Set();
  let cache = null;
  let initPromise = null;

  function hasAsyncStorage() {
    return typeof GM !== "undefined" && typeof GM.getValue === "function";
  }

  function hasSyncStorage() {
    return typeof GM_getValue === "function" && typeof GM_setValue === "function";
  }

  function normalize(raw) {
    const merged = { ...DEFAULTS, ...(raw && typeof raw === "object" ? raw : {}) };
    merged.enabled = merged.enabled !== false;
    merged.email = String(merged.email || "").trim();
    merged.password = String(merged.password || "");
    merged.autoClickNext = merged.autoClickNext !== false;
    merged.clickDelayMs = Math.max(
      0,
      Math.min(5000, Number(merged.clickDelayMs) || DEFAULTS.clickDelayMs)
    );
    return merged;
  }

  function parseStored(stored) {
    if (stored && typeof stored === "object") {
      return normalize(stored);
    }
    if (typeof stored === "string" && stored.trim()) {
      return normalize(JSON.parse(stored));
    }
    return normalize({});
  }

  async function readFromStorage() {
    if (hasAsyncStorage()) {
      const stored = await GM.getValue(STORAGE_KEY, null);
      return parseStored(stored);
    }
    if (hasSyncStorage()) {
      try {
        const stored = GM_getValue(STORAGE_KEY, null);
        return parseStored(stored);
      } catch {
        return normalize({});
      }
    }
    return normalize({});
  }

  async function writeToStorage(payload) {
    if (hasAsyncStorage()) {
      await GM.setValue(STORAGE_KEY, payload);
      return;
    }
    if (hasSyncStorage()) {
      GM_setValue(STORAGE_KEY, payload);
      return;
    }
    throw new Error("Could not save settings (storage unavailable).");
  }

  async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      try {
        cache = await readFromStorage();
      } catch {
        cache = normalize({});
      }
    })();
    return initPromise;
  }

  function loadSettings() {
    return cache ? { ...cache } : normalize({});
  }

  async function saveSettings(values) {
    const payload = normalize(values);
    if (!payload.email) {
      return { ok: false, error: "Enter your email address." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (!hasAsyncStorage() && !hasSyncStorage()) {
      return { ok: false, error: "Could not save settings (storage unavailable)." };
    }
    try {
      await writeToStorage(payload);
    } catch (err) {
      const message =
        err && typeof err.message === "string"
          ? err.message
          : "Could not save settings (storage unavailable).";
      return { ok: false, error: message };
    }
    cache = payload;
    for (const fn of saveListeners) {
      try {
        fn(payload);
      } catch {
        /* ignore listener errors */
      }
    }
    return { ok: true, settings: payload };
  }

  function onSettingsSaved(callback) {
    if (typeof callback === "function") saveListeners.add(callback);
  }

  return {
    STORAGE_KEY,
    DEFAULTS,
    init,
    loadSettings,
    saveSettings,
    onSettingsSaved,
  };
})();

const CollegiateSettingsUI = (() => {
  const HOST_ID = "collegiate-auto-sign-in-ui";
  let hostEl = null;
  let shadow = null;
  let onSaveCallback = null;
  let firstRunDismissed = false;
  let panelOpen = false;
  let welcomeMode = false;

  const STYLES = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; }
    .gear {
      position: fixed;
      z-index: 2147483646;
      right: max(12px, env(safe-area-inset-right));
      bottom: max(12px, env(safe-area-inset-bottom));
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      min-height: 44px;
      min-width: 44px;
      padding: 0.45rem 0.75rem;
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 999px;
      background: #fff;
      color: #1a1a1a;
      font: 600 0.875rem system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      cursor: pointer;
    }
    .gear:focus-visible {
      outline: 2px solid #1e4d8c;
      outline-offset: 2px;
    }
    .gear svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0;
    }
    @media (min-width: 640px) {
      .backdrop { align-items: center; padding: 1rem; }
    }
    .panel {
      width: 100%;
      max-width: 32rem;
      max-height: min(90vh, 90dvh);
      background: #fff;
      color: #1a1a1a;
      border-radius: 16px 16px 0 0;
      font: 400 1rem/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.2);
    }
    @media (min-width: 640px) {
      .panel { border-radius: 12px; max-height: min(85vh, 85dvh); }
    }
    .panel-inner { overflow: auto; padding: 1.25rem 1.25rem 0.5rem; flex: 1; }
    .panel h2 { margin: 0 0 0.35rem; font-size: 1.2rem; font-weight: 700; }
    .welcome { margin: 0 0 1rem; color: #1e4d8c; font-size: 0.95rem; }
    .hint { margin: 0 0 1rem; color: #555; font-size: 0.875rem; }
    .hint code { font-size: 0.8rem; }
    label.field { display: block; font-weight: 600; margin-top: 0.85rem; font-size: 0.9rem; }
    .row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.85rem; font-weight: 600; font-size: 0.9rem; }
    .row input[type="checkbox"] { width: 1.1rem; height: 1.1rem; }
    input[type="email"],
    input[type="password"],
    input[type="number"],
    input[type="text"] {
      width: 100%;
      margin-top: 0.35rem;
      padding: 0.55rem 0.65rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font: inherit;
    }
    .password-wrap { position: relative; margin-top: 0.35rem; }
    .password-wrap input { margin-top: 0; padding-right: 2.75rem; }
    .toggle-pw {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: transparent;
      color: #1e4d8c;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.35rem 0.5rem;
      cursor: pointer;
      min-height: 44px;
    }
    .footer {
      padding: 0.75rem 1.25rem max(0.75rem, env(safe-area-inset-bottom));
      border-top: 1px solid #eee;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      background: #fff;
      flex-shrink: 0;
    }
    .footer .spacer { flex: 1; }
    .btn {
      min-height: 44px;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font: 600 0.9rem inherit;
      cursor: pointer;
      border: none;
    }
    .btn-primary { background: #1e4d8c; color: #fff; }
    .btn-primary:hover { background: #163a6b; }
    .btn-secondary { background: #f0f0f0; color: #1a1a1a; }
    .status { font-size: 0.875rem; min-height: 1.25rem; flex: 1 1 100%; }
    .status.ok { color: #0a6b32; }
    .status.err { color: #a11; }
  `;

  function gearIconSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.07.33.1.67.1 1s-.03.67-.1 1a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`;
  }

  function ensureHost() {
    if (hostEl?.isConnected) return;
    hostEl = document.createElement("div");
    hostEl.id = HOST_ID;
    hostEl.setAttribute("data-collegiate-auto-sign-in", "ui");
    shadow = hostEl.attachShadow({ mode: "closed" });
    (document.body || document.documentElement).appendChild(hostEl);

    const style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);

    const gear = document.createElement("button");
    gear.type = "button";
    gear.className = "gear";
    gear.setAttribute("aria-label", "Collegiate sign-in settings");
    gear.innerHTML = `${gearIconSvg()}<span class="gear-label">Settings</span>`;
    gear.addEventListener("click", (e) => {
      e.stopPropagation();
      openPanel({ welcome: false });
    });
    shadow.appendChild(gear);
  }

  function getFormEls() {
    return shadow?.querySelector(".backdrop");
  }

  function loadFormValues(settings) {
    const root = getFormEls();
    if (!root) return;
    root.querySelector("#cas-enabled").checked = settings.enabled !== false;
    root.querySelector("#cas-email").value = settings.email || "";
    root.querySelector("#cas-password").value = settings.password || "";
    root.querySelector("#cas-autoClickNext").checked = settings.autoClickNext !== false;
    root.querySelector("#cas-clickDelayMs").value =
      settings.clickDelayMs ?? CollegiateStorage.DEFAULTS.clickDelayMs;
    const welcomeEl = root.querySelector(".welcome");
    if (welcomeEl) welcomeEl.hidden = !welcomeMode;
    const notNow = root.querySelector(".btn-not-now");
    if (notNow) notNow.hidden = !welcomeMode;
  }

  function setStatus(message, ok) {
    const root = getFormEls();
    if (!root) return;
    const el = root.querySelector(".status");
    el.textContent = message || "";
    el.className = "status" + (message ? (ok ? " ok" : " err") : "");
  }

  function closePanel() {
    const backdrop = getFormEls();
    if (backdrop) backdrop.remove();
    panelOpen = false;
    welcomeMode = false;
    document.removeEventListener("keydown", onKeydown, true);
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (welcomeMode) firstRunDismissed = true;
      closePanel();
    }
  }

  function onBackdropClick(e) {
    if (e.target.classList.contains("backdrop")) {
      if (welcomeMode) firstRunDismissed = true;
      closePanel();
    }
  }

  function readPayloadFromForm(root) {
    return {
      enabled: root.querySelector("#cas-enabled").checked,
      email: root.querySelector("#cas-email").value.trim(),
      password: root.querySelector("#cas-password").value,
      autoClickNext: root.querySelector("#cas-autoClickNext").checked,
      clickDelayMs: root.querySelector("#cas-clickDelayMs").value,
    };
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    const root = getFormEls();
    if (!root) return;

    const payload = readPayloadFromForm(root);
    const active = shadow?.activeElement;
    if (active && typeof active.blur === "function") active.blur();

    let result;
    try {
      result = await CollegiateStorage.saveSettings(payload);
    } catch (err) {
      const message =
        err && typeof err.message === "string" ? err.message : "Could not save settings.";
      setStatus(message, false);
      return;
    }

    if (!result.ok) {
      setStatus(result.error, false);
      root.querySelector("#cas-email")?.focus();
      return;
    }

    setStatus("Settings saved.", true);
    welcomeMode = false;
    firstRunDismissed = true;

    const savedSettings = result.settings;
    setTimeout(() => {
      closePanel();
      if (onSaveCallback) onSaveCallback(savedSettings);
    }, 350);
  }

  function openPanel({ welcome }) {
    ensureHost();
    if (panelOpen) {
      welcomeMode = welcomeMode || welcome;
      loadFormValues(CollegiateStorage.loadSettings());
      return;
    }
    panelOpen = true;
    welcomeMode = !!welcome;

    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.addEventListener("click", onBackdropClick);

    backdrop.innerHTML = `
      <div class="panel" role="dialog" aria-modal="true" aria-labelledby="cas-title">
        <form class="panel-form" novalidate>
          <div class="panel-inner">
            <h2 id="cas-title">Collegiate Auto Sign-In</h2>
            <p class="welcome" hidden>Set your school email once; we'll fill login steps for you.</p>
            <p class="hint">
              Blackbaud (<code>collegiateschool.myschoolapp.com</code>): fills your email and optionally
              clicks Next. CSNY OneLogin (<code>csny.onelogin.com/login</code> or
              <code>/login2</code>): same email as username, plus your OneLogin password.
            </p>
            <label class="row">
              <input type="checkbox" id="cas-enabled" checked />
              Enable automation
            </label>
            <label class="field" for="cas-email">Email (school login username)</label>
            <input type="email" id="cas-email" autocomplete="email" inputmode="email" />
            <label class="field" for="cas-password">Password (OneLogin)</label>
            <div class="password-wrap">
              <input type="password" id="cas-password" autocomplete="current-password" />
              <button type="button" class="toggle-pw" aria-label="Show password">Show</button>
            </div>
            <label class="row">
              <input type="checkbox" id="cas-autoClickNext" checked />
              Automatically click Next / Continue
            </label>
            <label class="field" for="cas-clickDelayMs">Delay before Next / Continue (ms)</label>
            <input type="number" id="cas-clickDelayMs" min="0" max="5000" step="50" value="300" />
          </div>
          <div class="footer">
            <p class="status" role="status"></p>
            <button type="button" class="btn btn-secondary btn-not-now" hidden>Not now</button>
            <span class="spacer"></span>
            <button type="button" class="btn btn-primary btn-save">Save</button>
          </div>
        </form>
      </div>
    `;

    shadow.appendChild(backdrop);

    const form = backdrop.querySelector(".panel-form");
    form.addEventListener("submit", handleSave);
    form.addEventListener("click", (e) => e.stopPropagation());

    backdrop.querySelector(".btn-save").addEventListener("click", handleSave);

    const notNow = backdrop.querySelector(".btn-not-now");
    notNow.addEventListener("click", () => {
      firstRunDismissed = true;
      closePanel();
    });

    const togglePw = backdrop.querySelector(".toggle-pw");
    const pwInput = backdrop.querySelector("#cas-password");
    togglePw.addEventListener("click", () => {
      const show = pwInput.type === "password";
      pwInput.type = show ? "text" : "password";
      togglePw.textContent = show ? "Hide" : "Show";
      togglePw.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });

    loadFormValues(CollegiateStorage.loadSettings());
    document.addEventListener("keydown", onKeydown, true);
    const emailInput = backdrop.querySelector("#cas-email");
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (!coarsePointer) emailInput.focus();
  }

  function init({ onSave }) {
    onSaveCallback = onSave;
    ensureHost();
    const settings = CollegiateStorage.loadSettings();
    if (!settings.email && !firstRunDismissed) {
      openPanel({ welcome: true });
    }
  }

  return { init, openPanel, closePanel };
})();

/**
 * Host-specific login step configuration.
 * Blackbaud myschoolapp and CSNY OneLogin.
 */
function createBlackbaudSiteConfig(id, hostPattern) {
  return {
    id,
    runFlow: "blackbaudEmail",
    hostPattern,
    pathPattern: /\/app/i,
    emailSelectors: ["#Username", 'input[id="Username"]', 'input[type="email"]'],
    nextSelectors: ["#nextBtn", 'input[type="submit"][value="Next"]'],
    isEmailStep() {
      const password = document.getElementById("Password");
      if (!password) return true;
      return password.offsetParent === null;
    },
  };
}

const COLLEGIATE_SITE_CONFIGS = [
  createBlackbaudSiteConfig(
    "collegiate-school-nyc",
    /^collegiateschool\.myschoolapp\.com$/i
  ),
  {
    id: "csny-onelogin",
    runFlow: "oneLogin",
    hostPattern: /^csny\.onelogin\.com$/i,
    pathPattern: /\/login2?(\/|\?|#|$)/i,
    usernameSelectors: ["#username", 'input[name="username"]'],
    passwordSelectors: ["#password", 'input[name="password"]'],
    submitSelectors: ['button[type="submit"]'],
    getStep() {
      const password = CollegiateDom.queryFirst(this.passwordSelectors);
      if (password && CollegiateDom.isVisible(password)) return "password";
      const username = CollegiateDom.queryFirst(this.usernameSelectors);
      if (username && CollegiateDom.isVisible(username)) return "username";
      return null;
    },
  },
];

function getSiteConfigForLocation(location) {
  const host = location.hostname;
  const href = location.href;
  for (const config of COLLEGIATE_SITE_CONFIGS) {
    if (!config.hostPattern.test(host)) continue;
    if (config.pathPattern && !config.pathPattern.test(href)) continue;
    return config;
  }
  return null;
}

const CollegiateDom = (() => {
  const LOG_PREFIX = "[Collegiate Auto Sign-In]";

  function debug(...args) {
    console.debug(LOG_PREFIX, ...args);
  }

  function queryFirst(selectors, root = document) {
    for (const selector of selectors) {
      try {
        const el = root.querySelector(selector);
        if (el) return el;
      } catch {
        /* invalid selector */
      }
    }
    return null;
  }

  function isVisible(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    if (el.hidden) return false;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return el.offsetParent !== null || style.position === "fixed";
  }

  function setNativeInputValue(input, value) {
    const proto = input instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    if (descriptor?.set) {
      descriptor.set.call(input, value);
    } else {
      input.value = value;
    }
  }

  function fillInput(input, value) {
    if (!input || input.disabled || input.readOnly) return false;
    input.focus();
    setNativeInputValue(input, "");
    setNativeInputValue(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return input.value === value;
  }

  function findNextButton(selectors) {
    const bySelector = queryFirst(selectors);
    if (bySelector && isVisible(bySelector) && !bySelector.disabled) {
      return bySelector;
    }
    const candidates = document.querySelectorAll(
      'button, input[type="submit"], input[type="button"]'
    );
    const labelRe = /^(next|continue)$/i;
    for (const el of candidates) {
      if (!isVisible(el) || el.disabled) continue;
      const text = (el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
      if (labelRe.test(text)) return el;
    }
    return bySelector;
  }

  function waitFor(conditionFn, timeoutMs = 15000, pollMs = 100) {
    return new Promise((resolve) => {
      const start = Date.now();
      let observer;

      const tryResolve = () => {
        const result = conditionFn();
        if (result) {
          if (observer) observer.disconnect();
          resolve(result);
          return true;
        }
        if (Date.now() - start >= timeoutMs) {
          if (observer) observer.disconnect();
          resolve(null);
          return true;
        }
        return false;
      };

      if (tryResolve()) return;

      observer = new MutationObserver(() => {
        tryResolve();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      const interval = setInterval(() => {
        if (tryResolve()) clearInterval(interval);
      }, pollMs);
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function clickWhenReady(button, delayMs) {
    if (!button) return false;
    if (delayMs > 0) await sleep(delayMs);
    if (button.disabled || !isVisible(button)) return false;
    button.click();
    return true;
  }

  return {
    debug,
    queryFirst,
    isVisible,
    fillInput,
    findNextButton,
    waitFor,
    clickWhenReady,
  };
})();

const SESSION_PREFIX = "collegiateAutoSignIn";

let currentSettings = CollegiateStorage.loadSettings();
let automationChain = Promise.resolve();
let domWatchStarted = false;
let domDebounceTimer;

function stepGuardKey(siteId, step) {
  return `${SESSION_PREFIX}/${siteId}/${step}`;
}

function isStepDone(siteId, step) {
  try {
    return sessionStorage.getItem(stepGuardKey(siteId, step)) === "1";
  } catch {
    return false;
  }
}

function markStepDone(siteId, step) {
  try {
    sessionStorage.setItem(stepGuardKey(siteId, step), "1");
  } catch {
    /* ignore */
  }
}

function clearStepDone(siteId, step) {
  try {
    sessionStorage.removeItem(stepGuardKey(siteId, step));
  } catch {
    /* ignore */
  }
}

function clearAllSessionGuards() {
  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(`${SESSION_PREFIX}/`)) keys.push(key);
    }
    for (const key of keys) sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function shouldSkipBlackbaudEmailStep(site) {
  if (!isStepDone(site.id, "email")) return false;
  if (!site.isEmailStep || !site.isEmailStep()) return true;

  const emailInput = CollegiateDom.queryFirst(site.emailSelectors);
  const empty = !emailInput || !(emailInput.value || "").trim();
  if (empty) {
    clearStepDone(site.id, "email");
    return false;
  }
  return true;
}

async function runBlackbaudEmailStep(settings, site) {
  if (shouldSkipBlackbaudEmailStep(site)) return;

  if (site.isEmailStep && !site.isEmailStep()) {
    CollegiateDom.debug("Not on email step; skipping");
    return;
  }

  const emailInput = await CollegiateDom.waitFor(() => {
    const el = CollegiateDom.queryFirst(site.emailSelectors);
    if (el && CollegiateDom.isVisible(el)) return el;
    return null;
  });

  if (!emailInput) {
    CollegiateDom.debug("Email field not found in time");
    return;
  }

  const targetEmail = settings.email.trim();
  const existing = (emailInput.value || "").trim();

  if (!existing) {
    const filled = CollegiateDom.fillInput(emailInput, targetEmail);
    if (!filled) {
      CollegiateDom.debug("Could not set email value");
      return;
    }
    CollegiateDom.debug("Email filled");
  } else if (existing.toLowerCase() !== targetEmail.toLowerCase()) {
    CollegiateDom.debug("Email field has different value; skipping fill");
  } else {
    CollegiateDom.debug("Email already filled");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "email");
    return;
  }

  const nextButton = await CollegiateDom.waitFor(() => {
    const btn = CollegiateDom.findNextButton(site.nextSelectors);
    if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
    return null;
  }, 5000);

  const clicked = await CollegiateDom.clickWhenReady(
    nextButton,
    Number(settings.clickDelayMs) || 0
  );

  if (clicked) {
    CollegiateDom.debug("Clicked Next");
    markStepDone(site.id, "email");
  } else {
    CollegiateDom.debug("Next button not clicked (missing or disabled)");
  }
}

async function clickSubmit(site, settings) {
  const submitButton = await CollegiateDom.waitFor(() => {
    const btn = CollegiateDom.findNextButton(site.submitSelectors);
    if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
    return null;
  }, 5000);

  return CollegiateDom.clickWhenReady(
    submitButton,
    Number(settings.clickDelayMs) || 0
  );
}

async function runOneLoginUsernameStep(settings, site) {
  if (isStepDone(site.id, "username")) return true;

  const onUsername = await CollegiateDom.waitFor(() => {
    if (site.getStep() === "username") return true;
    if (site.getStep() === "password") return "skip";
    return null;
  });

  if (onUsername === "skip") {
    CollegiateDom.debug("Already on password step; skipping username");
    markStepDone(site.id, "username");
    return true;
  }
  if (!onUsername) {
    CollegiateDom.debug("Username step not found in time");
    return false;
  }

  const usernameInput = CollegiateDom.queryFirst(site.usernameSelectors);
  if (!usernameInput || !CollegiateDom.isVisible(usernameInput)) {
    CollegiateDom.debug("Username field not visible");
    return false;
  }

  const existing = (usernameInput.value || "").trim();
  if (!existing) {
    const filled = CollegiateDom.fillInput(usernameInput, settings.email.trim());
    if (!filled) {
      CollegiateDom.debug("Could not set username");
      return false;
    }
    CollegiateDom.debug("Username filled");
  } else {
    CollegiateDom.debug("Username already filled; skipping fill");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "username");
    return true;
  }

  const clicked = await clickSubmit(site, settings);
  if (clicked) {
    CollegiateDom.debug("Clicked Continue (username step)");
    markStepDone(site.id, "username");
    return true;
  }
  CollegiateDom.debug("Continue not clicked on username step");
  return false;
}

async function runOneLoginPasswordStep(settings, site) {
  if (isStepDone(site.id, "password")) return true;

  if (!settings.password?.trim()) {
    CollegiateDom.debug("No OneLogin password saved; skipping password step");
    return false;
  }

  const passwordInput = await CollegiateDom.waitFor(() => {
    if (site.getStep() !== "password") return null;
    const el = CollegiateDom.queryFirst(site.passwordSelectors);
    if (el && CollegiateDom.isVisible(el)) return el;
    return null;
  });

  if (!passwordInput) {
    CollegiateDom.debug("Password field not found in time");
    return false;
  }

  const existing = (passwordInput.value || "").trim();
  if (!existing) {
    const filled = CollegiateDom.fillInput(
      passwordInput,
      settings.password.trim()
    );
    if (!filled) {
      CollegiateDom.debug("Could not set password");
      return false;
    }
    CollegiateDom.debug("Password filled");
  } else {
    CollegiateDom.debug("Password field already has value; skipping fill");
  }

  if (!settings.autoClickNext) {
    markStepDone(site.id, "password");
    return true;
  }

  const clicked = await clickSubmit(site, settings);
  if (clicked) {
    CollegiateDom.debug("Clicked Continue (password step)");
    markStepDone(site.id, "password");
    return true;
  }
  CollegiateDom.debug("Continue not clicked on password step");
  return false;
}

async function runOneLoginFlow(settings, site) {
  await runOneLoginUsernameStep(settings, site);
  await runOneLoginPasswordStep(settings, site);
}

async function runAutomation(settings) {
  if (!settings.enabled || !settings.email?.trim()) return;

  const site = getSiteConfigForLocation(window.location);
  if (!site) {
    CollegiateDom.debug("No site config for", window.location.hostname);
    return;
  }

  if (site.runFlow === "oneLogin") {
    await runOneLoginFlow(settings, site);
    return;
  }

  if (site.runFlow === "blackbaudEmail" || site.emailSelectors) {
    await runBlackbaudEmailStep(settings, site);
  }
}

function scheduleAutomation(settings) {
  automationChain = automationChain
    .then(() => runAutomation(settings))
    .catch((err) => {
      console.debug("[Collegiate Auto Sign-In]", err);
    });
}

function applySettings(settings) {
  currentSettings = settings;
  scheduleAutomation(currentSettings);
}

function isUiOnlyMutation(mutations) {
  const host = document.getElementById("collegiate-auto-sign-in-ui");
  if (!host) return false;
  return mutations.every((m) => host === m.target || host.contains(m.target));
}

function startDomWatch() {
  if (domWatchStarted) return;
  domWatchStarted = true;

  window.addEventListener("hashchange", () => scheduleAutomation(currentSettings));
  window.addEventListener("popstate", () => scheduleAutomation(currentSettings));

  const observer = new MutationObserver((mutations) => {
    if (isUiOnlyMutation(mutations)) return;
    clearTimeout(domDebounceTimer);
    domDebounceTimer = setTimeout(() => scheduleAutomation(currentSettings), 300);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function runAutomationAfterSave(settings) {
  clearAllSessionGuards();
  currentSettings = settings;
  const run = () => scheduleAutomation(currentSettings);
  run();
  setTimeout(run, 900);
}

function onSettingsSaved(settings) {
  setTimeout(() => runAutomationAfterSave(settings), 150);
}

async function bootstrap() {
  await CollegiateStorage.init();
  currentSettings = CollegiateStorage.loadSettings();
  CollegiateSettingsUI.init({ onSave: onSettingsSaved });
  if (currentSettings.email?.trim()) {
    scheduleAutomation(currentSettings);
  }
  startDomWatch();
}

bootstrap();

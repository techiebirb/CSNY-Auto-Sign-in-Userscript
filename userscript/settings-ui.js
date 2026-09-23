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
    @media (max-width: 639px) {
      .gear {
        min-height: 36px;
        min-width: 36px;
        padding: 0.35rem;
        gap: 0;
      }
      .gear svg { width: 0.95rem; height: 0.95rem; }
      .gear-label { display: none; }
    }
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
    gear.setAttribute("aria-label", "CSNY sign-in settings");
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
            <h2 id="cas-title">CSNY Auto Sign-in [Userscript Ver]</h2>
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

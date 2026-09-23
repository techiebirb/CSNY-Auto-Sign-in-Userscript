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

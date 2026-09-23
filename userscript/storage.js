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

  function loadSettings() {
    try {
      const stored = GM_getValue(STORAGE_KEY, null);
      if (stored && typeof stored === "object") {
        return normalize(stored);
      }
      if (typeof stored === "string" && stored.trim()) {
        return normalize(JSON.parse(stored));
      }
    } catch {
      /* ignore corrupt storage */
    }
    return normalize({});
  }

  function saveSettings(values) {
    const payload = normalize(values);
    if (!payload.email) {
      return { ok: false, error: "Enter your email address." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    GM_setValue(STORAGE_KEY, payload);
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
    loadSettings,
    saveSettings,
    onSettingsSaved,
  };
})();

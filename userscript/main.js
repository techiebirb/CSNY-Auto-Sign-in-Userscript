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

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

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

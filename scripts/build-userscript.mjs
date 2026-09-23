import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SCRIPT_URL =
  "https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js";
const REPO_URL = "https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript";

const HEADER = `// ==UserScript==
// @name         CSNY Auto Sign-in [Userscript Ver]
// @namespace    ${REPO_URL}
// @version      2.0.3
// @description  Auto-fills Collegiate Blackbaud and CSNY OneLogin sign-in steps.
// @author       techiebirb
// @homepageURL  ${REPO_URL}
// @supportURL   ${REPO_URL}
// @updateURL    ${SCRIPT_URL}
// @downloadURL  ${SCRIPT_URL}
// @match        https://collegiateschool.myschoolapp.com/*
// @match        https://csny.onelogin.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// ==/UserScript==

`;

const parts = [
  "userscript/storage.js",
  "userscript/settings-ui.js",
  "config/sites.js",
  "lib/dom.js",
  "userscript/main.js",
];

const body = parts
  .map((rel) => {
    const filePath = path.join(root, rel);
    return fs.readFileSync(filePath, "utf8").trim();
  })
  .join("\n\n");

const outPath = path.join(root, "collegiate-auto-sign-in.user.js");
fs.writeFileSync(outPath, `${HEADER}${body}\n`, "utf8");
console.log(`Wrote ${outPath} (${parts.length} modules)`);

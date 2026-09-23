import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const HEADER = `// ==UserScript==
// @name         Collegiate Auto Sign-In
// @namespace    https://github.com/collegiate-auto-sign-in
// @version      2.0.1
// @description  Auto-fills Collegiate Blackbaud and CSNY OneLogin sign-in steps.
// @author       Collegiate Auto Sign-In
// @match        https://collegiateschool.myschoolapp.com/*
// @match        https://csny.onelogin.com/*
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

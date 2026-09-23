#!/usr/bin/env python3
"""Concatenate userscript sources into collegiate-auto-sign-in.user.js."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SCRIPT_URL = (
    "https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/"
    "collegiate-auto-sign-in.user.js"
)
REPO_URL = "https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript"

HEADER = f"""// ==UserScript==
// @name         CSNY Auto Sign-in [Userscript Ver]
// @namespace    {REPO_URL}
// @version      2.0.3
// @description  Auto-fills Collegiate Blackbaud and CSNY OneLogin sign-in steps.
// @author       techiebirb
// @homepageURL  {REPO_URL}
// @supportURL   {REPO_URL}
// @updateURL    {SCRIPT_URL}
// @downloadURL  {SCRIPT_URL}
// @match        https://collegiateschool.myschoolapp.com/*
// @match        https://csny.onelogin.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// ==/UserScript==

"""

PARTS = [
    "userscript/storage.js",
    "userscript/settings-ui.js",
    "config/sites.js",
    "lib/dom.js",
    "userscript/main.js",
]


def main() -> None:
    chunks = [(ROOT / rel).read_text().strip() for rel in PARTS]
    out = ROOT / "collegiate-auto-sign-in.user.js"
    out.write_text(HEADER + "\n\n".join(chunks) + "\n", encoding="utf-8")
    print(f"Wrote {out} ({len(PARTS)} modules)")


if __name__ == "__main__":
    main()

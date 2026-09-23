#!/usr/bin/env python3
"""Concatenate userscript sources into collegiate-auto-sign-in.user.js."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEADER = """// ==UserScript==
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

# Contributing

This repo builds a single installable userscript, [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js), from smaller source files. End-user setup is documented in [README.md](README.md).

## Repository layout

| Path | Purpose |
|------|---------|
| [`userscript/`](userscript/) | Main logic, settings UI, storage |
| [`config/sites.js`](config/sites.js) | Per-site URLs and DOM selectors |
| [`lib/dom.js`](lib/dom.js) | Shared DOM helpers |
| [`scripts/build-userscript.mjs`](scripts/build-userscript.mjs) | Node build |
| [`scripts/build-userscript.py`](scripts/build-userscript.py) | Python build (no Node required) |

## Build

After editing source files, rebuild the installable script:

```bash
node scripts/build-userscript.mjs
```

If Node is not installed:

```bash
python3 scripts/build-userscript.py
```

The build writes `collegiate-auto-sign-in.user.js` at the repo root.

## Release a new version

1. Make and test your changes in `userscript/`, `config/`, or `lib/`.
2. Bump `@version` in both [`scripts/build-userscript.mjs`](scripts/build-userscript.mjs) and [`scripts/build-userscript.py`](scripts/build-userscript.py) (keep them in sync).
3. Run the build command above.
4. Commit the rebuilt `collegiate-auto-sign-in.user.js` along with source changes.
5. Push to the `main` branch on GitHub.

Tampermonkey users who installed from the published script URL will receive updates when Tampermonkey checks for updates (see `@updateURL` and `@downloadURL` in the generated header). Users who imported a local file or use Userscripts on Apple platforms may need to refresh or re-import manually.

Published install URL (must match the header in the built file):

`https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js`

## Customize selectors

If Blackbaud or OneLogin changes their login page, edit [`config/sites.js`](config/sites.js), rebuild, and release as above. Selector IDs and button labels belong in that config file—not in the user-facing README.

## Userscript metadata

The build injects a standard `==UserScript==` header, including:

- `@match` for `collegiateschool.myschoolapp.com` and `csny.onelogin.com`
- `@grant GM_getValue` / `GM_setValue` for settings storage
- `@updateURL` / `@downloadURL` pointing at the raw GitHub file on `main`

Do not hand-edit the header in `collegiate-auto-sign-in.user.js`; change the build scripts and rebuild.

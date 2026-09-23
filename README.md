# Collegiate Auto Sign-In

Userscript that automates early login steps for Collegiate Blackbaud portals and CSNY OneLogin. Settings live on the login page—tap **Settings** (bottom-right) on any supported site.

**Repository:** [github.com/techiebirb/collegiateAutoSignIn](https://github.com/techiebirb/collegiateAutoSignIn)

**Install URL (Tampermonkey / Userscripts):**

`https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js`

You can also download [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) from this repo and import the file.

## Supported sites

| Site | URL | What is automated |
|------|-----|-------------------|
| Blackbaud | [`collegiateschool.myschoolapp.com`](https://collegiateschool.myschoolapp.com/app/student) — [`/app#login`](https://collegiateschool.myschoolapp.com/app?svcid=edu#login) | Email `#Username`, **Next** `#nextBtn` |
| OneLogin | [`csny.onelogin.com`](https://csny.onelogin.com/login) or `/login2` | Username (same email), **Continue**, then password and **Continue** |

Blackbaud password entry is still manual. OneLogin uses the password you save in **Settings**.

## Install

### iPhone / iPad (Safari)

1. Install **Userscripts** from the App Store.
2. On your device, open **Settings → Safari → Extensions** and turn **Userscripts** on.
3. Import the [install URL](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js) or the `.user.js` file (AirDrop, Files).
4. In Safari, open a Collegiate login page. Tap **Settings**, enter your school email (and OneLogin password if needed), then **Save**.

### Computer (Chrome, Edge, or Firefox)

1. Install **Tampermonkey**.
2. Install the script from the [install URL](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js) (Tampermonkey prompt), or **Dashboard → Utilities → Import** with the downloaded file.
3. Open a login URL. Click **Settings**, fill in your details, and **Save**.

**Updates:** Tampermonkey can check for updates automatically when you install from the install URL above (enable **Check for updates** in Tampermonkey settings). Bump `@version` in the script and push to `main` to publish an update. **Userscripts on iPhone/iPad** usually still needs a manual refresh when a new version is published.

**Set up once per device.** Settings are stored only in that browser’s script storage—they do not sync between your phone and laptop automatically.

## Usage

**Blackbaud:** Open the student portal or login URL. The script fills **Email address** and clicks **Next** when enabled. Enter your Blackbaud password yourself on the next step.

**OneLogin:** Open a CSNY OneLogin login URL (often after Blackbaud SSO). The script fills username when empty (or clicks **Continue** if already prefilled), then fills password and clicks **Continue**. If the wrong username is prefilled, use **Not you?** yourself—the script does not click that control.

On first visit, a welcome panel may open so you can save your email. You can dismiss it with **Not now** and open **Settings** later.

## Settings

| Setting | Description |
|--------|-------------|
| Enable automation | Master on/off switch |
| Email | Login username (same for Blackbaud and OneLogin) |
| Password (OneLogin) | OneLogin password (optional if you only use the Blackbaud email step) |
| Automatically click Next / Continue | Submit each automated step |
| Delay before Next / Continue (ms) | Wait after typing before clicking (helps validation UI) |

Email and password are stored on your device only via the userscript manager (not encrypted; never commit real credentials to git).

## Develop

Source is split under [`userscript/`](userscript/), [`config/`](config/), and [`lib/`](lib/). After editing, rebuild the installable file:

```bash
node scripts/build-userscript.mjs
```

Or, if Node is not installed:

```bash
python3 scripts/build-userscript.py
```

Commit the rebuilt `collegiate-auto-sign-in.user.js`, bump `@version` in `scripts/build-userscript.*`, and push to `main`. Tampermonkey users who installed from the install URL will get updates on check; others re-import manually.

## Customize selectors

Edit [`config/sites.js`](config/sites.js) if Blackbaud or OneLogin changes the login page, then rebuild.

## Troubleshooting

- If nothing happens, confirm the script is **enabled** in Tampermonkey or Userscripts and your email (and OneLogin password, if needed) are saved via **Settings**.
- You should see **Settings saved.** in the panel after **Save**. If not, check the email field message.
- Open the browser console and filter for `[Collegiate Auto Sign-In]` debug messages.
- Increase **Delay before Next / Continue** if the button stays disabled briefly after paste.
- Reload the login page after changing settings.
- After updating the script file on GitHub, refresh or re-import it in your userscript manager.

## License

[MIT](LICENSE)

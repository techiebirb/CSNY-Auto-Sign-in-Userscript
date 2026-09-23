# Collegiate Auto Sign-In

This helper fills in parts of the Collegiate school login for you—your **email** on the Blackbaud portal and, when needed, your **CSNY OneLogin** username and password steps. You still type your **Blackbaud password** yourself on the next screen.

After you install it once on a device, open a supported login page and use **Settings** (bottom-right corner) to save your school email and optional OneLogin password.

**Repository:** [github.com/techiebirb/collegiateAutoSignIn](https://github.com/techiebirb/collegiateAutoSignIn)

## What you need

| Device | Browser | Add-on app |
|--------|---------|------------|
| iPhone / iPad | Safari | [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) (App Store) |
| Mac | Safari | [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) (Mac App Store) |
| Mac or Windows | Chrome, Edge, or Firefox | [Tampermonkey](https://www.tampermonkey.net/) |
| Android phone or tablet | **Microsoft Edge** or **Firefox** (not Chrome) | Tampermonkey (inside that browser) |

> **Android:** The usual **Chrome** app on Android cannot run this. Open school links in **Edge** or **Firefox** after you install Tampermonkey there.

## Install link

Open this link in the browser where you installed Userscripts or Tampermonkey. When asked, confirm **Install** (or add/import the script):

**[Install Collegiate Auto Sign-In](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)**

You can also download [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) from this repo and import that file in Userscripts or Tampermonkey.

## Supported sites

| Site | Link to open | What the helper does |
|------|----------------|----------------------|
| Blackbaud student portal | [Student portal](https://collegiateschool.myschoolapp.com/app/student) or [login page](https://collegiateschool.myschoolapp.com/app?svcid=edu#login) | Fills **Email address** and clicks **Next**. You enter your Blackbaud password on the next step. |
| CSNY OneLogin | [OneLogin sign-in](https://csny.onelogin.com/login) (sometimes `/login2` after the portal) | Fills your username (same email), clicks **Continue**, then fills the OneLogin password you saved in **Settings** and clicks **Continue** again. |

OneLogin uses the password you save in **Settings**. Blackbaud password entry is always manual.

## Install

Pick the section that matches your device.

### iPhone / iPad (Safari)

1. Install **[Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)** from the App Store.
2. On your device, open **Settings → Safari → Extensions** and turn **Userscripts** on. Allow it on Collegiate sites when Safari asks.
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)** in Safari and add the script in Userscripts, or import the downloaded `.user.js` file (AirDrop, Files, etc.).
4. In Safari, open a Collegiate login page from the table above. Tap **Settings**, enter your school email (and OneLogin password if you use OneLogin), then tap **Save**. You should see **Settings saved.**

### Mac (Safari)

1. Install **[Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)** from the Mac App Store.
2. Open **Safari → Settings → Extensions**, enable **Userscripts**, and allow it on `collegiateschool.myschoolapp.com` and `csny.onelogin.com` when prompted.
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)** in Safari and add the script in Userscripts, or import [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js). See the [Userscripts macOS guide](https://github.com/quoid/userscripts) if you need import steps.
4. Open a Collegiate login page in **Safari**. Click **Settings**, enter your details, and click **Save**. You should see **Settings saved.**

The Userscripts *file* can sync between Apple devices if you use its sync options; your **Settings** email and password are still stored separately on each device and browser.

### Mac or Windows (Chrome, Edge, or Firefox)

1. Install **[Tampermonkey](https://www.tampermonkey.net/)** for your browser (Chrome Web Store, Edge Add-ons, or Firefox Add-ons).
2. Open the **[install link](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)**. Confirm when Tampermonkey asks to install. Or use **Dashboard → Utilities → Import** with the downloaded file.
3. Open a login URL from the table above. Click **Settings**, fill in your details, and click **Save**. You should see **Settings saved.**

### Android (Microsoft Edge)

1. Install **Microsoft Edge** from the Play Store if you do not already use it.
2. In Edge, open the menu → **Extensions** → install and enable **Tampermonkey** (follow the in-app prompts).
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)** in Edge and confirm install in Tampermonkey.
4. Open a Collegiate login URL **in Edge** (not Chrome). Tap **Settings** on the page, enter your details, and tap **Save**.

If you usually open school email links in Chrome, copy the link and open it in Edge instead—this helper does not run in Chrome on Android.

### Android (Firefox)

1. Install **Firefox** from the Play Store and keep it updated (Tampermonkey is available in Firefox’s add-ons on recent versions).
2. In Firefox, open the menu → **Add-ons** → install **Tampermonkey**.
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/collegiateAutoSignIn/main/collegiate-auto-sign-in.user.js)** in Firefox and confirm install.
4. Open a Collegiate login URL **in Firefox**. Tap **Settings**, enter your details, and tap **Save**.

## First-time setup on the login page

1. Open a supported login URL in the **same browser** where you installed the script.
2. Tap or click **Settings** (bottom-right).
3. Enter your school **email**. Add your **OneLogin password** if you use the OneLogin step.
4. Tap or click **Save**. Look for **Settings saved.**

On your first visit, a welcome panel may open instead—you can save your email there or choose **Not now** and use **Settings** later.

**Set up once per device.** Saved email and password stay on that device in your browser’s add-on storage. They do not automatically sync to your other phone or computer.

## Daily use

**Blackbaud:** Open the student portal or login link. When automation is on, the helper fills **Email address** and clicks **Next**. Enter your Blackbaud password yourself on the next screen.

**OneLogin:** Open a CSNY OneLogin page (often right after you continue from Blackbaud). The helper fills an empty username field, or clicks **Continue** if your email is already there, then fills your saved OneLogin password and clicks **Continue**. If the wrong name is already filled in, tap or click **Not you?** yourself—the helper does not use that button.

## Settings

| Setting | What it means |
|--------|----------------|
| Enable automation | Turn the helper on or off |
| Email | Your login email (same for Blackbaud and OneLogin) |
| Password (OneLogin) | OneLogin password (optional if you only use the Blackbaud email step) |
| Automatically click Next / Continue | Let the helper press **Next** or **Continue** after it fills a field |
| Delay before Next / Continue | Short wait after typing before clicking (in milliseconds; default 300). Increase this if **Next** or **Continue** stays gray for a moment after your email appears |

## Privacy

Your email and OneLogin password are saved **only on your device** through Userscripts or Tampermonkey. They are **not** sent to GitHub or the script author. Storage is **not encrypted**—treat the device like any other place you save a password. Never put real credentials in git or in files you upload to the repo.

## Updates

- **Tampermonkey:** If you installed from the install link above, turn on **Check for updates** in Tampermonkey settings to get new versions automatically.
- **Userscripts (iPhone, iPad, Mac):** You may need to refresh or re-import the script when a new version is published on GitHub.
- **Imported file only:** If you installed from a downloaded `.user.js` file, download or import again when the repo updates.

## Troubleshooting

- **Nothing happens:** Confirm the script is **enabled** in Userscripts or Tampermonkey. Open the login page in the **same browser** you used to install (on Android, not Chrome). Check that **Settings** has your email (and OneLogin password if needed) and that you saw **Settings saved.**
- **No Settings button:** On Safari, enable the extension for that website under **Safari → Settings → Extensions** (Mac) or **Settings → Safari → Extensions** (iPhone/iPad).
- **Next or Continue stays gray briefly:** In **Settings**, increase **Delay before Next / Continue** (try 500–1000 milliseconds), save, and reload the login page.
- **Changed settings:** Reload the login page after saving **Settings**.
- **New version on GitHub:** Update or re-import the script in Userscripts or Tampermonkey, then reload the login page.

**Optional (someone technical helping you):** Open the browser’s developer console on the login page and look for messages starting with `[Collegiate Auto Sign-In]`.

Still stuck? Open an issue on [GitHub](https://github.com/techiebirb/collegiateAutoSignIn/issues).

## For developers

See [CONTRIBUTING.md](CONTRIBUTING.md) for building the script, releasing updates, and changing site selectors.

## License

[MIT](LICENSE)

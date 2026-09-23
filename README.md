# CSNY Auto Sign-in [Userscript Ver]

This helper fills in parts of the Collegiate school login for you—your **email** on the Blackbaud portal and, when needed, your **CSNY OneLogin** username and password steps. You still type your **Blackbaud password** yourself on the next screen.

After you install it once on a device, open a supported login page and use **Settings** (bottom-right corner) to save your school email and optional OneLogin password.

**Repository:** [github.com/techiebirb/CSNY-Auto-Sign-in-Userscript](https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript)

## What you need

Click your row to jump to **install** steps (or use the **update** link if you already have the script).

| Device | Browser | Add-on app | Guides |
|--------|---------|------------|--------|
| iPhone / iPad | Safari | [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) (App Store) | [Install](#install-iphone-ipad) · [Update](#update-userscripts) |
| Mac | Safari | [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) (Mac App Store) | [Install](#install-mac-safari) · [Update](#update-userscripts) |
| Mac or Windows | Chrome, Edge, or Firefox | [Tampermonkey](https://www.tampermonkey.net/) | [Install](#install-desktop-tampermonkey) · [Update](#update-tampermonkey) |
| Android phone or tablet | **Microsoft Edge** (not Chrome) | Tampermonkey (inside Edge) | [Install](#install-android-edge) · [Update](#update-tampermonkey) |
| Android phone or tablet | **Firefox** (not Chrome) | Tampermonkey (inside Firefox) | [Install](#install-android-firefox) · [Update](#update-tampermonkey) |

> **Android:** The usual **Chrome** app on Android cannot run this. Open school links in **Edge** or **Firefox** after you install Tampermonkey there.

> **Quick path (if you already know how to install a userscript):** Open the [install link](#install-link) in Userscripts or Tampermonkey and confirm **Install** → open a [supported login page](#supported-sites) → **Settings** → **Save**.

## Install link

Open this link in the browser where you installed Userscripts or Tampermonkey. When asked, confirm **Install** (or add/import the script):

**[Install CSNY Auto Sign-in [Userscript Ver]](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)**

You can also download [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) from this repo and import that file in Userscripts or Tampermonkey. If you use a downloaded file only, see [Update from a downloaded file](#update-imported-file) when a new version is published.

## Supported sites

| Site | Link to open | What the helper does |
|------|----------------|----------------------|
| Blackbaud student portal | [Student portal](https://collegiateschool.myschoolapp.com/app/student) or [login page](https://collegiateschool.myschoolapp.com/app?svcid=edu#login) | Fills **Email address** and clicks **Next**. You enter your Blackbaud password on the next step. |
| CSNY OneLogin | [OneLogin sign-in](https://csny.onelogin.com/login) (sometimes `/login2` after the portal) | Fills your username (same email), clicks **Continue**, then fills the OneLogin password you saved in **Settings** and clicks **Continue** again. |

OneLogin uses the password you save in **Settings**. Blackbaud password entry is always manual.

## Install

Pick the link that matches your device (same as the table above):

- [iPhone / iPad (Safari)](#install-iphone-ipad)
- [Mac (Safari)](#install-mac-safari)
- [Mac or Windows (Chrome, Edge, or Firefox)](#install-desktop-tampermonkey)
- [Android (Microsoft Edge)](#install-android-edge)
- [Android (Firefox)](#install-android-firefox)

### <a id="install-iphone-ipad"></a>iPhone / iPad (Safari)

1. Install **[Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)** from the App Store.
2. On your device, open **Settings → Safari → Extensions** and turn **Userscripts** on. Allow it on Collegiate sites when Safari asks.
3. **Add the script from the install link:**
   1. In **Safari**, tap the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)**. The page may look blank or show a lot of text—that’s normal; you’re looking at the script file.
   2. **Stay in Safari** on that page. Open **Userscripts** from Safari’s toolbar: tap the **puzzle piece** (extensions) next to the address bar, then tap **Userscripts**. A panel slides up from the bottom. (If you don’t see **Userscripts**, tap **Manage Extensions** and turn it on for this site.)
   3. In that panel, tap **Userscript detected: tap to install**.
   4. Scroll down if you need to, then tap **Install**.
   5. When you’re finished, tap the **checkmark** at the top of the panel to close Userscripts and return to Safari.

   *Optional:* Instead of the link, you can import [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) from the Files app inside Userscripts (AirDrop, iCloud, etc.).

4. In Safari, open a Collegiate login page from the table above. Tap **Settings**, enter your school email (and OneLogin password if you use OneLogin), then tap **Save**. You should see **Settings saved.**

### <a id="install-mac-safari"></a>Mac (Safari)

1. Install **[Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)** from the Mac App Store.
2. Open **Safari → Settings → Extensions**, enable **Userscripts**, and allow it on `collegiateschool.myschoolapp.com` and `csny.onelogin.com` when prompted.
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)** in Safari and add the script in Userscripts, or import [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js). See the [Userscripts macOS guide](https://github.com/quoid/userscripts) if you need import steps.
4. Open a Collegiate login page in **Safari**. Click **Settings**, enter your details, and click **Save**. You should see **Settings saved.**

The Userscripts *file* can sync between Apple devices if you use its sync options; your **Settings** email and password are still stored separately on each device and browser.

### <a id="install-desktop-tampermonkey"></a>Mac or Windows (Chrome, Edge, or Firefox)

1. Install **[Tampermonkey](https://www.tampermonkey.net/)** for your browser (Chrome Web Store, Edge Add-ons, or Firefox Add-ons).
2. Open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)**. Confirm when Tampermonkey asks to install. Or use **Dashboard → Utilities → Import** with the downloaded file.
3. Open a login URL from the table above. Click **Settings**, fill in your details, and click **Save**. You should see **Settings saved.**

### <a id="install-android-edge"></a>Android (Microsoft Edge)

1. Install **Microsoft Edge** from the Play Store if you do not already use it.
2. In Edge, open the menu → **Extensions** → install and enable **Tampermonkey** (follow the in-app prompts).
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)** in Edge and confirm install in Tampermonkey.
4. Open a Collegiate login URL **in Edge** (not Chrome). Tap **Settings** on the page, enter your details, and tap **Save**.

If you usually open school email links in Chrome, copy the link and open it in Edge instead—this helper does not run in Chrome on Android.

### <a id="install-android-firefox"></a>Android (Firefox)

1. Install **Firefox** from the Play Store and keep it updated (Tampermonkey is available in Firefox’s add-ons on recent versions).
2. In Firefox, open the menu → **Add-ons** → install **Tampermonkey**.
3. Open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)** in Firefox and confirm install.
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

When a new version is published on GitHub, pick the guide that matches how you installed the script:

| How you installed | Update guide |
|-------------------|--------------|
| [Tampermonkey](#update-tampermonkey) on Mac, Windows, or Android (Edge / Firefox) | Automatic or manual check in Tampermonkey |
| [Userscripts](#update-userscripts) on iPhone, iPad, or Mac Safari | Refresh or reinstall from the install link |
| [Downloaded `.user.js` file](#update-imported-file) only (no install link) | Download and import again |

Your **Settings** (email and OneLogin password) usually stay on the device after an update. If something looks wrong after updating, open **Settings** on a login page, confirm your details, tap or click **Save**, and reload the page.

### <a id="update-tampermonkey"></a>Update with Tampermonkey (Chrome, Edge, Firefox; Android Edge / Firefox)

Use this if you installed from the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)** in Tampermonkey.

**Turn on automatic updates (recommended, once per browser):**

1. Open Tampermonkey’s menu (browser toolbar icon) → **Dashboard** (or **Settings**).
2. Open the **Settings** tab.
3. Under **Security & updates** (wording may vary by browser), enable **Check for updates** (and **Notify on updates** if you want a prompt).
4. Save if asked. Tampermonkey will periodically fetch the latest script from GitHub using the update URL baked into the script.

**Update right now (manual):**

1. Open Tampermonkey → **Dashboard**.
2. Find **CSNY Auto Sign-in [Userscript Ver]** in the list.
3. Use **Check for userscript updates** from the Dashboard menu or toolbar, or open the script and look for an update notice—then confirm **Update** / **Install**.
4. Reload any open Collegiate login tabs.

**If no update appears but you know a new version was released:**

1. In the same browser, open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)** again.
2. When Tampermonkey asks, choose **Reinstall** or **Update** (wording varies). That replaces the script with the current file on GitHub.
3. Reload the login page.

### <a id="update-userscripts"></a>Update with Userscripts (iPhone, iPad, Mac Safari)

Userscripts does not use Tampermonkey’s automatic update checker. Refresh the script when the repo releases a new version (or when login pages stop behaving as expected).

**From the install link (same as first install):**

1. In **Safari**, open the **[install link](https://raw.githubusercontent.com/techiebirb/CSNY-Auto-Sign-in-Userscript/main/collegiate-auto-sign-in.user.js)**.
2. Open **Userscripts** from Safari’s extensions menu (puzzle piece → **Userscripts**).
3. If you see **Userscript detected** or an update prompt, follow it to **Install** / replace the existing script. If you already have the script, open the **Scripts** list in Userscripts, select **CSNY Auto Sign-in [Userscript Ver]**, and use the option to update or reinstall from the open tab (exact labels depend on your Userscripts version).
4. Close Userscripts (checkmark on iPhone/iPad) and reload the Collegiate login page in Safari.

**From a file (AirDrop, iCloud, download):**

1. Download the latest [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) from this repo ( **Code → Download ZIP** or open the raw file and save it).
2. In Userscripts, import the new file and replace the old **CSNY Auto Sign-in [Userscript Ver]** entry when prompted.
3. Reload the login page in Safari.

If you use Userscripts sync between Apple devices, updating the script on one device may sync the *script file*; **Settings** on each device are still separate—check **Settings** on the login page after an update if anything seems off.

### <a id="update-imported-file"></a>Update from a downloaded file only

Use this if you never used the online install link and only imported a copy of `collegiate-auto-sign-in.user.js`.

1. Get the newest file from GitHub: open [`collegiate-auto-sign-in.user.js`](collegiate-auto-sign-in.user.js) in this repo and download it, or clone/pull the repo if someone technical helps you.
2. **Tampermonkey:** Dashboard → **Utilities** → **Import** (or drag the file onto the Dashboard). Choose to **overwrite** or remove the old script first if import creates a duplicate.
3. **Userscripts:** Import the new file from the Files app or drag it into Userscripts on Mac, and replace the previous script when asked.
4. Reload the Collegiate login page in the same browser you used for import.

## Troubleshooting

- **Nothing happens:** Confirm the script is **enabled** in Userscripts or Tampermonkey. Open the login page in the **same browser** you used to install (on Android, not Chrome). Check that **Settings** has your email (and OneLogin password if needed) and that you saw **Settings saved.**
- **No Settings button:** On Safari, enable the extension for that website under **Safari → Settings → Extensions** (Mac) or **Settings → Safari → Extensions** (iPhone/iPad).
- **Next or Continue stays gray briefly:** In **Settings**, increase **Delay before Next / Continue** (try 500–1000 milliseconds), save, and reload the login page.
- **Changed settings:** Reload the login page after saving **Settings**.
- **New version on GitHub:** Follow [Updates](#updates) for your setup, then reload the login page.

**Optional (someone technical helping you):** Open the browser’s developer console on the login page and look for messages starting with `[CSNY Auto Sign-in [Userscript Ver]]`.

Still stuck? Open an issue on [GitHub](https://github.com/techiebirb/CSNY-Auto-Sign-in-Userscript/issues).

## For developers

See [CONTRIBUTING.md](CONTRIBUTING.md) for building the script, releasing updates, and changing site selectors.

## License

[MIT](LICENSE)

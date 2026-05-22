# Connecting the Tool to Your Google Account

This guide walks you through letting the Quiz Tool create and edit Google Forms on your behalf. You only need to do this **once**, and you do not need to be a developer to follow it.

## What you are about to do (in plain English)

To create a Google Form from your computer, Google requires you to:

1. **Create a "project"** in the Google Cloud Console. Think of this as a labelled folder that holds the permission settings for this tool. It is free and does not store any data.
2. **Turn on the Google Forms feature** inside that project. By default, projects can't do anything until you switch on the specific services they should access.
3. **Generate a credentials file** (`credentials.json`). This is a small text file that proves to Google "this program on this computer has my permission to ask about my forms."
4. **Save the file** in this project's folder.

The first time you actually run a command, a browser window will pop up asking you to sign in to your Google account and click "Allow." After that, the tool remembers the permission and runs silently.

## Before you start

You will need:

- A Google account (any free Gmail account works).
- A web browser.
- About **15-20 minutes**. The Google Cloud Console interface looks intimidating, but every step is just clicking through menus.

If at any point a button or menu name looks slightly different from what's described here, don't worry — Google updates this interface fairly often. The labels in this guide were accurate as of 2026, but the overall flow has remained stable for years.

---

## Step 1 — Create a Google Cloud project

1. Open <https://console.cloud.google.com/> in your browser and sign in with your Google account.
2. If this is your first time, you may be asked to agree to the Terms of Service. Accept them. (You will **not** be charged. The Forms API is free for normal use.)
3. At the very top of the page, next to the words "Google Cloud," click the "Test Project" button. (If you've never made a project before, it will say "Select a project.")
4. In the dialog that opens, click **NEW PROJECT** (top-right).
5. Give it a name like `Quiz Tool`. You can leave the "Location" field as "No organization."
6. Click **CREATE**. Wait about 10-30 seconds for Google to finish setting it up.
7. When it's done, click "Test Project" again and select your new "Quiz Tool" project so that the rest of these steps apply to it.

> **Tip:** Always check the top of the page — the project name should say "Quiz Tool" (or whatever you named it). If it shows a different name, click the picker and switch projects. This is a common point of confusion.

## Step 2 — Turn on the Google Forms & Google Drive APIs

"API" stands for Application Programming Interface — it's just Google's term for "a feature other programs are allowed to use." You need to flip this switch so the tool can talk to Google Forms.

1. In the left sidebar (click the ☰ hamburger icon in the top-left if it's hidden), find **APIs & Services** → **Library**.
2. In the search box, type `Google Forms API` and press Enter.
3. Click the result named **Google Forms API**.
4. Click the blue **ENABLE** button. Wait a few seconds for it to finish.
5. Repeat steps 2-4 for **Google Drive API**.

That's it for this step.

## Step 3 — Set up the OAuth consent screen

"OAuth" is the standard way that Google asks "do you give this program permission?" Before you can create a credentials file, Google requires you to fill in a short form describing what the program is for. This form is **only ever shown to you** (since you're the only one using the tool).

1. From the sidebar, go to **APIs & Services** → **OAuth consent screen**.
2. If you see a "Get started" button, click it. Otherwise pick **External** as the User Type and click **CREATE**. ("External" sounds scary but it just means "any Google account, including yours" — there is no "Internal" option for personal Gmail accounts.)
3. Fill in the required fields:
   - **App name**: `Quiz Tool` (or whatever you want — only you will see it).
   - **User support email**: pick your Gmail address from the dropdown.
   - **Audience**: select External
   - **Developer contact email** (at the bottom): type the same Gmail address.
   - Everything else can be left blank.
4. Click **Create**.
5. On the **Audience** page, click **+ ADD USERS** and add your own Gmail address. Click **SAVE AND CONTINUE**.
   - Why? While the app is in "Testing" mode (which is fine for personal use), only listed test users can sign in. Adding yourself unlocks it for you.
6. Review the summary and click **BACK TO DASHBOARD**.

## Step 4 — Create the credentials file

This is the step that produces the actual `credentials.json` file the tool needs.

1. From the sidebar, go to **Clients**.
2. At the top, click **Create client** and choose **Desktop app**.
   - Why? The tool runs on your computer, not on a website, so "Desktop app" is the right category.
3. Give it a name like `Quiz Tool CLI` and click **CREATE**.
4. A popup appears showing your new client. Click **DOWNLOAD JSON**.
5. Find the file in your Downloads folder — it'll be named something like `client_secret_1234567890-abcdef.apps.googleusercontent.com.json`.
6. **Rename it to `credentials.json`** and move it into the project/repo root (the same folder that contains `package.json` and this README).

To confirm it's in the right place, you can run:

```bash
ls credentials.json
```

If it prints the directory, you're set. If it says "No such file," double-check the location.

## Step 5 — Run a command for the first time

The first time the tool runs, it will use your `credentials.json` to ask Google for an access token, which it stores so you don't have to sign in again on future runs.

Try generating a sample quiz template and uploading it:

```bash
npm run dev -- init-template -o test.yaml
npm run dev -- create --input test.yaml
```

The second command will:

1. Open your default browser to a Google sign-in page.
2. After you sign in, show a screen titled **"Google hasn't verified this app"** — this is normal because your "Quiz Tool" app has not gone through Google's formal review process (and doesn't need to, since you're the only user). Click **Advanced** → **Go to Quiz Tool (unsafe)**. The "unsafe" warning is misleading; you trust this app because *you* set it up.
3. Show the permissions screen — click **Allow**.
4. Print a message back in your terminal that looks like:
   ```
   Created form ID: 1a2b3c4d...
   Responder URL: https://docs.google.com/forms/d/e/...
   Saved deployment record to .deployments/deployments.json
   ```

Open the Responder URL in a browser — you should see your sample quiz. **You're done!** Future commands will not require any browser interaction unless you delete the saved token.

---

## Where everything is saved

| File / folder                | What it is                                                    | Should I commit it to Git? |
| ---------------------------- | ------------------------------------------------------------- | -------------------------- |
| `credentials.json`           | Identifies the tool to Google. From Step 4.                   | ❌ No — already in `.gitignore` |
| `tokens/google-oauth.json`   | Saved sign-in token. Created on first run.                    | ❌ No — already in `.gitignore` |
| `.deployments/deployments.json` | Local log of forms you've created via the `create` command. | ❌ No — already in `.gitignore` |
| `.env`                       | Optional, only if you want to change file paths.              | ❌ No — already in `.gitignore` |

The `.gitignore` file is already configured to keep these out of version control.

## Optional: change file locations

By default the tool looks for `credentials.json` and `tokens/google-oauth.json` in the project root. If you want to keep them elsewhere (for example, in a personal folder shared between multiple projects):

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

Most people can skip this entirely.

---

## Troubleshooting

### "Error: OAuth did not return a refresh token"

This happens if Google thinks you've already authorized this app and doesn't want to re-issue a token. Fix:

1. Visit <https://myaccount.google.com/permissions>.
2. Find your "Quiz Tool" app (or whatever you named it) and click it.
3. Click **Remove access**.
4. Re-run the command — you'll be asked to authorize again, fresh.

### "Error: ENOENT: no such file or directory, open 'credentials.json'"

The tool can't find your credentials file. Check that:

- The file is named exactly `credentials.json` (not `client_secret_....json` — you need to rename it).
- It lives in the project root, next to `package.json`.
- Run `ls credentials.json` to verify.

### "Invalid credentials.json format"

The file isn't a valid Google credentials JSON. Make sure you:

- Downloaded from the **OAuth client ID** screen, not "Service account" or "API key."
- Did not edit the file by hand.
- If unsure, delete it and repeat Step 4.

### The browser opens but never returns

After clicking "Allow," the browser should redirect to a "localhost" page and you should see the terminal continue. If nothing happens:

- Some browsers block localhost redirects from "unverified" apps. Try a different browser (Chrome works best).
- Check that your terminal didn't already print an error.
- Make sure no firewall or VPN is blocking `localhost:3000` or similar.

### "This app is blocked" or "Access blocked: Quiz Tool has not completed the Google verification process"

You're not on the test user list. Go back to Step 3, item 6, and make sure your own Gmail address is listed as a test user.

### Forms API quota errors

The free quota (300 requests per minute) is far more than enough for normal use. If you genuinely hit limits, you're probably running automated scripts in a tight loop — add a small delay between commands.

---

## Security notes

- `credentials.json` and `tokens/google-oauth.json` give whoever has them the same permissions you granted to the tool. Treat them like passwords. Don't email them, post them in chat, or commit them to a public repository.
- The tool only requests permission to create and edit **Google Forms** that you own (`forms.body` and `drive.file` scopes). It cannot read your Drive contents, Gmail, calendar, or anything else.
- All sign-in happens between your browser and Google directly. No part of the auth flow goes through a third-party server.
- If you ever suspect a file has been leaked, revoke access at <https://myaccount.google.com/permissions> and delete the file. Then redo Step 4 to generate a fresh one.

---

## What's next?

- **First quiz:** [QUICKSTART.md](QUICKSTART.md)
- **YAML format reference:** [YAML_FORMAT.md](YAML_FORMAT.md)
- **More example quizzes:** [EXAMPLES.md](EXAMPLES.md)

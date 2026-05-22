# Manual Setup Checklist

This is a one-page condensed version of the Google account setup. **For a full, beginner-friendly walkthrough with explanations of every step, see [GOOGLE_SETUP.md](GOOGLE_SETUP.md).**

Use this page only if you've done a Google Cloud / OAuth setup before and just need the checklist.

## What's already taken care of

The application code, validation, OAuth wiring, build tooling, tests, and documentation are all in place. The only thing that requires you (a human) is the one-time Google account configuration below — Google does not allow programs to do this part on your behalf.

## The five tasks (≈15-20 minutes)

- [ ] **1. Create a Google Cloud project**  
  <https://console.cloud.google.com/> → project picker → **NEW PROJECT** → name it (e.g. `Quiz Tool`) → **CREATE** → select the new project.

- [ ] **2. Enable the Google Forms API**  
  Sidebar → **APIs & Services** → **Library** → search `Google Forms API` → click it → **ENABLE**.

- [ ] **3. Configure the OAuth consent screen**  
  Sidebar → **APIs & Services** → **OAuth consent screen** → **External** → fill in app name + your email twice → **SAVE AND CONTINUE** through scopes → add your Gmail as a test user → **BACK TO DASHBOARD**.

- [ ] **4. Create OAuth credentials**  
  Sidebar → **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID** → application type **Desktop app** → name it → **CREATE** → **DOWNLOAD JSON**.

- [ ] **5. Save the credentials file**  
  Rename the downloaded file to `credentials.json` and move it to the project root (next to `package.json`).  
  Verify with `ls credentials.json`.

## Verify it works

- [ ] `npm install`
- [ ] `npm run dev -- init-template -o test.yaml` (generates a sample YAML — no Google call yet)
- [ ] `npm run dev -- create --input test.yaml` (first run will open your browser to authorize; subsequent runs are silent)

If the second command prints a form ID and a Responder URL, you're set.

## Files the setup creates (none are committed to Git)

| File                            | Created by  | Purpose                                |
| ------------------------------- | ----------- | -------------------------------------- |
| `credentials.json`              | You (Step 5)| Identifies the tool to Google.         |
| `tokens/google-oauth.json`      | First run   | Cached access token. Auto-refreshed.   |
| `.deployments/deployments.json` | `create`    | Local log of forms you've created.     |

All four entries (`credentials.json`, `tokens/`, `.deployments/`, `.env`) are already in `.gitignore`.

## Where to get help during setup

| Issue                                                        | Where to look                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Don't know what something means / where to click             | [GOOGLE_SETUP.md](GOOGLE_SETUP.md) — full walkthrough                          |
| `OAuth did not return a refresh token`                       | [GOOGLE_SETUP.md → Troubleshooting](GOOGLE_SETUP.md#troubleshooting)            |
| Browser shows "Access blocked: Quiz Tool"                    | You missed Step 3 — add yourself as a test user                                |
| Need to customize file paths                                 | [GOOGLE_SETUP.md → Optional: change file locations](GOOGLE_SETUP.md#optional-change-file-locations) |

## After setup

You're ready to use the tool. Continue with **[QUICKSTART.md](QUICKSTART.md)** or jump to the **[README.md](README.md)** command reference.

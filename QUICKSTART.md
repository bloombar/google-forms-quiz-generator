# Quickstart

This guide gets you from zero to "I just made a Google Form from a text file" in about 30 minutes the first time, and under 1 minute every time after.

## What you need

- **Node.js 18 or newer.** Check by running `node --version`. If you see a number 18 or higher, you're set. If not, install it from <https://nodejs.org/> (the "LTS" download is what you want).
- **A Google account.** Any free Gmail works.
- **A terminal.** On macOS, the built-in Terminal app. On Windows, "Command Prompt" or "PowerShell" both work. On Linux, your usual shell.

You do **not** need any prior experience with Google APIs, OAuth, TypeScript, or the command line beyond running a few commands.

## Step 1 — Install the tool (2 minutes)

If you haven't already, get the project files onto your computer (either by cloning the repo with Git or by extracting a download).

Then in the project folder, run:

```bash
npm install
```

This downloads the third-party libraries the tool depends on. It only takes a minute or two, and only needs to be done once.

## Step 2 — Connect to your Google account (15-20 minutes, one time only)

Follow **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)**. It walks you through:

- Creating a free Google Cloud project (a settings folder for the tool).
- Turning on the Google Forms feature.
- Downloading a `credentials.json` file and putting it in this project's folder.

That document is the one to read carefully — the steps look long because Google's interface has many menus, but each step is just clicking through a wizard.

When you're done, you should have a `credentials.json` file sitting next to `package.json`.

## Step 3 — Create your first form (2 minutes)

Generate a sample quiz template:

```bash
npm run dev -- init-template -o sample.yaml
```

You'll get a file called `sample.yaml` containing a few example questions. Open it in any text editor (VS Code, TextEdit, Notepad, nano, vim — anything).

Now upload it to Google Forms:

```bash
npm run dev -- create --input sample.yaml
```

The first time you run this, your browser will open and ask you to sign in to Google and click **Allow**. (You may see an "unverified app" warning — this is normal because *you* set up the app and Google's verification process is meant for apps used by strangers. Click **Advanced** → **Go to Quiz Tool (unsafe)** → **Allow**.)

After a few seconds, you'll see something like:

```text
Created form ID: 1a2b3c4d5e6f7g8h9i0j
Responder URL: https://docs.google.com/forms/d/e/.../viewform
Saved deployment record to .deployments/deployments.json
```

Click the Responder URL to see your quiz. **You're done.** 🎉

## What just happened?

- `sample.yaml` is a plain text description of a quiz.
- `npm run dev -- create` translated it into Google Forms API calls.
- The tool saved your form's ID and URL to `.deployments/deployments.json` so you have a local log of every form you've created with the tool.

## Common commands

| What you want to do            | Command                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Start a new quiz from scratch  | `npm run dev -- init-template -o quiz.yaml`                                  |
| Upload a YAML as a new form    | `npm run dev -- create --input quiz.yaml`                                    |
| Save it to a Drive folder      | `npm run dev -- create --input quiz.yaml --folder-id YOUR_FOLDER_ID`         |
| Download an existing form      | `npm run dev -- download --form-id FORM_ID -o quiz.yaml`                     |
| Update an existing form        | `npm run dev -- update --form-id FORM_ID --input quiz.yaml`                  |

## Editing a quiz

1. **Create or download a YAML file.** Either start with the template (`init-template`) or pull down an existing form (`download`).
2. **Edit `quiz.yaml`** in any text editor. The format is human-readable — see [YAML_FORMAT.md](YAML_FORMAT.md) for the full reference, or copy from [EXAMPLES.md](EXAMPLES.md).
3. **Upload your changes.** Use `create` to make a new form, or `update` (with the form ID) to overwrite an existing one.

## How to find a Google Form's ID

Open the form in Google Forms. The address bar will say:

```text
https://docs.google.com/forms/d/THIS_PART_IS_THE_FORM_ID/edit
```

Copy the part between `/d/` and `/edit`.

## What can the tool do (and not do)?

It **can**:

- Create, download, and update Google Forms quizzes.
- Handle radio-button, checkbox, dropdown, and text questions.
- Set point values and mark correct answers for auto-grading.
- Place new forms inside a specific Drive folder.

It **cannot**:

- Add images or videos to questions.
- Create conditional branching ("if you answer X, jump to question 5").
- View or analyze response data.
- Style the form (colours, fonts, headers).

For the full list see the [Limitations section in the README](README.md#limitations).

## Troubleshooting the first run

### `Cannot find module 'dotenv'` (or similar)

You skipped `npm install`. Run it.

### Browser opens and says "Access blocked"

Your Gmail isn't on the test users list. Go to [GOOGLE_SETUP.md → Step 3](GOOGLE_SETUP.md#step-3--set-up-the-oauth-consent-screen), item 6, and add yourself.

### `Error: OAuth did not return a refresh token`

You authorised this app before and Google won't re-issue a token. Visit <https://myaccount.google.com/permissions>, remove the Quiz Tool app, then re-run the command.

### Form was created but is empty

The YAML parsed but contained no `questions:`. Re-generate the template and compare.

For more, see [GOOGLE_SETUP.md → Troubleshooting](GOOGLE_SETUP.md#troubleshooting).

## Tips

- **Keep your YAML files in version control** (Git, Dropbox, etc.) — they're plain text and easy to diff.
- **`update` replaces ALL questions** — there's no merge. If you want to keep a baseline, copy the YAML file before editing.
- **Share the Responder URL**, never the `/edit` URL — the edit URL gives full edit access.

## Next steps

- Read the [YAML format reference](YAML_FORMAT.md).
- Browse [example quizzes](EXAMPLES.md) for inspiration.
- Look at [ADVANCED.md](ADVANCED.md) if you want to script bulk uploads or run the tool in CI.

Happy quizzing!

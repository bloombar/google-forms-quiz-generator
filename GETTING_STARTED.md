# Getting Started

This is the friendly landing page for the Google Forms Quiz Tool. If you'd rather just dive in, head straight to [QUICKSTART.md](QUICKSTART.md).

## In one paragraph

The Google Forms Quiz Tool lets you describe a Google Forms quiz in a plain text file (YAML) and then create, download, or update real Google Forms with a single command. The text file is yours to edit, share, and keep in version control. You set the tool up with your Google account once, and after that everything happens from the command line.

## What you'll need

- **Node.js 18 or newer** — install from <https://nodejs.org/> if you don't already have it.
- **A free Google account** — any Gmail address works.
- **About 30 minutes** for the first setup. After that, creating a new quiz takes seconds.

## The three doors

Pick the door that matches where you are:

1. **"I just want to make a quiz, walk me through it."**  
   → Read [QUICKSTART.md](QUICKSTART.md). Step-by-step from install to your first uploaded form.

2. **"I'm stuck on the Google Cloud / OAuth setup."**  
   → Read [GOOGLE_SETUP.md](GOOGLE_SETUP.md). A friendly, jargon-free walkthrough of the Google Cloud Console screens.

3. **"I just need a YAML field reference / a sample quiz / advanced scripting."**  
   → [YAML_FORMAT.md](YAML_FORMAT.md), [EXAMPLES.md](EXAMPLES.md), or [ADVANCED.md](ADVANCED.md) respectively.

## The basic flow, in pictures

```text
   ┌──────────────────┐    init-template     ┌──────────────────┐
   │                  │ ────────────────────▶│                  │
   │  Your text       │                      │  quiz.yaml       │
   │  editor          │ ◀─────────────────── │  (a plain file)  │
   │                  │       download       │                  │
   └──────────────────┘                      └──────────────────┘
                                                       │
                                                       │  create / update
                                                       ▼
                                              ┌──────────────────┐
                                              │  Google Forms    │
                                              │  (in the cloud)  │
                                              └──────────────────┘
```

You edit a YAML file. The tool pushes it to Google Forms (or pulls one down for editing).

## The four commands

| Command         | Sentence-long description                                              |
| --------------- | ---------------------------------------------------------------------- |
| `init-template` | Make a starter YAML file you can edit.                                 |
| `create`        | Upload a YAML file as a brand-new Google Form.                         |
| `download`      | Save an existing Google Form to a YAML file so you can edit it.        |
| `update`        | Replace the questions in an existing Google Form with your YAML.       |

All four are run as `npm run dev -- <command> [options]`.

## A few key terms

- **YAML** — a text format using indentation and `key: value` pairs. Easier to read than JSON, easier to edit than XML. The file extension is `.yaml` or `.yml`.
- **Form ID** — the unique string Google assigns each form. You'll see it in the URL: `docs.google.com/forms/d/THIS_IS_THE_ID/edit`. The tool prints it after every `create`.
- **Responder URL** — the public link you share with people taking the quiz. Printed after `create`. Don't confuse it with the edit URL.
- **OAuth** — Google's "do you grant this app permission?" system. You'll click through it once during the first setup; after that the tool remembers.

## What's next?

Head over to **[QUICKSTART.md](QUICKSTART.md)** for the actual install-and-run walkthrough. If you've never used the Google Cloud Console, read **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)** alongside it.

Happy quizzing!

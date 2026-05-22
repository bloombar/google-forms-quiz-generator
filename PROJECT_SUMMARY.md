# Project Summary

A high-level overview of the Google Forms Quiz Tool — what it is, what it does, and how it's put together.

## What this is

The Google Forms Quiz Tool is a small command-line application that lets you manage Google Forms quizzes using plain-text YAML files. You can create, download, and update quizzes entirely from your terminal — no clicking through the Forms web UI required.

The use cases that motivate it:

- **Version control for quizzes**: store quiz YAMLs in Git alongside other course or training materials.
- **Bulk authoring**: write or generate many quizzes from data, then upload them in one go.
- **Templating and duplication**: download a form, tweak the YAML, upload as a new form.
- **Collaboration**: share a YAML file with a colleague the way you'd share any other text document.

## What it supports

### Question types

| Type              | Renders as in Google Forms                |
| ----------------- | ----------------------------------------- |
| `single_choice`   | Radio buttons (one answer)                |
| `multiple_choice` | Checkboxes (multiple answers)             |
| `dropdown`        | Dropdown list                             |
| `short_text`      | Single-line text input                    |
| `long_text`       | Multi-line text area                      |

### Features

- Correct-answer marking (`isCorrect: true` or `correctAnswers: [...]`).
- Per-question points for auto-graded scoring.
- Required vs. optional questions.
- Per-question descriptions/hints.
- Quiz mode (with scoring) and survey mode (no scoring).
- Strict YAML validation before any API call.
- Optional placement of new forms inside a chosen Drive folder.
- A local deployment log (`.deployments/deployments.json`) recording every form created via the tool.

### Commands

| Command         | What it does                                              |
| --------------- | --------------------------------------------------------- |
| `init-template` | Write a starter YAML quiz file you can edit.              |
| `create`        | Upload a YAML as a brand-new Google Form.                 |
| `download`      | Save an existing Google Form to a YAML file.              |
| `update`        | Replace all questions in an existing form from YAML.      |

## What it deliberately does not do

- No form styling (colours, fonts, header images).
- No page sections or conditional branching ("if you answered X, go to question Y").
- No rich media — images and videos are not managed (they're skipped on download).
- No response data — viewing or exporting submissions.
- Text auto-grading is exact-match only (a Google Forms limitation, not ours).

These omissions are deliberate: the tool focuses on quiz **content** so the YAML stays portable and easy to diff.

## How it's structured

### Source layout

```text
src/
├── cli.ts                  CLI entry point (yargs-based)
└── lib/
    ├── types.ts            Quiz model TypeScript interfaces
    ├── validation.ts       Pre-upload YAML validation
    ├── quiz-file.ts        YAML read/write/template
    ├── google-forms.ts     Translation between quiz model ⇄ Google Forms API
    ├── google-auth.ts      OAuth 2.0 flow and token caching
    └── deployments.ts      Appends to .deployments/deployments.json
tests/                      vitest suite (mirrors src/)
examples/sample-quiz.yaml   Reference quiz with one of each question type
```

### Technology stack

- **Runtime**: Node.js 18+.
- **Language**: TypeScript (ESM modules, strict mode).
- **CLI framework**: yargs.
- **Google APIs**: `googleapis` v140.
- **Auth**: `@google-cloud/local-auth` for the local browser OAuth flow.
- **YAML**: `js-yaml`.
- **Tests**: vitest with the V8 coverage provider.
- **Build**: TypeScript compiler (`tsc`).

### Authentication model

The tool uses OAuth 2.0 with Google's "Installed Application" flow:

1. You set up an OAuth client in your own Google Cloud project (one time — see [GOOGLE_SETUP.md](GOOGLE_SETUP.md)).
2. On first run, the tool opens a browser, you sign in and grant the requested scopes (`forms.body` and `drive.file`).
3. A refresh token is cached locally to `tokens/google-oauth.json` for future runs.

No part of the auth flow involves a third-party server. The token is yours, on your machine, and you can revoke it at any time via your Google account settings.

## Setup overview (full details in [GOOGLE_SETUP.md](GOOGLE_SETUP.md))

1. **Install Node.js 18+** and run `npm install`.
2. **Create a free Google Cloud project**, enable the Forms API, and download an OAuth client credentials file (`credentials.json`).
3. **Save** `credentials.json` to the project root.
4. **Run any command** — the first run will pop up a browser to authorise the tool.

## Usage examples

### Create from scratch

```bash
npm run dev -- init-template -o quiz.yaml
# edit quiz.yaml
npm run dev -- create --input quiz.yaml
# prints: Created form ID: 1a2b3c4d...
#         Responder URL: https://...
```

### Edit an existing form

```bash
npm run dev -- download --form-id 1a2b3c4d... -o quiz.yaml
# edit quiz.yaml
npm run dev -- update --form-id 1a2b3c4d... --input quiz.yaml
```

### Minimal YAML

```yaml
version: 1
title: My Quiz
description: A short description.
isQuiz: true
questions:
  - title: What is 2 + 2?
    type: single_choice
    points: 1
    required: true
    options:
      - value: "3"
      - value: "4"
        isCorrect: true
      - value: "5"
```

## Build and run modes

```bash
npm run dev -- <command>     # dev mode (runs TS directly via tsx)
npm run build                # compile to dist/
npm run start -- <command>   # production mode (runs compiled JS)
npm run lint                 # lint with eslint
npm test                     # run the test suite
npm run test:watch           # tests in watch mode
```

When installed via npm, the binary is `quiz-tool` (declared in `package.json`'s `bin` field).

## Security and privacy

- `credentials.json`, `tokens/google-oauth.json`, and `.deployments/` are all in `.gitignore`.
- The OAuth scopes requested are scoped to forms and to drive files **the tool itself creates** — it cannot read your wider Drive or other Google data.
- Authentication happens locally between your browser and Google; no third-party server is involved.

## Documentation overview

| File                                                | Audience / purpose                              |
| --------------------------------------------------- | ----------------------------------------------- |
| [README.md](README.md)                              | First-stop overview and command reference.     |
| [GETTING_STARTED.md](GETTING_STARTED.md)            | One-page friendly orientation.                  |
| [QUICKSTART.md](QUICKSTART.md)                      | Step-by-step first-run tutorial.               |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md)                  | Beginner-friendly Google Cloud walkthrough.    |
| [MANUAL_SETUP.md](MANUAL_SETUP.md)                  | One-page setup checklist.                       |
| [YAML_FORMAT.md](YAML_FORMAT.md)                    | Complete YAML field reference.                  |
| [EXAMPLES.md](EXAMPLES.md)                          | Ready-to-copy example quizzes.                  |
| [ADVANCED.md](ADVANCED.md)                          | Scripting, CI/CD, environment, deployment log. |
| [INDEX.md](INDEX.md)                                | Topic-by-topic doc map.                         |
| [FILE_GUIDE.md](FILE_GUIDE.md)                      | Project file reference.                         |
| [CHANGELOG.md](CHANGELOG.md)                        | Release history.                                |

## Future direction

Planned enhancements are tracked in [CHANGELOG.md](CHANGELOG.md#planned). High-priority items include a `--dry-run` flag, JSON/CSV import, and a non-destructive update mode.

The architecture is deliberately modular so additional question types or features can slot into the existing `validation.ts` / `google-forms.ts` / `types.ts` triad with focused changes.

# Google Forms Quiz Tool

A small command-line tool that lets you write Google Forms quizzes in a plain text file (YAML) and upload them to Google Forms with a single command. You can also download existing forms and edit them locally.

If you've ever wanted to keep a quiz under version control, share it as a file with a colleague, or generate many similar quizzes from a script — this is for you.

## What it does

- **Create** new Google Forms quizzes from a YAML file.
- **Download** an existing form and save it as YAML so you can edit it in any text editor.
- **Update** a form by replacing its questions with the contents of your YAML.
- Supports five question types: single-choice, multiple-choice, dropdown, short text, and long text.
- Supports answer keys, point values, and auto-grading.

## Who this is for

You **don't** need to be a developer to use this tool. You do need to be willing to:

1. Install Node.js (about 5 minutes).
2. Click through a one-time Google setup to give the tool permission to manage your forms (about 15-20 minutes).
3. Edit a text file. If you've ever written a recipe or a configuration file, you can write a quiz.

---

## Getting started — read these in order

1. **[QUICKSTART.md](QUICKSTART.md)** — Install, connect to Google, and create your first form. Aim for 30 minutes the first time.
2. **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)** — Step-by-step walkthrough of the Google Cloud Console setup, written for people who have never touched it before.
3. **[YAML_FORMAT.md](YAML_FORMAT.md)** — Every field you can use in a quiz file, with examples.
4. **[EXAMPLES.md](EXAMPLES.md)** — Ready-to-copy quizzes for different scenarios (math, language, training, classroom assessment, survey).
5. **[ADVANCED.md](ADVANCED.md)** — Scripting, automation, CI/CD, environment variables, and tips for power users.

If you ever feel lost, [INDEX.md](INDEX.md) is a topic-by-topic map of all documentation.

---

## At a glance

### Install

```bash
npm install
```

### One-time Google setup

Follow [GOOGLE_SETUP.md](GOOGLE_SETUP.md) to create a `credentials.json` file and save it to the project root.

### Commands

| Command         | What it does                                                |
| --------------- | ----------------------------------------------------------- |
| `init-template` | Write a starter quiz YAML file you can edit.                |
| `create`        | Upload a YAML file as a brand-new Google Form.              |
| `download`      | Save an existing Google Form to a YAML file.                |
| `update`        | Replace the questions in an existing Google Form from YAML. |

Each command is run via `npm run dev --` followed by the command name. For example:

```bash
npm run dev -- init-template -o quiz.yaml
npm run dev -- create --input quiz.yaml
npm run dev -- create --input quiz.yaml --folder-id 1AbCdEfGhIjKlMnOp
npm run dev -- download --form-id 1a2b3c4d... --output quiz.yaml
npm run dev -- update --form-id 1a2b3c4d... --input quiz.yaml
```

After `create`, the tool prints the new form's ID and a Responder URL (the link you share with quiz-takers). It also appends a record to `.deployments/deployments.json` so you have a local log of every form you've created.

### A minimal YAML file

```yaml
version: 1
title: My First Quiz
description: A short description shown to respondents.
isQuiz: true
emailCollection: verified
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

  - title: Select all prime numbers.
    type: multiple_choice
    points: 2
    options:
      - value: "2"
        isCorrect: true
      - value: "3"
        isCorrect: true
      - value: "4"

  - title: One word — the largest ocean on Earth.
    type: short_text
    correctAnswers:
      - Pacific
```

See [YAML_FORMAT.md](YAML_FORMAT.md) for the complete reference.

### Question types

| Type              | What respondents see                          |
| ----------------- | --------------------------------------------- |
| `single_choice`   | Radio buttons — pick exactly one option.      |
| `multiple_choice` | Checkboxes — pick any number of options.      |
| `dropdown`        | A dropdown menu — pick one option.            |
| `short_text`      | A single-line text box.                       |
| `long_text`       | A multi-line text area (for longer answers).  |

---

## Common workflows

### Make a brand-new quiz

```bash
npm run dev -- init-template -o quiz.yaml   # create a starter file
# open quiz.yaml in your editor, change the title and questions
npm run dev -- create --input quiz.yaml     # upload to Google Forms
# share the printed Responder URL with quiz-takers
```

### Edit a quiz you already created

```bash
npm run dev -- download --form-id YOUR_FORM_ID -o quiz.yaml
# edit quiz.yaml
npm run dev -- update --form-id YOUR_FORM_ID --input quiz.yaml
```

### Make a duplicate of an existing quiz

```bash
npm run dev -- download --form-id SOURCE_FORM_ID -o quiz.yaml
# change the title in quiz.yaml
npm run dev -- create --input quiz.yaml     # creates a NEW form
```

### Put new forms into a specific Drive folder

Add `--folder-id` (the part of the Drive folder URL after `folders/`) to the `create` command:

```bash
npm run dev -- create --input quiz.yaml --folder-id 1AbCdEfGhIjKlMnOp
```

### Find a form's ID

Open the form in Google Forms. The URL looks like:

```text
https://docs.google.com/forms/d/THIS_IS_THE_FORM_ID/edit
```

Copy the string between `/d/` and `/edit`.

---

## Development

For contributors, or if you want to build the tool from source:

```bash
npm run build            # compile TypeScript to dist/
npm run start -- --help  # run the compiled version
npm run dev -- --help    # run directly from TypeScript (no build needed)
npm run lint             # run eslint
npm test                 # run the test suite (vitest)
npm run test:watch       # run tests in watch mode
```

The test suite covers the YAML parser, validator, Google Forms API mapping, OAuth flow, deployment tracking, and CLI commands.

### Use as a library

Besides the CLI, the package exports its core so another app can create quizzes in-process. You supply the authorized `OAuth2Client` (the CLI's browser flow is not used here):

```ts
import { createGoogleFormFromQuiz, validateQuizForm } from "google-forms-quiz-tool"

const quiz = validateQuizForm(myQuizObject)
const { formId, responderUri } = await createGoogleFormFromQuiz(quiz, {
  auth,
  folderId,
})
```

`auth` is any authenticated `google-auth-library` `OAuth2Client` (e.g. built from a stored refresh token). Only the auth-agnostic core is exported — the interactive CLI auth and local deployment tracking are not.

---

## Limitations

This tool deliberately focuses on quiz content. It does **not** manage:

- Images, videos, or rich media in questions. Download skips non-question items.
- Page sections, conditional branching, or "go to section based on answer."
- Form styling (colours, fonts, header images, themes).
- Response data — viewing submissions, analytics, exports.
- Text question grading is best-effort: Google Forms only auto-grades text by exact string match, so very flexible grading still requires manual review.

The `update` command **replaces all questions** in a form. It does not merge — anything in the form that isn't in your YAML is removed.

---

## Troubleshooting cheat sheet

| Symptom                                  | Likely cause / fix                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `Cannot find credentials`                | You haven't completed [GOOGLE_SETUP.md](GOOGLE_SETUP.md) yet.                   |
| `OAuth did not return a refresh token`   | Revoke access at <https://myaccount.google.com/permissions> and re-run.         |
| `YAML validation error: ...`             | See [YAML_FORMAT.md](YAML_FORMAT.md) and check the field mentioned in the error.|
| `Form created but no questions`          | YAML parsed but had no `questions:` array. Compare to the template.             |
| `Cannot find form`                       | Form ID is wrong, or your Google account doesn't have edit access to that form. |
| `Warning: ... Drive file could not be renamed or moved (HTTP 403)` | Not an error — the form's content was saved. The tool can only rename/move forms it created itself (the `drive.file` scope), so for forms made elsewhere this rename is skipped. The command still succeeds. |

More cases in [GOOGLE_SETUP.md](GOOGLE_SETUP.md#troubleshooting) and [ADVANCED.md](ADVANCED.md#error-handling-and-debugging).

## License

MIT

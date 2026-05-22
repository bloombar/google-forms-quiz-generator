# Advanced Usage

For users who are comfortable with the basics and want to script, automate, or deeply customise the tool. If you're just getting started, read [QUICKSTART.md](QUICKSTART.md) first.

## Command reference

Every command is run as:

```bash
npm run dev -- <command> [options]
```

In production (after `npm run build`) you can also use `npm run start -- <command>` or, if you've installed the tool globally, `quiz-tool <command>`.

### `init-template`

Write a starter YAML file with one of each question type.

```bash
npm run dev -- init-template --output quiz.yaml
# short form:
npm run dev -- init-template -o quiz.yaml
```

| Option            | Required | Description                                |
| ----------------- | -------- | ------------------------------------------ |
| `-o, --output`    | yes      | Path to write the template YAML file.      |

### `create`

Upload a YAML file as a new Google Form.

```bash
npm run dev -- create --input quiz.yaml
npm run dev -- create --input quiz.yaml --folder-id 1AbCdEfGhIjKlMnOp
```

| Option            | Required | Description                                                                                                  |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `-i, --input`     | yes      | Path to the YAML file.                                                                                       |
| `--folder-id`     | no       | Drive folder ID to move the new form into. Find it after `/folders/` in the folder's URL.                    |

Prints the new form ID, the responder URL, and appends a record to `.deployments/deployments.json` (see [Deployment tracking](#deployment-tracking) below).

### `download`

Save an existing Google Form as YAML.

```bash
npm run dev -- download --form-id 1a2b3c4d... --output quiz.yaml
# short form:
npm run dev -- download -f 1a2b3c4d... -o quiz.yaml
```

| Option            | Required | Description                                                       |
| ----------------- | -------- | ----------------------------------------------------------------- |
| `-f, --form-id`   | yes      | The Google Form ID to download.                                   |
| `-o, --output`    | yes      | Path to write the YAML file.                                      |

Non-question items (images, videos, page sections) are skipped silently.

### `update`

Replace **all** questions in an existing form with the contents of a YAML file.

```bash
npm run dev -- update --form-id 1a2b3c4d... --input quiz.yaml
```

| Option            | Required | Description                                              |
| ----------------- | -------- | -------------------------------------------------------- |
| `-f, --form-id`   | yes      | The Google Form ID to update.                            |
| `-i, --input`     | yes      | Path to the YAML file.                                   |

> **Warning:** This deletes every existing question first. There is no merge mode. Keep a backup if you want one.

## Environment variables

The tool reads from `.env` (or the actual environment) at startup. Copy `.env.example` to `.env` to override defaults:

```dotenv
GOOGLE_CREDENTIALS_PATH=/absolute/path/to/credentials.json
GOOGLE_TOKEN_PATH=/absolute/path/to/tokens/google-oauth.json
```

| Variable                  | Default                         | Description                                         |
| ------------------------- | ------------------------------- | --------------------------------------------------- |
| `GOOGLE_CREDENTIALS_PATH` | `credentials.json`              | Path to the OAuth client credentials file.         |
| `GOOGLE_TOKEN_PATH`       | `tokens/google-oauth.json`      | Where the cached sign-in token is written.         |

You can also set them inline:

```bash
GOOGLE_CREDENTIALS_PATH=creds-dev.json npm run dev -- create -i quiz.yaml
```

This is the cleanest way to run the same command against multiple Google accounts (e.g. dev vs. prod).

## Deployment tracking

Every successful `create` appends a JSON entry to `.deployments/deployments.json`:

```json
[
  {
    "title": "My Quiz",
    "formId": "1a2b3c4d5e6f7g8h9i0j",
    "responderUrl": "https://docs.google.com/forms/d/e/.../viewform",
    "folderId": "1AbCdEfGhIjKlMnOp",
    "deployedAt": "2026-05-21T19:30:00.000Z"
  }
]
```

This is a local file (not synced to Google) intended as your own running log of forms you've created — useful if you've forgotten a form ID, or want to script bulk updates. The directory is in `.gitignore` so it's never committed.

If you want to query it, any JSON tool works:

```bash
# list every form you've ever deployed
cat .deployments/deployments.json | jq '.[] | "\(.title): \(.formId)"'
```

## Scripting and automation

### Batch-create from a folder of YAML files

```bash
#!/bin/bash
for file in quizzes/*.yaml; do
  echo "Creating $file..."
  npm run dev -- create --input "$file"
done
```

### Batch-download a list of form IDs

Put one form ID per line in `form_ids.txt`:

```bash
#!/bin/bash
mkdir -p downloads
while read -r form_id; do
  echo "Downloading $form_id..."
  npm run dev -- download \
    --form-id "$form_id" \
    --output "downloads/${form_id}.yaml"
done < form_ids.txt
```

### Programmatic quiz generation

Generate a quiz from data using Node.js:

```js
// generate-quiz.mjs
import fs from "node:fs";
import yaml from "js-yaml";

const questions = [];
for (let i = 1; i <= 10; i++) {
  questions.push({
    title: `Question ${i}`,
    type: "single_choice",
    points: 1,
    options: [
      { value: "A" },
      { value: "B", isCorrect: true },
      { value: "C" },
    ],
  });
}

const quiz = {
  version: 1,
  title: "Auto-Generated Quiz",
  isQuiz: true,
  questions,
};

fs.writeFileSync("generated-quiz.yaml", yaml.dump(quiz));
console.log("Wrote generated-quiz.yaml");
```

Run:

```bash
node generate-quiz.mjs
npm run dev -- create --input generated-quiz.yaml
```

You can adapt this pattern to read questions from a CSV, a database, an LLM, etc., then push them to Google Forms.

## CI/CD integration

You can keep your quizzes in Git and auto-sync them to Google Forms whenever a YAML changes.

### GitHub Actions example

```yaml
# .github/workflows/quiz-sync.yml
name: Sync Quizzes

on:
  push:
    paths:
      - "quizzes/**"

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install
      - name: Restore credentials
        run: echo "${{ secrets.GOOGLE_CREDENTIALS_BASE64 }}" | base64 -d > credentials.json
      - name: Restore OAuth token
        run: |
          mkdir -p tokens
          echo "${{ secrets.GOOGLE_OAUTH_TOKEN_BASE64 }}" | base64 -d > tokens/google-oauth.json
      - name: Update forms
        run: |
          for file in quizzes/*.yaml; do
            npm run dev -- create --input "$file"
          done
```

Notes:

- Store both `credentials.json` and an already-authenticated `tokens/google-oauth.json` as base64-encoded GitHub secrets. CI can't open a browser to do the OAuth dance, so you need to run the first authorization locally and copy the resulting token file to CI.
- Refresh tokens last until you revoke them — but if Google invalidates one, you'll need to re-authenticate locally and rotate the secret.

## Working with very large quizzes

The tool handles quizzes with hundreds of questions, but uploads slow down as size grows. Practical advice:

- **Split very large assessments** into multiple shorter forms — easier on respondents too.
- **Edit YAML in bulk** before pushing, rather than uploading after every small change.
- **Memory:** if you ever push a YAML with thousands of questions, increase Node's heap: `node --max-old-space-size=4096 dist/cli.js ...`.

## Running tests

The project ships with a vitest test suite covering YAML I/O, validation, the Google Forms mapping layer, OAuth helpers, deployment tracking, and the CLI.

```bash
npm test            # run all tests once
npm run test:watch  # re-run tests as you edit
```

A coverage report is written to `coverage/` when tests run.

## Error handling and debugging

### Common error messages

| Message                                 | Likely cause                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `Cannot find credentials`               | `credentials.json` is missing — finish [GOOGLE_SETUP.md](GOOGLE_SETUP.md).                |
| `OAuth did not return a refresh token`  | Revoke at <https://myaccount.google.com/permissions> and re-run.                          |
| `Cannot find form`                      | Wrong form ID, or your account doesn't have edit access.                                  |
| `YAML parse error`                      | Bad indentation or quoting — paste your file into an online YAML linter.                  |
| `Invalid credentials.json format`       | Downloaded the wrong file type (e.g. Service account instead of OAuth client ID).         |

### Re-authenticating

If your saved token is invalid, delete it:

```bash
rm tokens/google-oauth.json
```

The next command will reopen the browser to ask for permission again.

### Inspecting the compiled output

```bash
npm run build
ls -la dist/
```

The compiled JS lives in `dist/` and mirrors the structure of `src/`.

## Version control best practices

- **Commit your quiz YAMLs** to a Git repository. They're plain text and diff cleanly.
- **Don't commit** `credentials.json`, `tokens/`, or `.deployments/` — they're already excluded by `.gitignore`.
- **Record form IDs** alongside the YAML so you can `update` later. A simple convention:

  ```text
  quizzes/
    math-quiz.yaml
    math-quiz.id      # contains a single line with the form ID
  ```

## Extending the tool

The source is organized so that each concern lives in one file:

| File                              | Responsibility                                  |
| --------------------------------- | ----------------------------------------------- |
| `src/cli.ts`                      | Command definitions (yargs).                    |
| `src/lib/types.ts`                | TypeScript interfaces for the quiz model.       |
| `src/lib/validation.ts`           | Pre-upload YAML validation.                     |
| `src/lib/quiz-file.ts`            | Reading, writing, and templating YAML files.    |
| `src/lib/google-forms.ts`         | Translating between quiz model and Google API.  |
| `src/lib/google-auth.ts`          | OAuth flow and token caching.                   |
| `src/lib/deployments.ts`          | Appending entries to `.deployments/`.            |

To add a new question type, you'd typically:

1. Add it to the `QuizQuestionType` union in `types.ts`.
2. Teach `validation.ts` how to validate it.
3. Add a mapping in `google-forms.ts` between the new type and the corresponding `Schema$Item`.
4. Add tests in `tests/`.

## Tips

### Extracting an ID from a Google Forms URL

```bash
url="https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j/edit"
echo "$url" | sed -E 's|.*/d/([^/]+)/.*|\1|'
# 1a2b3c4d5e6f7g8h9i0j
```

### Using different Google accounts side by side

```bash
# Dev (account A):
GOOGLE_CREDENTIALS_PATH=creds-dev.json GOOGLE_TOKEN_PATH=tokens/dev.json \
  npm run dev -- create -i quiz.yaml

# Prod (account B):
GOOGLE_CREDENTIALS_PATH=creds-prod.json GOOGLE_TOKEN_PATH=tokens/prod.json \
  npm run dev -- create -i quiz.yaml
```

### Preview a YAML before uploading

```bash
npm run dev -- init-template -o preview.yaml
cat preview.yaml         # quick sanity check
# or
npm run dev -- download -f FORM_ID -o preview.yaml
```

## Reporting issues

When filing a bug, please include:

1. The command you ran.
2. The full error message.
3. A minimal YAML file that reproduces the issue (scrubbed of any sensitive data).
4. The Node version (`node --version`).

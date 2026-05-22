# Project File Guide

A reference to every file and folder in this project, what it does, and when you'd touch it.

## Documentation

| File                                          | Purpose                                                          | Read when…                              |
| --------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| [README.md](README.md)                        | Main overview, command reference, common workflows.              | First stop for everyone.                |
| [GETTING_STARTED.md](GETTING_STARTED.md)      | Friendly one-page orientation.                                   | You want a gentle introduction.         |
| [QUICKSTART.md](QUICKSTART.md)                | Install + first form, step by step.                              | You're setting the tool up.             |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md)            | Beginner-friendly Google Cloud + OAuth walkthrough.              | You need to connect to Google.          |
| [MANUAL_SETUP.md](MANUAL_SETUP.md)            | One-page checklist version of the Google setup.                  | You've done this kind of setup before.  |
| [YAML_FORMAT.md](YAML_FORMAT.md)              | Complete reference for the YAML quiz format.                     | You're writing or editing quiz files.   |
| [EXAMPLES.md](EXAMPLES.md)                    | Ready-to-copy quizzes for math, language, training, surveys.     | You want a starting point.              |
| [ADVANCED.md](ADVANCED.md)                    | Scripting, environment variables, CI/CD, deployment log.         | You're scripting or automating.         |
| [INDEX.md](INDEX.md)                          | Topic-by-topic map of all documentation.                         | You're looking for something specific.  |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)      | High-level project summary and architecture.                     | You want the big picture.               |
| [CHANGELOG.md](CHANGELOG.md)                  | Release history and roadmap.                                     | You want to see what's changed.         |
| [FILE_GUIDE.md](FILE_GUIDE.md)                | This file.                                                       | You want a file-by-file reference.      |

## Source code (in `src/`)

| File                                                       | Purpose                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| [src/cli.ts](src/cli.ts)                                   | The CLI entry point. Uses yargs to define the four commands.  |
| [src/lib/types.ts](src/lib/types.ts)                       | TypeScript interfaces for the quiz model (`QuizForm`, etc.).  |
| [src/lib/validation.ts](src/lib/validation.ts)             | Validates parsed YAML before it ever reaches the Google API.  |
| [src/lib/quiz-file.ts](src/lib/quiz-file.ts)               | Reads, writes, and templates YAML quiz files.                 |
| [src/lib/google-forms.ts](src/lib/google-forms.ts)         | Converts between the internal quiz model and the Google Forms API. Implements `create`, `download`, `update`. |
| [src/lib/google-auth.ts](src/lib/google-auth.ts)           | OAuth 2.0 client setup and token caching.                     |
| [src/lib/deployments.ts](src/lib/deployments.ts)           | Appends a record to `.deployments/deployments.json` after every successful `create`. |

### Roles in one paragraph

`cli.ts` defines the user-facing commands. `quiz-file.ts` handles disk I/O. `validation.ts` enforces the YAML schema. `google-auth.ts` gets a signed-in HTTP client. `google-forms.ts` uses that client to issue Forms / Drive API calls, translating to and from the quiz model. `deployments.ts` writes the local audit log. `types.ts` defines the data types every other file uses.

## Tests (in `tests/`)

The project uses [vitest](https://vitest.dev/) for testing. Each source file has a corresponding test file:

| File                                                       | Covers                                |
| ---------------------------------------------------------- | ------------------------------------- |
| [tests/cli.test.ts](tests/cli.test.ts)                     | `src/cli.ts`                          |
| [tests/validation.test.ts](tests/validation.test.ts)       | `src/lib/validation.ts`               |
| [tests/quiz-file.test.ts](tests/quiz-file.test.ts)         | `src/lib/quiz-file.ts`                |
| [tests/google-forms.test.ts](tests/google-forms.test.ts)   | `src/lib/google-forms.ts`             |
| [tests/google-auth.test.ts](tests/google-auth.test.ts)     | `src/lib/google-auth.ts`              |
| [tests/deployments.test.ts](tests/deployments.test.ts)     | `src/lib/deployments.ts`              |

Run with `npm test` (or `npm run test:watch`). Coverage reports are written to `coverage/`.

## Configuration

| File                                       | Purpose                                                        |
| ------------------------------------------ | -------------------------------------------------------------- |
| [package.json](package.json)               | Dependencies, npm scripts, `bin` entry, project metadata.      |
| [tsconfig.json](tsconfig.json)             | TypeScript compiler settings.                                  |
| [.env.example](.env.example)               | Template for environment overrides (copy to `.env` if needed). |
| [.gitignore](.gitignore)                   | Lists files Git should ignore (credentials, tokens, builds).   |

### `package.json` highlights

- `npm run build` — compile TypeScript to `dist/`.
- `npm run dev -- <cmd>` — run the source directly via `tsx`.
- `npm run start -- <cmd>` — run the compiled JavaScript.
- `npm run lint` — run eslint.
- `npm test` / `npm run test:watch` — run vitest.

### `.gitignore` excludes

- `node_modules/`, `dist/` — generated content.
- `.env` — local overrides.
- `credentials.json`, `tokens/` — Google secrets.
- `.deployments/` — local form deployment log.
- `quizzes/` — your private quiz YAMLs (the project uses this convention; feel free to track yours elsewhere).
- `*.log`.

## Generated folders

| Folder                | Created by         | Description                                                                |
| --------------------- | ------------------ | -------------------------------------------------------------------------- |
| `node_modules/`       | `npm install`      | Installed dependencies. Excluded from Git.                                 |
| `dist/`               | `npm run build`    | Compiled JavaScript output. Excluded from Git.                             |
| `tokens/`             | First `create`     | Cached OAuth token. Excluded from Git.                                     |
| `.deployments/`       | First `create`     | JSON log of every form created via the tool. Excluded from Git.             |
| `coverage/`           | `npm test`         | Test coverage report. Safe to delete.                                      |

## Examples and templates

| File                                                 | Description                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| [examples/sample-quiz.yaml](examples/sample-quiz.yaml) | A reference quiz with one of each question type. Useful starting point.    |
| `quizzes/`                                           | Convention: put your private quiz YAMLs here. The folder is in `.gitignore`. |

## Build & development at a glance

```bash
# install once
npm install

# develop (no build step needed)
npm run dev -- <command> [options]

# production build
npm run build
npm run start -- <command> [options]

# tests and lint
npm test
npm run lint
```

## Where everything fits together

```text
quiz-generator/
│
├── README.md, GETTING_STARTED.md, QUICKSTART.md ...    ← documentation
│
├── src/
│   ├── cli.ts
│   └── lib/
│       ├── types.ts
│       ├── validation.ts
│       ├── quiz-file.ts
│       ├── google-forms.ts
│       ├── google-auth.ts
│       └── deployments.ts
│
├── tests/                ← vitest suite
├── examples/             ← sample quiz YAML
├── dist/                 ← generated by build
├── coverage/             ← generated by tests
├── node_modules/         ← installed deps
│
├── credentials.json      ← (you provide) — Google OAuth client
├── tokens/               ← (auto-created) — cached OAuth token
├── .deployments/         ← (auto-created) — local deployment log
├── .env                  ← (optional) — env-var overrides
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Where to look for…

| What                              | Where                                                                |
| --------------------------------- | -------------------------------------------------------------------- |
| Command definitions               | [src/cli.ts](src/cli.ts)                                             |
| The Google Forms API translation  | [src/lib/google-forms.ts](src/lib/google-forms.ts)                   |
| YAML validation rules             | [src/lib/validation.ts](src/lib/validation.ts) (+ [YAML_FORMAT.md](YAML_FORMAT.md)) |
| OAuth setup                       | [src/lib/google-auth.ts](src/lib/google-auth.ts) (+ [GOOGLE_SETUP.md](GOOGLE_SETUP.md)) |
| Deployment log behaviour          | [src/lib/deployments.ts](src/lib/deployments.ts)                     |
| Tests for any of the above        | `tests/<same-name>.test.ts`                                          |

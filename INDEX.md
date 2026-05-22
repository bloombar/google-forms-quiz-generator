# Documentation Index

A topic-by-topic map of all the documentation in this project.

## Start here

| Doc                                          | When to read                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| [README.md](README.md)                       | First — short overview and command reference.                             |
| [GETTING_STARTED.md](GETTING_STARTED.md)     | Friendly one-page orientation for new users.                              |
| [QUICKSTART.md](QUICKSTART.md)               | Step-by-step install and first form.                                       |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md)           | The Google account setup, explained in detail for non-developers.         |
| [MANUAL_SETUP.md](MANUAL_SETUP.md)           | A condensed checklist of the Google setup (for repeat setups).            |

## Reference

| Doc                              | Contents                                                          |
| -------------------------------- | ----------------------------------------------------------------- |
| [YAML_FORMAT.md](YAML_FORMAT.md) | Every field in a quiz file, with examples and validation rules.   |
| [EXAMPLES.md](EXAMPLES.md)       | Ready-to-copy quizzes for math, language, training, etc.          |
| [ADVANCED.md](ADVANCED.md)       | Scripting, environment variables, CI/CD, deployment tracking.     |

## Meta

| Doc                                    | Contents                                                            |
| -------------------------------------- | ------------------------------------------------------------------- |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | High-level summary of the project's features and architecture.   |
| [FILE_GUIDE.md](FILE_GUIDE.md)           | Quick reference to every file in the repository.                 |
| [CHANGELOG.md](CHANGELOG.md)             | Release history.                                                  |

## Common tasks

**I want to…**

- **Make my first quiz** → [QUICKSTART.md](QUICKSTART.md)
- **Set up Google credentials** → [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- **Learn the YAML format** → [YAML_FORMAT.md](YAML_FORMAT.md)
- **Download and edit an existing form** → [README.md → Common workflows](README.md#common-workflows)
- **Put new forms in a specific Drive folder** → [README.md → Common workflows](README.md#common-workflows) or [ADVANCED.md → create](ADVANCED.md#create)
- **See real examples** → [EXAMPLES.md](EXAMPLES.md)
- **Automate with scripts** → [ADVANCED.md → Scripting and automation](ADVANCED.md#scripting-and-automation)
- **Run in CI/CD** → [ADVANCED.md → CI/CD integration](ADVANCED.md#cicd-integration)
- **Troubleshoot an error** → [GOOGLE_SETUP.md → Troubleshooting](GOOGLE_SETUP.md#troubleshooting) and [ADVANCED.md → Error handling](ADVANCED.md#error-handling-and-debugging)
- **Run the test suite** → [ADVANCED.md → Running tests](ADVANCED.md#running-tests)

## Quick reference

### Commands

```bash
# Generate a template
npm run dev -- init-template -o quiz.yaml

# Create a new form
npm run dev -- create -i quiz.yaml
npm run dev -- create -i quiz.yaml --folder-id 1AbCdEfGhIjKlMnOp

# Download an existing form
npm run dev -- download -f FORM_ID -o quiz.yaml

# Update an existing form
npm run dev -- update -f FORM_ID -i quiz.yaml
```

### Minimal YAML

```yaml
version: 1
title: Quiz Title
isQuiz: true
questions:
  - title: A question
    type: single_choice   # or multiple_choice, dropdown, short_text, long_text
    points: 1
    options:
      - value: Option 1
      - value: Option 2
        isCorrect: true
```

### Question types

| Type              | Use case                            |
| ----------------- | ----------------------------------- |
| `single_choice`   | Radio buttons — one answer.         |
| `multiple_choice` | Checkboxes — any number of answers. |
| `dropdown`        | Dropdown menu — one answer.         |
| `short_text`      | Single-line text input.             |
| `long_text`       | Multi-line text area.               |

## Need help?

1. **Setup issues** → [GOOGLE_SETUP.md → Troubleshooting](GOOGLE_SETUP.md#troubleshooting)
2. **YAML errors** → [YAML_FORMAT.md → Validation rules](YAML_FORMAT.md#validation-rules)
3. **Command/script errors** → [ADVANCED.md → Error handling](ADVANCED.md#error-handling-and-debugging)
4. **Looking for an example** → [EXAMPLES.md](EXAMPLES.md)

## Project layout (high level)

```text
quiz-generator/
├── README.md, QUICKSTART.md, GOOGLE_SETUP.md, ...   ← documentation
├── src/
│   ├── cli.ts                        ← CLI command handlers
│   └── lib/
│       ├── types.ts                  ← TypeScript types
│       ├── validation.ts             ← YAML validation
│       ├── quiz-file.ts              ← YAML I/O
│       ├── google-forms.ts           ← Google Forms API translation
│       ├── google-auth.ts            ← OAuth flow
│       └── deployments.ts            ← Deployment log writer
├── tests/                            ← vitest test suite
├── examples/sample-quiz.yaml         ← Reference quiz
├── package.json, tsconfig.json
└── (gitignored) credentials.json, tokens/, .deployments/, quizzes/
```

A more detailed walkthrough is in [FILE_GUIDE.md](FILE_GUIDE.md).

## Learning path

**Beginner**

1. [QUICKSTART.md](QUICKSTART.md) — get it running.
2. [README.md](README.md) — understand the basics.
3. [YAML_FORMAT.md](YAML_FORMAT.md) — learn the format.

**Intermediate**

1. [EXAMPLES.md](EXAMPLES.md) — see real quizzes.
2. [README.md → Common workflows](README.md#common-workflows) — common patterns.
3. Create your own quizzes.

**Advanced**

1. [ADVANCED.md](ADVANCED.md) — scripting and automation.
2. [ADVANCED.md → CI/CD integration](ADVANCED.md#cicd-integration) — running in CI.
3. Extend the code in `src/`.

# Quiz YAML Format

This document is the complete reference for the YAML format used by the Quiz Tool. It describes every field you can use, with examples.

## What is YAML?

YAML is a plain-text file format designed to be easy for humans to read and write. It uses **indentation** (spaces, not tabs) to express nesting, and `key: value` pairs to express properties. Lists start with `- `. If you've ever written a configuration file, this will feel familiar.

You can edit YAML files in any text editor — VS Code, TextEdit, Notepad, nano, etc.

A common gotcha: YAML is **whitespace-sensitive**. Always use spaces (not tabs), and keep the indentation consistent within a block (2 spaces per level is the convention used throughout this project).

## File structure at a glance

A quiz file always has a top-level header and a `questions:` list:

```yaml
version: 1
title: My Quiz
description: An optional description shown at the top of the form.
isQuiz: true
questions:
  - title: First question
    type: single_choice
    options:
      - value: Option A
        isCorrect: true
      - value: Option B
  - title: Second question
    type: short_text
```

## Top-level fields

| Field         | Type    | Required | Description                                                                             |
| ------------- | ------- | -------- | --------------------------------------------------------------------------------------- |
| `version`     | number  | Yes      | Must be `1`. Reserved for future format changes.                                        |
| `title`       | string  | Yes      | Title of the quiz/form, displayed at the top.                                            |
| `description` | string  | No       | Short description shown below the title. Plain text.                                     |
| `isQuiz`      | boolean | No       | Default `true`. Set to `false` for a survey (no scoring or correct answers).            |
| `questions`   | array   | Yes      | A non-empty list of question objects (see below).                                        |

## Question objects

Every entry in the `questions:` list is an object with these fields:

### Fields shared by all question types

| Field         | Type    | Required | Description                                                                                              |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `title`       | string  | Yes      | The question text shown to respondents.                                                                  |
| `type`        | string  | Yes      | One of: `single_choice`, `multiple_choice`, `dropdown`, `short_text`, `long_text`.                       |
| `description` | string  | No       | Extra context shown below the question (often used for hints or instructions).                           |
| `required`    | boolean | No       | Default `false`. If `true`, the respondent cannot submit until they answer.                              |
| `points`      | number  | No       | Points awarded for a correct answer. Omit it to leave the question ungraded (counted as 0 points).        |

### Fields for choice-based questions (`single_choice`, `multiple_choice`, `dropdown`)

Choice questions need an `options:` list:

```yaml
options:
  - value: First option
    isCorrect: true
  - value: Second option
```

| Field                 | Type    | Required | Description                                                                                     |
| --------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| `options`             | array   | Yes      | At least 2 options.                                                                              |
| `options[].value`     | string  | Yes      | The text shown for this option.                                                                  |
| `options[].isCorrect` | boolean | No       | Marks an option as correct. Used only when `points` is set on the question (otherwise ignored). |

- For `single_choice` and `dropdown`, normally only one option is `isCorrect: true`.
- For `multiple_choice`, any number of options can be `isCorrect: true`.

### Fields for text questions (`short_text`, `long_text`)

Text questions optionally specify accepted answers:

```yaml
correctAnswers:
  - Pacific Ocean
  - Pacific
```

| Field            | Type  | Required | Description                                                                                        |
| ---------------- | ----- | -------- | -------------------------------------------------------------------------------------------------- |
| `correctAnswers` | array | No       | Accepted answers for auto-grading. Google Forms matches **exactly**, so list every variant.        |

Text questions **must not** include `options:`.

## Question types in detail

### `single_choice` — radio buttons

The respondent picks exactly one answer.

```yaml
- title: What is the capital of France?
  type: single_choice
  points: 1
  options:
    - value: London
    - value: Paris
      isCorrect: true
    - value: Berlin
```

### `multiple_choice` — checkboxes

The respondent can tick any number of options.

```yaml
- title: Select all programming languages.
  type: multiple_choice
  points: 2
  options:
    - value: JavaScript
      isCorrect: true
    - value: Python
      isCorrect: true
    - value: English
```

### `dropdown` — a dropdown menu

A more compact version of `single_choice`. Use for long lists where radio buttons would take too much space.

```yaml
- title: Choose your favourite colour.
  type: dropdown
  options:
    - value: Red
    - value: Blue
      isCorrect: true
    - value: Green
```

### `short_text` — one-line text input

Use for short open-ended answers. Auto-grading by exact match only — list every acceptable variant.

```yaml
- title: What year was JavaScript created?
  type: short_text
  points: 1
  correctAnswers:
    - "1995"
```

> The quotes around `"1995"` ensure YAML treats it as a string, not a number.

### `long_text` — multi-line text area

Use for essays and longer free-form responses. Practically speaking, these can't be auto-graded — Google Forms only matches exact strings, which rarely makes sense for prose. You can list `correctAnswers` for reference, but expect to grade these manually.

```yaml
- title: Describe your experience with web development.
  type: long_text
```

## A complete example

```yaml
version: 1
title: Web Development Quiz
description: Test your knowledge of web technologies.
isQuiz: true

questions:
  - title: What does HTML stand for?
    type: single_choice
    required: true
    points: 1
    options:
      - value: Hyper Text Markup Language
        isCorrect: true
      - value: High Tech Modern Language
      - value: Home Tool Markup Language

  - title: Which of these are CSS properties?
    type: multiple_choice
    required: true
    points: 2
    options:
      - value: color
        isCorrect: true
      - value: font-size
        isCorrect: true
      - value: background-color
        isCorrect: true
      - value: text-size

  - title: Select your preferred JavaScript framework.
    type: dropdown
    options:
      - value: React
      - value: Vue
      - value: Angular
      - value: Svelte

  - title: Who created JavaScript?
    type: short_text
    required: true
    correctAnswers:
      - Brendan Eich
      - brendan eich

  - title: Explain the difference between `var`, `let`, and `const`.
    type: long_text
    description: Manual grading — write 2-3 sentences.
```

## Validation rules

The tool checks your YAML before uploading and refuses to proceed if any of these are violated:

1. `version` must be `1`.
2. `title` must be a non-empty string.
3. `questions` must be a non-empty list.
4. Each question must have a non-empty `title` and a valid `type`.
5. Choice questions (`single_choice`, `multiple_choice`, `dropdown`) must have **at least 2 options**, each with a non-empty `value`.
6. Text questions (`short_text`, `long_text`) must **not** have an `options:` field.
7. If `points` is set, it must be a non-negative number.
8. Each entry in `correctAnswers` must be a non-empty string.

If validation fails, the tool prints a message describing exactly which question and which field is wrong.

## Tips and patterns

### Generate a starter file

```bash
npm run dev -- init-template -o myquiz.yaml
```

This produces a small, valid example file with one of each question type. Use it as a starting point or sanity check.

### Reuse an existing form as a template

```bash
npm run dev -- download --form-id SOURCE_FORM_ID -o template.yaml
```

Edit the title (and anything else you want to change), then `create` a new form from it. The original form is untouched.

### Enable auto-grading

Three things have to line up:

1. `isQuiz: true` at the top of the file (the default).
2. `points: <number>` on each question you want graded.
3. The correct answers marked — `isCorrect: true` on choice options, or entries in `correctAnswers:` for text questions.

If you don't see scores after submitting, double-check all three.

### Multi-line strings

If a question title or description is long, you can use YAML's `>` (folded) or `|` (literal) block-scalar syntax:

```yaml
- title: >
    This is a very long question that
    will be folded into a single line
    when shown to respondents.
  type: short_text
```

### Special characters and quoting

YAML usually doesn't need quotes, but you should quote a string if it:

- Starts with a number or special character (`*`, `&`, `?`, `:`, `-`, etc.).
- Contains a colon followed by a space (`key: value` looks like a mapping otherwise).
- Could be misread as a boolean (`yes`, `no`, `true`, `false`, `on`, `off`).

When in doubt, wrap the value in double quotes: `value: "1995"`.

### Comments

Lines starting with `#` are ignored by the parser and useful for organizing your file:

```yaml
# Section 1 — Basic Concepts
- title: Question 1
  type: single_choice
  # ...
```

Comments are **lost** when a form is downloaded back to YAML, since Google Forms doesn't store them.

## Limitations

- **Exact-match grading only** for text questions — Google Forms doesn't support fuzzy matching, regex, or numeric tolerance. List every acceptable variant in `correctAnswers`.
- **Non-question items skipped on download** — images, videos, page breaks, and section headers are not preserved when you `download` a form. They'll be removed if you `update` the form from a downloaded YAML.
- **No styling** — colours, fonts, and header images can't be set through this tool.
- **No branching logic** — "go to section based on answer" isn't supported.

## Migrating from other formats

If you have quizzes in another format (CSV, JSON, a spreadsheet, etc.), the easiest path is to write a small script that converts your data into the structure shown above, then run `create` to upload. Any language that can write YAML (Python, Node, Ruby, etc.) works fine — see [ADVANCED.md → Programmatic quiz generation](ADVANCED.md#programmatic-quiz-generation) for a Node.js example.

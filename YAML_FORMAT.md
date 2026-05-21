# Quiz YAML Format Specification

This document describes the complete YAML format used by the Quiz Tool.

## File Structure

```yaml
version: 1
title: Quiz Title
description: Optional description shown at the top of the form
isQuiz: true
questions:
  - [question objects]
```

## Top-Level Fields

| Field         | Type    | Required | Description                                                                |
| ------------- | ------- | -------- | -------------------------------------------------------------------------- |
| `version`     | number  | Yes      | Must be `1`                                                                |
| `title`       | string  | Yes      | Title of the quiz/form (displayed at the top)                              |
| `description` | string  | No       | Description shown under the title                                          |
| `isQuiz`      | boolean | No       | Default `true`. If `false`, the form is a survey (not a quiz with scoring) |
| `questions`   | array   | Yes      | Array of question objects (at least one required)                          |

## Question Object Fields

Every question object has the following structure:

```yaml
questions:
  - title: Question text
    type: single_choice
    description: Optional explanation
    required: false
    points: 1
    options:
      - value: "Option text"
        isCorrect: true
    correctAnswers:
      - "Expected answer"
```

### Common Question Fields

| Field         | Type    | Required | Description                                                                       |
| ------------- | ------- | -------- | --------------------------------------------------------------------------------- |
| `title`       | string  | Yes      | The question text (displayed to respondents)                                      |
| `type`        | string  | Yes      | One of: `single_choice`, `multiple_choice`, `dropdown`, `short_text`, `long_text` |
| `description` | string  | No       | Additional explanation or context for the question                                |
| `required`    | boolean | No       | Default `false`. If `true`, respondents must answer this question                 |
| `points`      | number  | No       | Points awarded for a correct answer (default: not graded)                         |

### Choice Question Fields (single_choice, multiple_choice, dropdown)

For choice-based questions, include:

```yaml
options:
  - value: "First option"
    isCorrect: true
  - value: "Second option"
    isCorrect: false
```

| Field                 | Type    | Required | Description                                        |
| --------------------- | ------- | -------- | -------------------------------------------------- |
| `options`             | array   | Yes      | Array of possible answers (minimum 2 required)     |
| `options[].value`     | string  | Yes      | The text shown for this option                     |
| `options[].isCorrect` | boolean | No       | Mark correct answers. Only used if `points` is set |

**Note:** For `single_choice` questions, typically only one option is marked `isCorrect: true`. For `multiple_choice`, multiple options can be marked correct.

### Text Question Fields (short_text, long_text)

For text-based questions, optionally include answer key:

```yaml
correctAnswers:
  - "Pacific Ocean"
  - "Pacific"
```

| Field            | Type  | Required | Description                                           |
| ---------------- | ----- | -------- | ----------------------------------------------------- |
| `correctAnswers` | array | No       | Array of acceptable answers (case-sensitive matching) |

Text questions do not use the `options` field.

## Question Types Explained

### single_choice

A radio-button question where respondents select exactly one option.

```yaml
- title: "What is the capital of France?"
  type: single_choice
  points: 1
  options:
    - value: "London"
    - value: "Paris"
      isCorrect: true
    - value: "Berlin"
```

### multiple_choice

A checkbox question where respondents can select multiple options.

```yaml
- title: "Select all programming languages."
  type: multiple_choice
  points: 2
  options:
    - value: "JavaScript"
      isCorrect: true
    - value: "Python"
      isCorrect: true
    - value: "English"
```

### dropdown

A dropdown menu. Respondents select one option from a list.

```yaml
- title: "Choose your favorite color."
  type: dropdown
  options:
    - value: "Red"
    - value: "Blue"
      isCorrect: true
    - value: "Green"
```

### short_text

A single-line text input. Google Forms doesn't natively support automatic grading for text, but you can specify expected answers for reference.

```yaml
- title: "What year was JavaScript created?"
  type: short_text
  correctAnswers:
    - "1995"
```

### long_text

A multi-line text area. Like short text, grading is for reference only.

```yaml
- title: "Describe your experience with web development."
  type: long_text
  correctAnswers:
    - "Any substantive response"
```

## Complete Example

```yaml
version: 1
title: Web Development Quiz
description: Test your knowledge of web technologies
isQuiz: true

questions:
  - title: "What does HTML stand for?"
    type: single_choice
    required: true
    points: 1
    options:
      - value: "Hyper Text Markup Language"
        isCorrect: true
      - value: "High Tech Modern Language"
      - value: "Home Tool Markup Language"

  - title: "Which of these are CSS properties?"
    type: multiple_choice
    required: true
    points: 2
    options:
      - value: "color"
        isCorrect: true
      - value: "fontSize"
        isCorrect: true
      - value: "backgroundColor"
        isCorrect: true
      - value: "textSize"

  - title: "Select your preferred JavaScript framework:"
    type: dropdown
    options:
      - value: "React"
        isCorrect: true
      - value: "Vue"
      - value: "Angular"
      - value: "Svelte"

  - title: "Who created JavaScript?"
    type: short_text
    required: true
    correctAnswers:
      - "Brendan Eich"
      - "brendan eich"

  - title: "Explain the difference between var, let, and const."
    type: long_text
    description: "(Not automatically graded)"
```

## Validation Rules

The tool validates your YAML files before uploading. Here are the rules:

1. **version**: Must be `1`
2. **title**: Must be non-empty string
3. **questions**: Must be non-empty array
4. **Each question must have**:
   - Non-empty `title`
   - Valid `type` (one of the 5 supported types)
   - For choice questions: at least 2 options
   - For text questions: no `options` field
5. **points**: Must be a non-negative number (if specified)
6. **options**: All option values must be non-empty strings
7. **correctAnswers**: All answers must be non-empty strings

## Tips and Tricks

### Using the Template

Generate a starter template:

```bash
npm run dev -- init-template -o myquiz.yaml
```

### Copying Existing Forms

Download any existing Google Form as YAML:

```bash
npm run dev -- download --form-id FORM_ID --output myquiz.yaml
```

Then edit the YAML and create a new form from it.

### Batch Updates

You can manually edit the YAML file and use the `update` command to push changes to Google Forms:

```bash
npm run dev -- update --form-id FORM_ID --input myquiz.yaml
```

This replaces all questions in the form with the ones in your YAML.

### Point Systems

To create a point system for automatic grading:

1. Add `points: <number>` to each question
2. Mark correct answers with `isCorrect: true` (for choice) or `correctAnswers: [...]` (for text)
3. Google Forms will auto-grade matching answers

### Making Questions Optional

By default, all questions are optional. To require a specific answer:

```yaml
questions:
  - title: "Your question"
    type: single_choice
    required: true # Respondents must answer this
    points: 1
    options:
      - value: "..."
```

### Comments and Descriptions

Use YAML comments (lines starting with `#`) to organize your file:

```yaml
# Section 1: Basic Concepts
questions:
  - title: "Question 1"
    type: single_choice
    # ...

  # Section 2: Advanced Topics
  - title: "Question 2"
    type: multiple_choice
    # ...
```

Note: Comments are preserved when you edit locally but are lost when you download from Google Forms (since Google Forms doesn't store them).

## Limitations

- Google Forms doesn't support all YAML fields natively (e.g., text-question auto-grading)
- When you download a form that was manually edited in Google Forms, non-question elements (images, sections, descriptions) are skipped
- The tool focuses on quiz questions; form styling is not currently managed
- Answer keys are stored in the YAML but only affect auto-grading if `points` is set

## Migration from Other Formats

To migrate from another format (e.g., CSV, JSON):

1. Create a script to convert your data to YAML
2. Validate the YAML against this spec
3. Use the `create` or `update` commands to import into Google Forms

Example conversion (JSON → YAML using jq):

```bash
jq -r 'to_entries | map({title: .value.q, type: "single_choice", options: .value.choices | map({value: .})}) | {version: 1, title: "Converted Quiz", questions: .}' questions.json | yq eval -P - > quiz.yaml
```

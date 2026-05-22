# Examples

Practical, copy-paste-ready quizzes for a range of scenarios. Each example is a complete YAML file you can save and upload as-is.

## Basic workflows

### Create a quiz from scratch

```bash
npm run dev -- init-template --output my-quiz.yaml   # writes a starter file
# open my-quiz.yaml in your text editor and customise it
npm run dev -- create --input my-quiz.yaml
# prints: Created form ID: 1a2b3c4d...
#         Responder URL: https://docs.google.com/forms/d/e/.../viewform
# share the responder URL with the people taking the quiz
```

### Save a new form to a specific Drive folder

Pass `--folder-id` (find it in the Drive folder's URL, after `/folders/`):

```bash
npm run dev -- create --input my-quiz.yaml --folder-id 1AbCdEfGhIjKlMnOp
```

### Download an existing form and edit it locally

```bash
npm run dev -- download --form-id 1a2b3c4d5e6f7g8h9i0j --output my-quiz.yaml
# edit my-quiz.yaml in your text editor
npm run dev -- update --form-id 1a2b3c4d5e6f7g8h9i0j --input my-quiz.yaml
```

> Heads-up: `update` **replaces all questions** in the form. There's no merge.

### Duplicate a quiz

```bash
npm run dev -- download --form-id SOURCE_FORM_ID --output template.yaml
# change the title in template.yaml (and anything else you want different)
npm run dev -- create --input template.yaml   # creates a brand-new form
```

## Example quizzes

### Mathematics quiz

```yaml
version: 1
title: Basic Math Quiz
description: Test your arithmetic skills.
isQuiz: true

questions:
  - title: What is 15 + 27?
    type: single_choice
    required: true
    points: 1
    options:
      - value: "42"
        isCorrect: true
      - value: "40"
      - value: "44"
      - value: "38"

  - title: Which of these are even numbers?
    type: multiple_choice
    required: true
    points: 2
    options:
      - value: "12"
        isCorrect: true
      - value: "17"
      - value: "24"
        isCorrect: true
      - value: "33"

  - title: What is 144 ÷ 12?
    type: dropdown
    required: true
    points: 1
    options:
      - value: "10"
      - value: "12"
        isCorrect: true
      - value: "14"
      - value: "16"

  - title: Calculate 25% of 80.
    type: short_text
    required: true
    points: 1
    correctAnswers:
      - "20"

  - title: Explain your favourite mathematical concept.
    type: long_text
    description: This is for feedback only — not auto-graded.
```

### Language-learning quiz

```yaml
version: 1
title: Spanish Vocabulary Quiz
description: Level 1 — Basic greetings.
isQuiz: true

questions:
  - title: How do you say 'Hello' in Spanish?
    type: single_choice
    points: 1
    options:
      - value: Hola
        isCorrect: true
      - value: Adiós
      - value: Gracias
      - value: Por favor

  - title: Which are formal greetings?
    type: multiple_choice
    points: 2
    options:
      - value: Buenos días
        isCorrect: true
      - value: ¿Qué onda?
      - value: Buenas tardes
        isCorrect: true
      - value: ¡Ey!

  - title: Select the word for 'water'.
    type: dropdown
    points: 1
    options:
      - value: pan
      - value: agua
        isCorrect: true
      - value: leche

  - title: Translate 'Good morning' to Spanish.
    type: short_text
    points: 1
    correctAnswers:
      - Buenos días
      - buenos días

  - title: Describe your favourite Spanish-speaking country.
    type: long_text
```

### Employee training quiz

```yaml
version: 1
title: Company Safety Training — Annual Certification
description: Required annual training. Score 80% or higher to pass.
isQuiz: true

questions:
  - title: Where is the nearest fire extinguisher from your desk?
    type: short_text
    required: true
    points: 5
    correctAnswers:
      - Conference Room A
      - conference room a

  - title: What should you do if you witness an accident in the office?
    type: multiple_choice
    required: true
    points: 10
    options:
      - value: Report it to your manager immediately
        isCorrect: true
      - value: Document what happened
        isCorrect: true
      - value: Contact HR
        isCorrect: true
      - value: Post it on the company chat

  - title: How often should passwords be changed?
    type: dropdown
    required: true
    points: 5
    options:
      - value: Every month
      - value: Every 90 days
        isCorrect: true
      - value: Once a year
      - value: Only when asked

  - title: Have you completed all required certifications?
    type: single_choice
    required: true
    points: 5
    options:
      - value: "Yes"
        isCorrect: true
      - value: "No"
```

### Classroom reading-comprehension assessment

```yaml
version: 1
title: Chapter 3 Reading Comprehension
description: Assessment for 'The Great Gatsby' — Chapter 3.
isQuiz: true

questions:
  - title: Where does the party in Chapter 3 take place?
    type: single_choice
    required: true
    points: 2
    options:
      - value: At Daisy's house
      - value: At Gatsby's mansion
        isCorrect: true
      - value: At a hotel in the city
      - value: At Tom's office

  - title: Which characters attend Gatsby's party? (Select all that apply.)
    type: multiple_choice
    required: true
    points: 3
    options:
      - value: Daisy and Tom
      - value: Nick Carraway
        isCorrect: true
      - value: Jordan Baker
        isCorrect: true
      - value: Myrtle Wilson

  - title: What is Gatsby's primary goal at the party?
    type: short_text
    required: true
    points: 2
    correctAnswers:
      - To see Daisy
      - To reunite with Daisy
      - Meet Daisy

  - title: Analyze the significance of the party scene in Chapter 3. What does it reveal about the characters?
    type: long_text
    required: true
    points: 5
```

### Customer feedback survey (not a quiz)

Set `isQuiz: false` to use the tool for plain surveys (no scoring, no answer key).

```yaml
version: 1
title: Service Feedback Survey
description: We'd love to hear about your experience.
isQuiz: false

questions:
  - title: How would you rate our service?
    type: dropdown
    required: true
    options:
      - value: Very Poor
      - value: Poor
      - value: Average
      - value: Good
      - value: Excellent

  - title: Which aspects did you find most helpful?
    type: multiple_choice
    options:
      - value: Product quality
      - value: Customer support
      - value: Pricing
      - value: Delivery speed
      - value: Variety of options

  - title: What is your main suggestion for improvement?
    type: long_text

  - title: May we contact you about your feedback?
    type: single_choice
    required: true
    options:
      - value: Yes, please
      - value: No, thank you
```

## Patterns

### Weighted scoring

Give harder questions more points by varying `points:`:

```yaml
version: 1
title: Final Exam
isQuiz: true

questions:
  - title: Easy question (1 point)
    type: single_choice
    points: 1
    required: true
    options:
      - value: Correct
        isCorrect: true
      - value: Incorrect

  - title: Medium question (2 points)
    type: multiple_choice
    points: 2
    required: true
    options:
      - value: Option 1
        isCorrect: true
      - value: Option 2
        isCorrect: true
      - value: Option 3

  - title: Difficult question (5 points)
    type: single_choice
    points: 5
    required: true
    options:
      - value: Correct
        isCorrect: true
      - value: Incorrect
```

### "Conditional branching" workaround

Google Forms supports conditional sections in its UI, but the public API doesn't currently let this tool set them. If you need branching, the practical workarounds are:

- **Split into multiple forms** and link them — answer choices can include "(See Part 2 form)" text.
- **Use descriptive labels** in your options to guide the respondent.

```yaml
version: 1
title: Troubleshooting Guide — Part 1
description: Answer to identify your issue.
isQuiz: false

questions:
  - title: Does the device turn on?
    type: single_choice
    required: true
    options:
      - value: Yes (please continue to the Part 2 form)
      - value: No (see the offline troubleshooting steps below)
```

### Bulk quiz creation from a shell script

Generate several similar quizzes in a loop:

```bash
#!/bin/bash
# create-multiple.sh

for i in {1..5}; do
  cat > "quiz-$i.yaml" <<EOF
version: 1
title: Quiz Set A — Version $i
isQuiz: true
questions:
  - title: Sample question $i
    type: single_choice
    points: 1
    options:
      - value: A
        isCorrect: true
      - value: B
EOF
  npm run dev -- create --input "quiz-$i.yaml"
done
```

See [ADVANCED.md](ADVANCED.md) for more scripting patterns and CI/CD ideas.

## Troubleshooting these examples

### The form was created but has no questions

Your YAML probably has a syntax error that the parser silently accepted (e.g., a misindented `questions:` list). Re-generate the template and compare structure:

```bash
npm run dev -- init-template -o test.yaml
diff test.yaml my-quiz.yaml
```

### Auto-grading shows 0%

You need **all three** of:

1. `isQuiz: true` at the top.
2. `points: <number>` on each graded question.
3. Correct answers marked via `isCorrect: true` (for choice) or `correctAnswers: [...]` (for text).

### `Error: Cannot find form`

The form ID is wrong, or the signed-in Google account doesn't have edit access to it. Open the form in your browser to confirm the ID and that you can edit it.

## Next

- Full field reference: [YAML_FORMAT.md](YAML_FORMAT.md).
- Scripting, CI, environment variables: [ADVANCED.md](ADVANCED.md).
- Command reference: [README.md](README.md).

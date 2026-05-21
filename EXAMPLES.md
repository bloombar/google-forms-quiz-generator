# Examples and Use Cases

This document provides practical examples of how to use the Quiz Tool for different scenarios.

## Basic Workflow

### 1. Create a Quiz from Scratch

```bash
# Generate a template
npm run dev -- init-template --output my-quiz.yaml

# Edit the file in your text editor to customize questions
nano my-quiz.yaml

# Create the form in Google Forms
npm run dev -- create --input my-quiz.yaml
# Output: Created form ID: 1a2b3c4d5e6f7g8h9i0j

# Share the form with others
# The form URL is: https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j/edit
```

### 2. Download and Modify an Existing Quiz

```bash
# Download a form you already have
npm run dev -- download --form-id 1a2b3c4d5e6f7g8h9i0j --output my-quiz.yaml

# Edit the YAML file
nano my-quiz.yaml

# Update the form with your changes
npm run dev -- update --form-id 1a2b3c4d5e6f7g8h9i0j --input my-quiz.yaml
```

### 3. Duplicate a Quiz

```bash
# Download existing quiz
npm run dev -- download --form-id SOURCE_FORM_ID --output template.yaml

# Modify the title
# (Edit template.yaml and change the title)

# Create a new form from the template
npm run dev -- create --input template.yaml
```

## Example Quizzes

### Mathematics Quiz

```yaml
version: 1
title: "Basic Math Quiz"
description: "Test your arithmetic skills"
isQuiz: true

questions:
  - title: "What is 15 + 27?"
    type: single_choice
    required: true
    points: 1
    options:
      - value: "42"
        isCorrect: true
      - value: "40"
      - value: "44"
      - value: "38"

  - title: "Which of these are even numbers?"
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

  - title: "What is 144 ÷ 12?"
    type: dropdown
    required: true
    points: 1
    options:
      - value: "10"
      - value: "12"
        isCorrect: true
      - value: "14"
      - value: "16"

  - title: "Calculate 25% of 80"
    type: short_text
    required: true
    correctAnswers:
      - "20"

  - title: "Explain your favorite mathematical concept"
    type: long_text
    description: "This is for feedback only - not auto-graded"
```

### Language Learning Quiz

```yaml
version: 1
title: "Spanish Vocabulary Quiz"
description: "Level 1 - Basic Greetings"
isQuiz: true

questions:
  - title: "How do you say 'Hello' in Spanish?"
    type: single_choice
    points: 1
    options:
      - value: "Hola"
        isCorrect: true
      - value: "Adiós"
      - value: "Gracias"
      - value: "Por favor"

  - title: "Which are formal greetings?"
    type: multiple_choice
    points: 2
    options:
      - value: "Buenos días"
        isCorrect: true
      - value: "¿Qué onda?"
      - value: "Buenas tardes"
        isCorrect: true
      - value: "¡Ey!"

  - title: "Select the word for 'water'"
    type: dropdown
    points: 1
    options:
      - value: "pan"
      - value: "agua"
        isCorrect: true
      - value: "leche"

  - title: "Translate 'Good morning' to Spanish"
    type: short_text
    points: 1
    correctAnswers:
      - "Buenos días"
      - "buenos días"

  - title: "Describe your favorite Spanish-speaking country"
    type: long_text
```

### Employee Training Quiz

```yaml
version: 1
title: "Company Safety Training - Annual Certification"
description: "Required annual training. Score 80% or higher to pass."
isQuiz: true

questions:
  - title: "Where is the nearest fire extinguisher from your desk?"
    type: short_text
    required: true
    points: 5
    correctAnswers:
      - "Conference Room A"
      - "conference room a"

  - title: "What should you do if you witness an accident in the office?"
    type: multiple_choice
    required: true
    points: 10
    options:
      - value: "Report it to your manager immediately"
        isCorrect: true
      - value: "Document what happened"
        isCorrect: true
      - value: "Contact HR"
        isCorrect: true
      - value: "Post it on the company chat"

  - title: "How often should passwords be changed?"
    type: dropdown
    required: true
    points: 5
    options:
      - value: "Every month"
      - value: "Every 90 days"
        isCorrect: true
      - value: "Once a year"
      - value: "Only when asked"

  - title: "Have you completed all required certifications?"
    type: single_choice
    required: true
    points: 5
    options:
      - value: "Yes"
        isCorrect: true
      - value: "No"
```

### Classroom Assessment

```yaml
version: 1
title: "Chapter 3 Reading Comprehension"
description: "Assessment for 'The Great Gatsby' - Chapter 3"
isQuiz: true

questions:
  - title: "Where does the party in Chapter 3 take place?"
    type: single_choice
    required: true
    points: 2
    options:
      - value: "At Daisy's house"
      - value: "At Gatsby's mansion"
        isCorrect: true
      - value: "At a hotel in the city"
      - value: "At Tom's office"

  - title: "Which characters attend Gatsby's party? (Select all that apply)"
    type: multiple_choice
    required: true
    points: 3
    options:
      - value: "Daisy and Tom"
        isCorrect: true
      - value: "Nick Carraway"
        isCorrect: true
      - value: "Jordan Baker"
        isCorrect: true
      - value: "Myrtle Wilson"

  - title: "What is Gatsby's primary goal at the party?"
    type: short_text
    required: true
    points: 2
    correctAnswers:
      - "To see Daisy"
      - "To reunite with Daisy"
      - "Meet Daisy"

  - title: "Analyze the significance of the party scene in Chapter 3. What does it reveal about the characters?"
    type: long_text
    required: true
    points: 5
```

### Customer Feedback Survey

```yaml
version: 1
title: "Service Feedback Survey"
description: "We'd love to hear about your experience!"
isQuiz: false # Not a quiz, just a survey

questions:
  - title: "How would you rate our service?"
    type: dropdown
    required: true
    options:
      - value: "Very Poor"
      - value: "Poor"
      - value: "Average"
      - value: "Good"
      - value: "Excellent"

  - title: "Which aspects did you find most helpful?"
    type: multiple_choice
    options:
      - value: "Product quality"
      - value: "Customer support"
      - value: "Pricing"
      - value: "Delivery speed"
      - value: "Variety of options"

  - title: "What is your main suggestion for improvement?"
    type: long_text

  - title: "May we contact you about your feedback?"
    type: single_choice
    required: true
    options:
      - value: "Yes, please"
      - value: "No, thank you"
```

## Advanced Patterns

### Creating Conditional Logic (Workaround)

Google Forms doesn't natively support conditional branching in the API. However, you can:

1. Create separate forms for different paths
2. Use descriptive section titles to guide respondents
3. Have respondents return multiple times for different branches

```yaml
version: 1
title: "Troubleshooting Guide - Part 1"
description: "Answer questions to identify your issue"
isQuiz: false

questions:
  - title: "Does the device turn on?"
    type: single_choice
    required: true
    options:
      - value: "Yes (Go to Part 2 form)"
      - value: "No (See troubleshooting below)"
```

### Weighted Scoring

Create quizzes with different point values:

```yaml
version: 1
title: "Final Exam"
isQuiz: true

questions:
  - title: "Easy question"
    type: single_choice
    points: 1
    required: true
    options:
      - value: "Correct"
        isCorrect: true
      - value: "Incorrect"

  - title: "Medium question"
    type: multiple_choice
    points: 2
    required: true
    options:
      - value: "Option 1"
        isCorrect: true
      - value: "Option 2"
        isCorrect: true
      - value: "Option 3"

  - title: "Difficult question"
    type: single_choice
    points: 5
    required: true
    options:
      - value: "Correct"
        isCorrect: true
      - value: "Incorrect"
```

### Bulk Quiz Creation

Create multiple similar quizzes programmatically:

```bash
#!/bin/bash
# create-multiple.sh

for i in {1..5}; do
  cat > "quiz-$i.yaml" << EOF
version: 1
title: "Quiz Set A - Version $i"
isQuiz: true
questions:
  - title: "Question 1"
    type: single_choice
    points: 1
    options:
      - value: "A"
        isCorrect: true
      - value: "B"
EOF
  npm run dev -- create --input "quiz-$i.yaml"
  echo "Created quiz-$i"
done
```

## Troubleshooting Examples

### Issue: Quiz created but questions missing

**Symptom:** Form is created but has no questions

**Solution:** Check that your YAML validates:

```bash
npm run dev -- init-template -o test.yaml
npm run dev -- create --input test.yaml
```

### Issue: Answer keys not working

**Symptom:** Grading shows 0% even though answers are correct

**Solution:** Ensure you have:

1. `isQuiz: true` in the form
2. `points: <number>` on each question
3. Correct answers marked (for choice questions, use `isCorrect: true`)

```yaml
questions:
  - title: "Question"
    type: single_choice
    points: 1 # Must have points
    required: true
    options:
      - value: "Correct"
        isCorrect: true # Must mark correct answer
```

### Issue: Can't download form

**Symptom:** Error like "Cannot find form"

**Solution:**

1. Verify the form ID is correct
2. Verify you have edit access to the form
3. Check that your Google authentication is valid:

```bash
npm run dev -- download --form-id <FORM_ID> --output test.yaml
```

## Performance Tips

- **Large quizzes**: Quizzes with 100+ questions work fine but take longer to upload
- **Frequent updates**: Consider batching multiple changes into one update rather than updating after each question edit
- **Backup your YAML**: Always keep a local copy of your quiz YAML file

## Next Steps

1. See [YAML_FORMAT.md](YAML_FORMAT.md) for complete field reference
2. See [GOOGLE_SETUP.md](GOOGLE_SETUP.md) if you haven't set up credentials yet
3. Check the main [README.md](README.md) for command reference

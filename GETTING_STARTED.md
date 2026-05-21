# Getting Started with the Google Forms Quiz Tool

Welcome! This file provides the essential information to start using the tool immediately.

## 30-Second Overview

**Google Forms Quiz Tool** lets you manage Google Forms quizzes via simple YAML text files.

```bash
# Create a quiz template
npm run dev -- init-template -o quiz.yaml

# Edit quiz.yaml, then upload to Google Forms
npm run dev -- create --input quiz.yaml

# Later, download for editing
npm run dev -- download --form-id FORM_ID -o quiz.yaml

# Make changes and update the form
npm run dev -- update --form-id FORM_ID --input quiz.yaml
```

## 1. Installation (2 minutes)

```bash
# Clone or extract the project
cd quiz-generator

# Install dependencies
npm install
```

## 2. Google Setup (10 minutes)

You need to provide Google credentials ONE TIME. Follow [GOOGLE_SETUP.md](GOOGLE_SETUP.md):

1. Create a Google Cloud project
2. Enable Google Forms API
3. Create OAuth credentials
4. Save `credentials.json` to project root

**Detailed guide:** [GOOGLE_SETUP.md](GOOGLE_SETUP.md)

## 3. Test It (2 minutes)

```bash
# Generate a sample quiz
npm run dev -- init-template -o sample.yaml

# Create the form in Google Forms
npm run dev -- create --input sample.yaml

# You'll see:
# Created form ID: 1a2b3c4d5e6f7g8h9i0j
# Responder URL: https://docs.google.com/forms/d/e/...
```

Visit the Responder URL to see your quiz!

## 4. Create Your First Real Quiz

### Quick way:

```bash
# Edit a template
npm run dev -- init-template -o myquiz.yaml
nano myquiz.yaml

# Upload
npm run dev -- create --input myquiz.yaml
```

### Format reference:

```yaml
version: 1
title: My First Quiz
isQuiz: true
questions:
  - title: "What is the capital of France?"
    type: single_choice
    points: 1
    options:
      - value: London
      - value: Paris
        isCorrect: true
      - value: Berlin
```

**Full reference:** [YAML_FORMAT.md](YAML_FORMAT.md)

## Commands You'll Use

| Command                  | What It Does                  |
| ------------------------ | ----------------------------- |
| `init-template -o FILE`  | Create a template to edit     |
| `create -i FILE`         | Upload YAML as new form       |
| `download -f ID -o FILE` | Download form as YAML         |
| `update -f ID -i FILE`   | Update form with YAML changes |

## Key Concepts

**YAML File** - Your quiz definition (text file you edit)  
**Form ID** - Unique identifier from Google (printed when you create a form)  
**Responder URL** - Link you share with people taking the quiz  
**Edit URL** - Link to edit the form in Google Forms

## Question Types Supported

| Type              | Use For                    |
| ----------------- | -------------------------- |
| `single_choice`   | Multiple choice (pick one) |
| `multiple_choice` | Check all that apply       |
| `dropdown`        | Drop-down list             |
| `short_text`      | One-line answer            |
| `long_text`       | Multi-paragraph answer     |

**Examples:** [EXAMPLES.md](EXAMPLES.md)

## Common Tasks

### Download a Form to Edit Locally

```bash
npm run dev -- download --form-id 1a2b3c4d... -o quiz.yaml
nano quiz.yaml
npm run dev -- update --form-id 1a2b3c4d... --input quiz.yaml
```

### Create Multiple Similar Quizzes

```bash
# Edit template
npm run dev -- init-template -o template.yaml

# Create first form
npm run dev -- create --input template.yaml
# Save the ID from output

# Create others by copying the ID for reference
# (Each creation gets a new unique form)
```

### Define Answer Keys

```yaml
questions:
  - title: "What is 2+2?"
    type: single_choice
    points: 1 # Enable grading
    options:
      - value: "3"
      - value: "4"
        isCorrect: true # Mark correct answer
      - value: "5"
```

### Make Questions Required

```yaml
- title: "Your question"
  required: true # Must answer
  # ... rest of question
```

## Tips

✅ **Always keep a backup** of your YAML files  
✅ **Use descriptive titles** in your quizzes  
✅ **Test with the template first** to verify setup  
✅ **Start small** - create 1 quiz to learn the flow  
✅ **Check YAML syntax** if uploads fail

## Troubleshooting

### "Cannot find module"

```bash
npm install
```

### "OAuth error" when running first command

Follow [GOOGLE_SETUP.md](GOOGLE_SETUP.md#troubleshooting)

### "YAML validation error"

Check [YAML_FORMAT.md](YAML_FORMAT.md#validation-rules)

### Form created but no questions

Make sure your YAML is syntactically valid. Test with:

```bash
npm run dev -- init-template -o test.yaml
npm run dev -- create --input test.yaml
```

## Next Steps

1. ✅ Install: `npm install`
2. ✅ Setup Google: [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
3. ✅ Test: `npm run dev -- init-template -o test.yaml`
4. ✅ Create first form: `npm run dev -- create --input test.yaml`
5. 📖 Learn YAML format: [YAML_FORMAT.md](YAML_FORMAT.md)
6. 📚 See examples: [EXAMPLES.md](EXAMPLES.md)
7. 🚀 Automate: [ADVANCED.md](ADVANCED.md)

## Documentation Map

| Document                           | Read If...                     |
| ---------------------------------- | ------------------------------ |
| [README.md](README.md)             | You want the overview          |
| **START HERE**                     | [QUICKSTART.md](QUICKSTART.md) |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md) | Setting up for the first time  |
| [YAML_FORMAT.md](YAML_FORMAT.md)   | Need format reference          |
| [EXAMPLES.md](EXAMPLES.md)         | Want to see sample quizzes     |
| [ADVANCED.md](ADVANCED.md)         | Using automation/CI-CD         |
| [INDEX.md](INDEX.md)               | Navigating all docs            |

## One More Thing

The tool respects your Google account's privacy:

- All authentication happens locally (no server)
- Your credentials stay on your computer
- Only Google Forms are accessed
- You control what's uploaded

Happy quizzing! 🎉

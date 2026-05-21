# Documentation Index

Welcome to the Google Forms Quiz Tool! Here's a guide to the documentation.

## 🚀 Getting Started

**New to the tool?** Start here:

1. [QUICKSTART.md](QUICKSTART.md) — 5-minute setup and first form
2. [GOOGLE_SETUP.md](GOOGLE_SETUP.md) — Detailed Google Cloud configuration

## 📖 Core Documentation

| File                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| [README.md](README.md)           | Overview and main reference         |
| [YAML_FORMAT.md](YAML_FORMAT.md) | Complete YAML specification         |
| [EXAMPLES.md](EXAMPLES.md)       | Real-world quiz examples            |
| [ADVANCED.md](ADVANCED.md)       | Scripting, CI/CD, advanced patterns |

## 🎯 Common Tasks

**I want to...**

- **Create a new quiz**: [QUICKSTART.md](QUICKSTART.md#5-minute-setup) → [EXAMPLES.md](EXAMPLES.md#basic-workflow)
- **Learn the YAML format**: [YAML_FORMAT.md](YAML_FORMAT.md)
- **Set up Google credentials**: [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- **Download an existing form**: [README.md](README.md#command-reference) (download command)
- **Update a form**: [README.md](README.md#workflows) (Edit workflow)
- **See example quizzes**: [EXAMPLES.md](EXAMPLES.md)
- **Automate with scripts**: [ADVANCED.md](ADVANCED.md#scripting-and-automation)
- **Integrate with GitHub**: [ADVANCED.md](ADVANCED.md#cicd-integration)
- **Troubleshoot an issue**: [ADVANCED.md](ADVANCED.md#error-handling-and-debugging)

## 📚 Full Documentation Map

```
README.md (Main overview)
├── Quick Start
├── Command Reference
├── YAML Format (Quick ref)
└── Links to detailed docs
    ├── QUICKSTART.md (5-min setup)
    ├── GOOGLE_SETUP.md (OAuth setup)
    ├── YAML_FORMAT.md (Complete spec)
    ├── EXAMPLES.md (Use cases)
    ├── ADVANCED.md (Advanced patterns)
    └── INDEX.md (This file)
```

## 🔍 Reference by Topic

### Installation & Setup

- [QUICKSTART.md](QUICKSTART.md#5-minute-setup)
- [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- [README.md](README.md#setup)

### YAML Format

- [YAML_FORMAT.md](YAML_FORMAT.md) — Complete specification
- [README.md](README.md#yaml-format) — Quick reference
- [EXAMPLES.md](EXAMPLES.md) — Real examples

### CLI Commands

- [README.md](README.md#command-reference) — Quick reference
- [ADVANCED.md](ADVANCED.md#command-line-arguments) — Detailed options
- [EXAMPLES.md](EXAMPLES.md#workflows) — Workflows

### Question Types

- [YAML_FORMAT.md](YAML_FORMAT.md#question-types-explained)
- [EXAMPLES.md](EXAMPLES.md#example-quizzes) — Quizzes with each type

### Workflows

- [EXAMPLES.md](EXAMPLES.md#basic-workflow)
- [README.md](README.md#workflows)
- [ADVANCED.md](ADVANCED.md#scripting-and-automation)

### Troubleshooting

- [ADVANCED.md](ADVANCED.md#error-handling-and-debugging)
- [GOOGLE_SETUP.md](GOOGLE_SETUP.md#troubleshooting)
- [README.md](README.md#troubleshooting)

### Advanced Usage

- [ADVANCED.md](ADVANCED.md) — Scripting, CI/CD, performance
- [EXAMPLES.md](EXAMPLES.md#advanced-patterns) — Advanced patterns

## 💡 Quick Reference

### Commands

```bash
# Initialize template
npm run dev -- init-template -o quiz.yaml

# Create form
npm run dev -- create -i quiz.yaml

# Download form
npm run dev -- download -f FORM_ID -o quiz.yaml

# Update form
npm run dev -- update -f FORM_ID -i quiz.yaml
```

### YAML Structure

```yaml
version: 1
title: Quiz Title
questions:
  - title: Question
    type: single_choice # or multiple_choice, dropdown, short_text, long_text
    points: 1
    options:
      - value: Option 1
      - value: Option 2
        isCorrect: true
```

### Question Types

| Type              | Use Case                      |
| ----------------- | ----------------------------- |
| `single_choice`   | Radio buttons (one answer)    |
| `multiple_choice` | Checkboxes (multiple answers) |
| `dropdown`        | List (one answer)             |
| `short_text`      | Single line input             |
| `long_text`       | Multi-line input              |

## 🆘 Need Help?

1. **Setup issues?** → [GOOGLE_SETUP.md](GOOGLE_SETUP.md#troubleshooting)
2. **YAML syntax errors?** → [YAML_FORMAT.md](YAML_FORMAT.md#validation-rules)
3. **Command not working?** → [ADVANCED.md](ADVANCED.md#error-handling-and-debugging)
4. **Want to see examples?** → [EXAMPLES.md](EXAMPLES.md)
5. **Need a specific workflow?** → [README.md](README.md#workflows)

## 📋 Document Descriptions

### [README.md](README.md)

Main overview with quick start, command reference, and YAML quick reference. Start here for a 30-second overview.

### [QUICKSTART.md](QUICKSTART.md)

5-minute setup guide. Install, configure Google, and create your first form.

### [GOOGLE_SETUP.md](GOOGLE_SETUP.md)

Detailed step-by-step guide for Google Cloud OAuth setup. Includes troubleshooting.

### [YAML_FORMAT.md](YAML_FORMAT.md)

Complete YAML specification with all fields, types, validation rules, and tips.

### [EXAMPLES.md](EXAMPLES.md)

Real-world example quizzes: math, language, training, classroom, surveys. Plus advanced patterns.

### [ADVANCED.md](ADVANCED.md)

Advanced usage: scripting, automation, CI/CD, performance, debugging, extending the tool.

### [INDEX.md](INDEX.md)

This file. Navigation guide to all documentation.

## 🔗 File Structure

```
project-root/
├── README.md              ← Start here
├── QUICKSTART.md          ← 5-min setup
├── GOOGLE_SETUP.md        ← Google Cloud setup
├── YAML_FORMAT.md         ← YAML specification
├── EXAMPLES.md            ← Example quizzes
├── ADVANCED.md            ← Advanced patterns
├── INDEX.md               ← This file
├── src/
│   ├── cli.ts             ← CLI commands
│   └── lib/
│       ├── types.ts       ← TypeScript types
│       ├── validation.ts  ← YAML validation
│       ├── quiz-file.ts   ← YAML I/O
│       ├── google-forms.ts ← Google Forms API
│       └── google-auth.ts ← OAuth
├── examples/
│   └── sample-quiz.yaml   ← Sample quiz
└── package.json           ← Dependencies
```

## 🎓 Learning Path

**Beginner:**

1. [QUICKSTART.md](QUICKSTART.md) — Get it running
2. [README.md](README.md) — Understand the basics
3. [YAML_FORMAT.md](YAML_FORMAT.md) — Learn the format

**Intermediate:**

1. [EXAMPLES.md](EXAMPLES.md) — See real quizzes
2. [README.md](README.md#workflows) — Learn workflows
3. Create your own quizzes!

**Advanced:**

1. [ADVANCED.md](ADVANCED.md) — Scripting and automation
2. [ADVANCED.md](ADVANCED.md#cicd-integration) — CI/CD integration
3. Extend with custom logic!

## 📞 Contributing

Found a typo or have suggestions? Improvements welcome!

## ✅ Verification Checklist

- [ ] Google credentials set up ([GOOGLE_SETUP.md](GOOGLE_SETUP.md))
- [ ] Template generates successfully (`npm run dev -- init-template -o test.yaml`)
- [ ] Can create a form (`npm run dev -- create -i test.yaml`)
- [ ] Can download a form (`npm run dev -- download -f FORM_ID -o test.yaml`)
- [ ] Ready to use!

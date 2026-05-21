# Google Forms Quiz Tool

A TypeScript CLI to manage Google Forms quizzes using simple YAML files. **Create, download, and update** quizzes from the command line.

## What It Does

✅ **Create** new Google Forms quizzes from YAML files  
✅ **Download** existing forms to YAML for editing  
✅ **Update** forms with changes from YAML  
✅ **Support** all major question types (choice, dropdown, text)  
✅ **Define** answer keys and auto-grading points

## Quick Start

🎯 **New here?** Start with [**GETTING_STARTED.md**](GETTING_STARTED.md)

```bash
# 1. Install
npm install

# 2. Set up Google credentials (see GOOGLE_SETUP.md)
# Download credentials.json from Google Cloud and save to project root

# 3. Create your first quiz
npm run dev -- init-template -o quiz.yaml
npm run dev -- create --input quiz.yaml
```

For step-by-step guide, see [**QUICKSTART.md**](QUICKSTART.md) (5 minutes)

## Command Reference

| Command         | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `init-template` | Generate a starter YAML template               |
| `create`        | Create a new Google Form from YAML             |
| `download`      | Download a Google Form as YAML                 |
| `update`        | Replace an existing form's questions with YAML |

### Examples

```bash
# Create template
npm run dev -- init-template --output quiz.yaml

# Create a form
npm run dev -- create --input quiz.yaml
# Output: Created form ID: 1a2b3c4d5e6f7g8h9i0j

# Download a form
npm run dev -- download --form-id 1a2b3c4d5e6f7g8h9i0j --output quiz.yaml

# Update a form
npm run dev -- update --form-id 1a2b3c4d5e6f7g8h9i0j --input quiz.yaml
```

## YAML Format

Questions are defined in a simple YAML structure:

```yaml
version: 1
title: Sample Quiz
description: Optional description
isQuiz: true
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

  - title: Select all prime numbers
    type: multiple_choice
    points: 2
    options:
      - value: "2"
        isCorrect: true
      - value: "3"
        isCorrect: true
      - value: "4"

  - title: One word: largest ocean on Earth
    type: short_text
    correctAnswers:
      - Pacific
```

**Supported question types:**

- `single_choice` - radio buttons
- `multiple_choice` - checkboxes
- `dropdown` - dropdown list
- `short_text` - single line input
- `long_text` - multi-line input

See [**YAML_FORMAT.md**](YAML_FORMAT.md) for complete specification and all fields.

## Documentation

| Document                           | Content                     |
| ---------------------------------- | --------------------------- |
| [QUICKSTART.md](QUICKSTART.md)     | 5-minute setup guide        |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md) | Detailed Google Cloud setup |
| [YAML_FORMAT.md](YAML_FORMAT.md)   | Complete YAML specification |
| [EXAMPLES.md](EXAMPLES.md)         | Real-world example quizzes  |

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Credentials

Follow [GOOGLE_SETUP.md](GOOGLE_SETUP.md) to:

1. Create a Google Cloud project
2. Enable Google Forms API
3. Create OAuth credentials
4. Download `credentials.json` to project root

### 3. Build (optional)

```bash
npm run build
npm run start -- <command>
```

Or use `npm run dev -- <command>` to run directly.

## Development

```bash
npm run build        # Compile TypeScript
npm run dev -- --help   # Show commands
npm run lint         # Run eslint
```

## Limitations

- **Non-question blocks**: Images, videos, sections are skipped when downloading
- **Update scope**: The `update` command replaces ALL questions; it doesn't merge
- **Advanced features**: Form styling, logic branching, and custom themes are not supported
- **Text auto-grading**: Text question answer keys are for reference; Google Forms requires manual review for exact matching

## Examples

See [examples/sample-quiz.yaml](examples/sample-quiz.yaml) for a sample quiz.

More examples in [EXAMPLES.md](EXAMPLES.md):

- Math quizzes
- Language learning
- Employee training
- Classroom assessments
- Customer surveys

## Workflows

### Create a New Quiz

1. `npm run dev -- init-template -o quiz.yaml`
2. Edit `quiz.yaml` in your text editor
3. `npm run dev -- create --input quiz.yaml`
4. Share the responder link from output

### Edit an Existing Quiz

1. `npm run dev -- download --form-id FORM_ID -o quiz.yaml`
2. Edit `quiz.yaml`
3. `npm run dev -- update --form-id FORM_ID --input quiz.yaml`

### Duplicate a Quiz

1. `npm run dev -- download --form-id SOURCE_ID -o quiz.yaml`
2. Edit the title in `quiz.yaml`
3. `npm run dev -- create --input quiz.yaml`

## Troubleshooting

**"Cannot find credentials"**: Run through [GOOGLE_SETUP.md](GOOGLE_SETUP.md) to create `credentials.json`

**"OAuth refresh token error"**: Revoke app access in [Google Account permissions](https://myaccount.google.com/permissions) and try again

**"YAML validation error"**: Check [YAML_FORMAT.md](YAML_FORMAT.md) for field requirements

**"Form created but no questions"**: Ensure your YAML is valid; test with the template first

See [EXAMPLES.md](EXAMPLES.md) for more use cases and patterns.

## License

MIT

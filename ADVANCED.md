# Advanced Usage Guide

This document covers advanced patterns, CLI tips, and edge cases.

## Command-Line Arguments

### Full Command Reference

```bash
npm run dev -- <command> [options]
```

### init-template

Generate a template YAML file.

```bash
npm run dev -- init-template \
  --output quiz.yaml

# Short form
npm run dev -- init-template -o quiz.yaml
```

**Options:**

- `-o, --output` (required): Where to save the template file

### create

Create a new Google Form from a YAML file.

```bash
npm run dev -- create \
  --input quiz.yaml

# Short form
npm run dev -- create -i quiz.yaml
```

**Options:**

- `-i, --input` (required): Path to the YAML file

**Output:**

```
Created form ID: 1a2b3c4d5e6f7g8h9i0j
Responder URL: https://docs.google.com/forms/d/e/...
```

Store the form ID for future updates.

### download

Download an existing Google Form as a YAML file.

```bash
npm run dev -- download \
  --form-id 1a2b3c4d5e6f7g8h9i0j \
  --output quiz.yaml

# Short form
npm run dev -- download -f 1a2b3c4d5e6f7g8h9i0j -o quiz.yaml
```

**Options:**

- `-f, --form-id` (required): The Google Form ID to download
- `-o, --output` (required): Where to save the YAML file

**Note:** This skips non-question elements (images, videos, sections).

### update

Replace questions in an existing Google Form with content from a YAML file.

```bash
npm run dev -- update \
  --form-id 1a2b3c4d5e6f7g8h9i0j \
  --input quiz.yaml

# Short form
npm run dev -- update -f 1a2b3c4d5e6f7g8h9i0j -i quiz.yaml
```

**Options:**

- `-f, --form-id` (required): The Google Form ID to update
- `-i, --input` (required): Path to the YAML file

**Warning:** This replaces ALL questions. Use with care!

## Scripting and Automation

### Batch Create Multiple Quizzes

Create quizzes in a loop from multiple YAML files:

```bash
#!/bin/bash
for file in quizzes/*.yaml; do
  echo "Creating $file..."
  npm run dev -- create --input "$file"
done
```

### Batch Download All Forms

If you have a list of form IDs:

```bash
#!/bin/bash
while read form_id; do
  echo "Downloading $form_id..."
  npm run dev -- download \
    --form-id "$form_id" \
    --output "downloads/$form_id.yaml"
done < form_ids.txt
```

### Programmatic Quiz Generation

Generate quizzes from data:

```javascript
// generate-quiz.js
import fs from "fs";
import yaml from "js-yaml";

const questions = [];
for (let i = 1; i <= 10; i++) {
  questions.push({
    title: `Question ${i}`,
    type: "single_choice",
    points: 1,
    options: [{ value: "A" }, { value: "B", isCorrect: true }, { value: "C" }],
  });
}

const quiz = {
  version: 1,
  title: `Auto-Generated Quiz`,
  isQuiz: true,
  questions,
};

fs.writeFileSync("generated-quiz.yaml", yaml.dump(quiz));
console.log("Quiz generated: generated-quiz.yaml");
```

Run with:

```bash
node generate-quiz.js
npm run dev -- create --input generated-quiz.yaml
```

## Environment Configuration

The tool respects environment variables for credential paths. Set them in `.env`:

```bash
# .env
GOOGLE_CREDENTIALS_PATH=/path/to/credentials.json
GOOGLE_TOKEN_PATH=/path/to/tokens/google-oauth.json
```

Or export them:

```bash
export GOOGLE_CREDENTIALS_PATH=/path/to/credentials.json
npm run dev -- create --input quiz.yaml
```

Defaults:

- `GOOGLE_CREDENTIALS_PATH`: `credentials.json` (project root)
- `GOOGLE_TOKEN_PATH`: `tokens/google-oauth.json` (project root)

## Working with Large Quizzes

### Performance with Many Questions

The tool handles quizzes with 100+ questions, but uploads take longer. Tips:

1. **Upload in batches**: Create forms incrementally if needed
2. **Batch edits**: Make multiple changes before uploading
3. **Use `update` carefully**: It processes all questions at once

Example workflow:

```bash
# Create form with initial questions
npm run dev -- create --input quiz-part1.yaml

# Form ID returned: 1a2b3c4d5e6f7g8h9i0j

# Later, add more questions by updating
npm run dev -- update \
  --form-id 1a2b3c4d5e6f7g8h9i0j \
  --input quiz-all-questions.yaml
```

### Memory Management

For very large YAML files (1000+ questions), the tool may consume significant memory. If you hit limits:

1. Split into multiple forms
2. Run the tool with more memory: `node --max-old-space-size=4096 dist/cli.js`

## Error Handling and Debugging

### Enable Verbose Output

Add a `DEBUG` flag (for future versions):

```bash
DEBUG=* npm run dev -- download --form-id 1a2b3c4d5e6f7g8h9i0j -o quiz.yaml
```

### Common Errors

**"Cannot find form"**

- Verify form ID is correct
- Check you have edit access
- Try the URL: `https://docs.google.com/forms/d/FORM_ID/edit`

**"Invalid credentials.json"**

- Ensure it's valid JSON
- Check it has `installed` or `web` field
- Verify file path in `.env`

**"OAuth token expired"**

- Delete `tokens/google-oauth.json`
- Run any command again—it will re-authenticate

**"YAML parse error"**

- Validate YAML syntax with an online tool
- Check indentation (must be consistent)
- Ensure all strings are quoted if they contain special characters

### Check Compiled JavaScript

The compiled code is in `dist/`:

```bash
npm run build
ls -la dist/
```

## CI/CD Integration

### GitHub Actions Example

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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - name: Update forms
        env:
          GOOGLE_CREDENTIALS_PATH: ${{ secrets.GOOGLE_CREDENTIALS }}
        run: |
          for file in quizzes/*.yaml; do
            npm run start -- create --input "$file"
          done
```

Set `GOOGLE_CREDENTIALS` secret to your base64-encoded credentials.json.

## Version Control Best Practices

### Store Quizzes in Git

```bash
# Good: Track YAML files
git add quizzes/
git commit -m "Add biology quiz"

# Don't commit credentials
# .gitignore already handles this
```

### Workflow: Edit YAML → Upload → Verify

```bash
# 1. Edit locally
nano quizzes/math-quiz.yaml

# 2. Upload
npm run dev -- create --input quizzes/math-quiz.yaml
# Output: Created form ID: 1a2b3c4d5e6f7g8h9i0j

# 3. Verify in Google Forms UI
# https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j/edit

# 4. Store form ID for reference
echo "1a2b3c4d5e6f7g8h9i0j" > quizzes/math-quiz.id
git add quizzes/math-quiz.yaml quizzes/math-quiz.id
git commit -m "Add math quiz (ID: 1a2b3c4d...)"
```

## Extending the Tool

### Adding Custom Question Types

To add a new question type (currently not supported):

1. Update `types.ts` to add the new type
2. Update `validation.ts` to validate it
3. Update `google-forms.ts` to map it to Google Forms API
4. Test thoroughly

Example: Supporting essay questions with rubrics would require:

- New YAML structure
- Google Forms API integration
- Validation logic

### Forking and Contributing

See the source in `src/`:

- `cli.ts`: CLI commands
- `lib/types.ts`: TypeScript interfaces
- `lib/validation.ts`: Input validation
- `lib/quiz-file.ts`: YAML I/O
- `lib/google-forms.ts`: Google Forms API
- `lib/google-auth.ts`: OAuth handling

## Tips & Tricks

### Quick ID Extraction

If you see a form URL, extract the ID:

```bash
# From: https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j/edit
# Extract: 1a2b3c4d5e6f7g8h9i0j

url="https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j/edit"
id=$(echo "$url" | grep -oP 'd/\K[^/]+')
echo "$id"  # Output: 1a2b3c4d5e6f7g8h9i0j
```

### Sync Multiple Environments

Use different Google accounts for dev/prod:

```bash
# Dev environment
GOOGLE_CREDENTIALS_PATH=credentials-dev.json npm run dev -- create --input quiz.yaml

# Prod environment
GOOGLE_CREDENTIALS_PATH=credentials-prod.json npm run dev -- create --input quiz.yaml
```

### Preview YAML Before Upload

```bash
# Generate and review template
npm run dev -- init-template -o preview.yaml
cat preview.yaml

# Or download and inspect
npm run dev -- download -f FORM_ID -o preview.yaml
cat preview.yaml
```

## Support and Issues

- **Questions**: Check [EXAMPLES.md](EXAMPLES.md) and [YAML_FORMAT.md](YAML_FORMAT.md)
- **Setup issues**: See [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- **Bugs**: Open an issue with:
  1. Command you ran
  2. Error message
  3. Sample YAML file (scrubbed of sensitive data)

# Quick Start Guide

Get up and running in 10 minutes.

## Prerequisites

- Node.js 16+ and npm
- A Google account
- Git (optional, for cloning the repo)

## 5-Minute Setup

### 1. Clone and Install

```bash
git clone <repository-url> quiz-generator
cd quiz-generator
npm install
```

### 2. Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Forms API
4. Create OAuth 2.0 credentials (Desktop app)
5. Download the JSON file and save as `credentials.json` in the project root

**Full guide:** See [GOOGLE_SETUP.md](GOOGLE_SETUP.md)

### 3. Test It Out

```bash
# Generate a sample quiz
npm run dev -- init-template -o sample.yaml

# Create a form in Google Forms
npm run dev -- create --input sample.yaml
```

You'll get output like:

```
Created form ID: 1a2b3c4d5e6f7g8h9i0j
Responder URL: https://docs.google.com/forms/d/e/...
```

Open the responder URL to see your quiz!

## Common Commands

```bash
# Create a new quiz template
npm run dev -- init-template -o myquiz.yaml

# Create a form from YAML
npm run dev -- create --input myquiz.yaml

# Download an existing form
npm run dev -- download --form-id FORM_ID -o myquiz.yaml

# Update a form
npm run dev -- update --form-id FORM_ID --input myquiz.yaml
```

## Editing Your Quiz

1. **Create template**: `npm run dev -- init-template -o quiz.yaml`
2. **Edit in any text editor**: Open `quiz.yaml` and modify questions
3. **Create form**: `npm run dev -- create --input quiz.yaml`
4. **Or update existing**: `npm run dev -- update --form-id FORM_ID --input quiz.yaml`

## Finding Your Form ID

After creating a form, the ID is printed. You can also:

1. Open the form in Google Forms
2. Look at the URL: `https://docs.google.com/forms/d/FORM_ID_HERE/edit`

## Next Steps

- **Read more about YAML format**: [YAML_FORMAT.md](YAML_FORMAT.md)
- **See example quizzes**: [EXAMPLES.md](EXAMPLES.md)
- **Detailed Google setup**: [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- **Full command reference**: [README.md](README.md)

## Troubleshooting

### "Cannot find module 'dotenv'"

Run: `npm install`

### "OAuth did not return a refresh token"

1. Go to [Google Account permissions](https://myaccount.google.com/permissions)
2. Remove the app
3. Try again

### "Form not created / no questions appear"

Make sure your YAML has valid syntax. Test with:

```bash
npm run dev -- init-template -o test.yaml
npm run dev -- create --input test.yaml
```

If this works, your setup is fine. Check your custom YAML for errors.

## What You Can Do

✅ Create new Google Forms quizzes from YAML files  
✅ Download existing Google Forms as YAML  
✅ Update Google Forms from YAML  
✅ Support multiple question types (choice, dropdown, text)  
✅ Include answer keys and scoring  
✅ Manage forms via command line

❌ Add images/videos (download skips these)  
❌ Create conditional sections (branching)  
❌ Manage responses/analytics

## Tips

- **Always keep a backup** of your quiz YAML files
- **Test with the template** first to make sure everything works
- **Use `update` carefully** - it replaces ALL questions in the form
- **Check YAML syntax** if upload fails - use a YAML validator
- **Share the responder URL**, not the edit URL, with respondents

## Getting Help

1. Check [EXAMPLES.md](EXAMPLES.md) for use cases
2. Review [YAML_FORMAT.md](YAML_FORMAT.md) for field reference
3. See [GOOGLE_SETUP.md](GOOGLE_SETUP.md) for authentication issues
4. Check the main [README.md](README.md) for all options

Happy quizzing! 🎉

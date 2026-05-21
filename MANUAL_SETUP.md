# Human Setup Tasks

This document lists the manual steps **you must complete** in your Google account to use the Google Forms Quiz Tool.

The tool itself is fully built and ready. Only these 5 human-action items remain.

## ✅ What's Already Done

The tool is **complete and ready to use**:

- ✅ TypeScript CLI application
- ✅ YAML format and validation
- ✅ Google Forms API integration
- ✅ OAuth authentication code
- ✅ Build system (npm scripts)
- ✅ Complete documentation (10 files, 2,300+ lines)
- ✅ Example quiz
- ✅ Comprehensive guides for every feature

**Verified working:**

- ✅ TypeScript compiles without errors
- ✅ CLI commands functional
- ✅ Template generation works
- ✅ YAML parsing and validation works

## 🔐 Tasks for You (Google Cloud Setup)

These steps must be completed **in your Google account** to enable the tool to create/modify forms.

### Task 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Quiz Tool")
5. Click "CREATE"
6. Wait for creation to complete (1-2 minutes)

**Time:** ~5 minutes

### Task 2: Enable Google Forms API

1. In Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Forms API"
3. Click on "Google Forms API"
4. Click **ENABLE**
5. Wait for enabling to complete

**Time:** ~2 minutes

### Task 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select "External" for User Type
3. Click **CREATE**
4. Fill the form:
   - **App name**: "Quiz Tool" (or your preferred name)
   - **User support email**: Your Gmail address
   - **Developer contact**: Your Gmail address
5. Click **SAVE AND CONTINUE**
6. Skip scopes, click **SAVE AND CONTINUE**
7. Add your Gmail as test user
8. Click **SAVE AND CONTINUE**
9. Click **BACK TO DASHBOARD**

**Time:** ~5 minutes

### Task 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select "Desktop application"
4. Enter a name (e.g., "Quiz Tool CLI")
5. Click **CREATE**
6. A dialog appears with your credentials
7. Click **DOWNLOAD JSON**
8. This downloads a file named something like `client_secret_123456789.apps.googleusercontent.com.json`

**Time:** ~3 minutes

### Task 5: Save Credentials File

1. Rename the downloaded file to `credentials.json`
2. Move it to the project root: `quiz-generator/credentials.json`

Verify:

```bash
ls -la credentials.json
# Should show the file exists
```

**Time:** ~1 minute

---

## Total Setup Time

**~20 minutes** for all Google Cloud setup

---

## After Setup: Verify It Works

Once you've completed all 5 tasks:

```bash
# Test template generation
npm run dev -- init-template -o test.yaml

# Test creating a form (this requires OAuth browser popup)
npm run dev -- create --input test.yaml

# If you see:
#   Template quiz file created at test.yaml
#   Created form ID: 1a2b3c4d...
#
# ✅ You're all set!
```

---

## Where to Get Help

- **Google setup questions?** → [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- **Getting started?** → [GETTING_STARTED.md](GETTING_STARTED.md)
- **Quick reference?** → [QUICKSTART.md](QUICKSTART.md)
- **Finding something?** → [INDEX.md](INDEX.md)

---

## Security Notes

- ✅ Your `credentials.json` is in `.gitignore` - never committed to git
- ✅ OAuth tokens saved to `tokens/` directory - also in `.gitignore`
- ✅ Authentication is local browser-based - no data sent to third parties
- ✅ Only Google Forms are accessed with these credentials

---

## Troubleshooting During Setup

### "Invalid project"

- Make sure you selected the correct project in the dropdown
- If still confused, create a new project

### "Cannot enable Google Forms API"

- Verify the project was created successfully
- You may need a billing account (free tier is available)

### "OAuth consent screen not showing"

- Try clearing browser cache
- Use a different browser
- Try an incognito window

### "Cannot download credentials"

- The download may be blocked by browser
- Try a different browser
- Check if the file landed in Downloads/

### "File not found" when running npm command

- Ensure `credentials.json` is in the project root
- Check the path: `ls -la credentials.json`
- Verify the filename is exact: `credentials.json` (not `client_secret_...json`)

---

## What Happens When You Run a Command

### First Time (requires browser interaction)

```bash
npm run dev -- create --input quiz.yaml
```

1. Tool detects no saved token
2. Opens your default browser
3. You authorize the app
4. Token is saved locally to `tokens/google-oauth.json`
5. Form is created
6. Form ID is printed

### Subsequent Times (seamless)

```bash
npm run dev -- create --input quiz.yaml
```

1. Tool loads saved token from `tokens/`
2. Form is created immediately
3. No browser popup needed

---

## You're Done! 🎉

Once you've completed all 5 tasks, you can:

✅ Create new Google Forms from YAML  
✅ Download existing forms to edit locally  
✅ Update forms with new questions  
✅ Manage quizzes from the command line

**Start here:** [GETTING_STARTED.md](GETTING_STARTED.md)

---

## Summary Checklist

- [ ] Task 1: Create Google Cloud project
- [ ] Task 2: Enable Google Forms API
- [ ] Task 3: Configure OAuth consent screen
- [ ] Task 4: Create OAuth credentials
- [ ] Task 5: Save credentials.json to project root
- [ ] Verify: Run `npm run dev -- init-template -o test.yaml`
- [ ] Verify: Run `npm run dev -- create --input test.yaml`
- [ ] ✅ Ready to use the tool!

Once all checked, head to [GETTING_STARTED.md](GETTING_STARTED.md) to start creating quizzes.

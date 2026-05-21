# Google Cloud Setup Guide

To use this quiz tool, you need to set up OAuth credentials in your Google Cloud account. This guide walks you through the process step-by-step.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select "NEW PROJECT"
3. Enter a project name (e.g., "Quiz Tool") and click "CREATE"
4. Wait for the project to be created (this may take a minute)

## Step 2: Enable Google Forms API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Forms API"
3. Click on "Google Forms API" and press **ENABLE**
4. Wait for the API to be enabled

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select "External" for User Type and click **CREATE**
3. Fill out the OAuth consent screen form:
   - **App name**: "Quiz Tool" (or your preferred name)
   - **User support email**: Use your Google account email
   - **Developer contact**: Use your Google account email
4. Click **SAVE AND CONTINUE**
5. On the **Scopes** screen, click **SAVE AND CONTINUE** (no scopes need to be added manually)
6. On the **Test users** screen, add your Google account email as a test user
7. Click **SAVE AND CONTINUE**, then **BACK TO DASHBOARD**

## Step 4: Create OAuth Client Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select "Desktop application" as the Application type
4. Enter a name (e.g., "Quiz Tool CLI") and click **CREATE**
5. A dialog will appear with your credentials. Click **DOWNLOAD JSON**
6. Save the downloaded file as `credentials.json` in your quiz-generator project root

## Step 5: Configure Environment Variables (Optional)

If you saved `credentials.json` in a non-standard location or want to customize token storage:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` to set custom paths:
   ```
   GOOGLE_CREDENTIALS_PATH=/path/to/your/credentials.json
   GOOGLE_TOKEN_PATH=/path/to/tokens/google-oauth.json
   ```

The default locations are `credentials.json` and `tokens/google-oauth.json` in the project root.

## Step 6: First Authentication

Run any command that requires Google Forms access:

```bash
npm run dev -- init-template -o test.yaml
```

Or try downloading a form:

```bash
npm run dev -- download --form-id YOUR_FORM_ID --output test.yaml
```

A browser window will automatically open asking you to authorize the app. Sign in with your Google account and grant access. The authorization token will be saved locally for future commands.

## Troubleshooting

### "OAuth did not return a refresh token"

If you see this error:

1. Go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Find "Quiz Tool" (or your app name) and click it
3. Click **REMOVE ACCESS**
4. Try the command again—you'll be prompted to re-authorize

### "Invalid credentials.json format"

Make sure your `credentials.json` file is valid JSON and contains either an `installed` or `web` client configuration. Check that:

- The file is valid JSON (use a JSON validator if needed)
- It contains the `installed` field with `client_id` and `client_secret`
- The file path in `.env` (or default path) is correct

### "Cannot find module '@google-cloud/local-auth'"

Run `npm install` to ensure all dependencies are installed.

### API Quota Issues

Google Cloud APIs have usage quotas. For this tool, the free tier should be more than sufficient for personal use. If you hit quota limits, you can request higher limits in the Cloud Console.

## Security Notes

- Keep `credentials.json` and `tokens/google-oauth.json` private
- Do not commit these files to version control (they're in `.gitignore`)
- If you accidentally commit credentials, revoke them immediately in Google Cloud Console
- The tool only requests permissions to read and modify forms; it cannot access other data

## Testing Your Setup

To verify everything is configured correctly:

1. Generate a test template:

   ```bash
   npm run dev -- init-template -o test-quiz.yaml
   ```

2. Create a test form:

   ```bash
   npm run dev -- create --input test-quiz.yaml
   ```

   This will output a form ID like: `Created form ID: 1a2b3c4d5e6f7g8h9i0j`

3. Go to Google Forms and verify your new quiz was created
4. Download it back to YAML:

   ```bash
   npm run dev -- download --form-id 1a2b3c4d5e6f7g8h9i0j --output downloaded-quiz.yaml
   ```

5. Compare the files—they should be nearly identical

Once this works, you're ready to use the tool!

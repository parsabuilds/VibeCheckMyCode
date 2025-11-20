# Firebase Deployment Instructions - Updated

## Issues Fixed

1. Removed unused import causing TypeScript compilation error
2. Migrated from deprecated `functions.config()` to modern `defineSecret` API
3. Updated Node.js engine from 18 to 20 to match your environment

## New Deployment Steps

Since we're now using Firebase's Secret Manager instead of the deprecated config API, follow these updated steps:

### On Your Local Machine

From your project directory (~/projects/SecureAF):

```bash
# 1. Create the secrets using Google Secret Manager
firebase functions:secrets:set GITHUB_CLIENT_ID
# When prompted, paste: Ov23li8fMUwzM0T8U6Xz

firebase functions:secrets:set GITHUB_CLIENT_SECRET
# When prompted, paste: 8bffeda609360a2ca73f71f3da9c20ca122ebb9c

firebase functions:secrets:set CLAUDE_API_KEY
# When prompted, paste: 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

# 2. Deploy the functions
firebase deploy --only functions
```

That's it! The functions will now use the secure Secret Manager.

### After Deployment

1. The terminal will show your function URLs like:
   ```
   ✔  functions[githubOauth(us-central1)] https://us-central1-af-b76a3.cloudfunctions.net/githubOauth
   ✔  functions[generateFix(us-central1)] https://us-central1-af-b76a3.cloudfunctions.net/generateFix
   ✔  functions[createPr(us-central1)] https://us-central1-af-b76a3.cloudfunctions.net/createPr
   ```

2. Copy the base URL (everything before the function name) to your Bolt environment's `.env`:
   ```
   VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-af-b76a3.cloudfunctions.net
   ```

3. Rebuild your frontend in Bolt:
   ```bash
   npm run build
   ```

## What Changed from Previous Instructions

- **OLD**: `firebase functions:config:set` (deprecated, stops working Dec 31, 2025)
- **NEW**: `firebase functions:secrets:set` (modern, secure Secret Manager)

- **OLD**: Functions accessed secrets via `functions.config().github.client_id`
- **NEW**: Functions use `defineSecret()` and `.value()` method

## Benefits of New Approach

1. More secure - secrets stored in Google Secret Manager
2. Better access control and audit logging
3. No deprecation warnings
4. Works beyond 2025
5. Can be accessed across multiple cloud services

## Troubleshooting

If deployment fails with secret-related errors:

```bash
# List all secrets
firebase functions:secrets:access GITHUB_CLIENT_ID
firebase functions:secrets:access GITHUB_CLIENT_SECRET
firebase functions:secrets:access CLAUDE_API_KEY

# If any are missing, set them again
firebase functions:secrets:set SECRET_NAME
```

## Verify Deployment

After deployment, test each function:

```bash
# Test githubOauth (should return method not allowed for GET)
curl https://us-central1-af-b76a3.cloudfunctions.net/githubOauth

# Check function logs
firebase functions:log
```

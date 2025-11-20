# Firebase Deployment Guide

This guide will help you complete the Firebase migration and deploy your SecureAF application.

## What Has Been Done

The codebase has been successfully migrated from Supabase to Firebase:

- Removed all Supabase dependencies and configuration
- Installed Firebase SDK and dependencies
- Converted 3 Edge Functions to Firebase Cloud Functions
- Created Firebase configuration files
- Updated frontend services to use Firebase Functions
- Created Firestore security rules
- Project builds successfully

## What You Need to Do

### 1. Update Firebase Project ID

Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 2. Update Environment Variables

Edit `.env` file and replace the placeholder values with your Firebase configuration:

```bash
# Get these from Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id

# This will be available after deploying Cloud Functions
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net

# Keep your existing GitHub OAuth Client ID
VITE_GITHUB_CLIENT_ID=Ov23li8fMUwzM0T8U6Xz
```

### 3. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-cli
```

### 4. Login to Firebase

```bash
firebase login
```

### 5. Initialize Firebase Project

```bash
firebase use --add
```

Select your Firebase project from the list.

### 6. Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 7. Set Cloud Functions Environment Variables

```bash
firebase functions:config:set github.client_id="Ov23li8fMUwzM0T8U6Xz"
firebase functions:config:set github.client_secret="8bffeda609360a2ca73f71f3da9c20ca122ebb9c"
firebase functions:config:set claude.api_key="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"
```

### 8. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 9. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

After deployment completes, note the function URLs that are displayed. They will look like:
- `https://us-central1-your-project-id.cloudfunctions.net/githubOauth`
- `https://us-central1-your-project-id.cloudfunctions.net/generateFix`
- `https://us-central1-your-project-id.cloudfunctions.net/createPr`

### 10. Update VITE_FIREBASE_FUNCTIONS_URL

Update the `.env` file with the base URL (without the function name):

```bash
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
```

### 11. Build and Test Locally

```bash
npm run build
npm run dev
```

### 12. Deploy to Firebase Hosting (Optional)

If you want to host your app on Firebase:

```bash
firebase deploy --only hosting
```

## GitHub OAuth Callback URL

Update your GitHub OAuth App callback URL to match your deployment:

**For local development:**
- `http://localhost:5173/github/callback`

**For Firebase Hosting:**
- `https://your-project-id.web.app/github/callback`

Update this in:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Update "Authorization callback URL"

## Firestore Collections

The following collections will be created automatically when needed:

- `github_tokens` - Stores user GitHub OAuth tokens
- `pr_generation_jobs` - Tracks PR generation job status
- `generated_fixes` - Stores AI-generated code fixes

## Security Rules

Firestore security rules have been configured to:
- Only allow users to read/write their own github_tokens
- Allow authenticated users to read/write pr_generation_jobs and generated_fixes
- Deny all unauthenticated access

## Troubleshooting

### Cloud Functions not working

1. Check that environment variables are set correctly:
   ```bash
   firebase functions:config:get
   ```

2. View function logs:
   ```bash
   firebase functions:log
   ```

3. Test functions locally (requires Firebase emulator):
   ```bash
   firebase emulators:start
   ```

### CORS Errors

All Cloud Functions have been configured with proper CORS headers. If you still see CORS errors:

1. Verify the `VITE_FIREBASE_FUNCTIONS_URL` in `.env` is correct
2. Check that functions are deployed successfully
3. Ensure you're using HTTPS in production

### Build Errors

If you encounter build errors:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Cost Considerations

Firebase has a generous free tier, but be aware:

- **Cloud Functions**: 2M invocations/month free
- **Firestore**: 50K reads, 20K writes, 20K deletes per day free
- **Hosting**: 10GB storage, 360MB/day transfer free

Monitor usage in Firebase Console > Usage and billing

## Next Steps

After deployment:

1. Test the full GitHub OAuth flow
2. Test PR generation with a sample repository
3. Monitor Cloud Function logs for any errors
4. Set up Firebase Performance Monitoring (optional)
5. Configure Firebase Crashlytics for error tracking (optional)

## Support

If you encounter issues:

1. Check Firebase Console for function logs and errors
2. Review browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure GitHub OAuth credentials are correct

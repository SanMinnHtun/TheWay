TheWay
4th year project

## Firebase Setup

The app uses Firebase Authentication and Cloud Firestore from the frontend so it remains compatible with the Firebase Spark plan.

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in the Vite Firebase client config values from the Firebase console.

For production builds, also set `VITE_QUIZ_API_URL` to the deployed quiz backend's HTTPS origin (for example, `https://api.example.com`). The quiz backend must allow the exact Firebase Hosting origin in its CORS configuration and permit `POST` requests with the `Content-Type` header. The local Vite proxy only works during development; `127.0.0.1:8000` cannot be used by deployed visitors. Vite variables are embedded at build time, so set the production value in the deployment environment before `npm run build`.

Required Firebase CLI setup:

```bash
firebase login
firebase projects:list
firebase use --add
```

Deploy Firestore rules only:

```bash
firebase deploy --only firestore:rules
```

Deploy hosting after building:

```bash
npm run build
firebase deploy --only hosting
```

## Way Assistant API

Way Assistant uses the Firebase `assistantChat` function as a server-side proxy to OpenRouter. The provider key must not be added to `.env`, `.env.local`, or any `VITE_*` variable. Rotate any key that has been shared in chat, then set the replacement in Firebase Secret Manager:

```bash
firebase functions:secrets:set OPENROUTER_API_KEY
```

For local development, install the function dependencies and run the Functions emulator alongside Vite:

```bash
npm --prefix functions install
firebase emulators:start --only functions
```

Put a locally scoped key in `functions/.secret.local` for the emulator (`OPENROUTER_API_KEY=...`); this file is ignored by Git. Vite forwards `/api/assistant/chat` to the emulator on `127.0.0.1:5001`.

Deploying Cloud Functions requires the Firebase project to use the Blaze plan. After enabling that plan in Firebase, deploy the function and Hosting rewrite with `firebase deploy --only functions,hosting`.

Profiles are stored at `users/{uid}`. Firestore rules restrict users to their own profile document.

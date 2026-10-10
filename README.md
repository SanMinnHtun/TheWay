TheWay
4th year project

## Firebase Setup

The app uses Firebase Authentication and Cloud Firestore from the frontend so it remains compatible with the Firebase Spark plan.

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in the Vite Firebase client config values from the Firebase console.

The Model 1 career exploration quiz is connected through the same-origin `/api/model1/submit` proxy by default, which avoids browser CORS restrictions when deployed on Vercel. The proxy forwards normalized exploration answers to `https://model1-s2-1.onrender.com/quiz/submit`. Set `VITE_QUIZ_API_URL` to override this with a directly reachable API origin; that backend must then allow the app origin through CORS. Vite variables are embedded at build time, so set the production value in the deployment environment before `npm run build`.

The Way Assistant is also connected through the same-origin `/api/assistant/chat` Vercel proxy in production. It forwards the Firebase ID token to the deployed `assistantChat` Cloud Function. Keep `VITE_ASSISTANT_API_URL` empty unless using a compatible custom assistant endpoint.

The Model 2 career diagnostic is connected to `https://model2-s2.onrender.com` by default. It accepts ten zero-based answer indices at `POST /api/v1/career/predict`. Set `VITE_MODEL2_API_URL` to override this origin for a local or self-hosted deployment. The deployed API must allow the app origin through CORS.

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

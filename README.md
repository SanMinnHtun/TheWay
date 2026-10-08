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

Profiles are stored at `users/{uid}`. Firestore rules restrict users to their own profile document.

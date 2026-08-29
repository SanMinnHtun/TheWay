 #TheWay
4th year end project

## Firebase Setup

The app uses Firebase Authentication and Cloud Firestore from the frontend so it remains compatible with the Firebase Spark plan.

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in the Vite Firebase client config values from the Firebase console.

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

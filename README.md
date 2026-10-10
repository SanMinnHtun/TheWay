TheWay
4th year project

## Firebase Setup

The app uses Firebase Authentication and Cloud Firestore from the frontend so it remains compatible with the Firebase Spark plan.

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in the Vite Firebase client config values from the Firebase console.

The Model 1 career exploration quiz uses the same-origin `/api/model1/submit` proxy in production, which avoids browser CORS restrictions when deployed on Vercel. The proxy forwards normalized exploration answers to `https://model1-s2-1.onrender.com/quiz/submit`. `VITE_QUIZ_API_URL` can override this only during local development; production always uses the proxy.

The Way Assistant is also connected through the same-origin `/api/assistant/chat` Vercel serverless route in production. The route verifies the Firebase ID token through Firebase Auth and calls OpenRouter server-side. Keep `VITE_ASSISTANT_API_URL` empty unless using a compatible custom assistant endpoint.

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

Way Assistant uses the Vercel `/api/assistant/chat` serverless route as a server-side proxy to OpenRouter, so it works while the Firebase project remains on the Spark plan. Configure these Vercel environment variables for the deployed route:

- `OPENROUTER_API_KEY`: the server-only OpenRouter key. Do not use a `VITE_` name.
- `FIREBASE_WEB_API_KEY`: the Firebase web API key used to validate Firebase ID tokens. This is public Firebase configuration, but keeping it server-only avoids adding another production build dependency. The route also accepts `VITE_FIREBASE_API_KEY` as a fallback.

Rotate any key that has been shared in chat before adding the replacement in Vercel. Do not put the OpenRouter key in `.env`, `.env.local`, frontend code, or a client-exposed variable.

For local development, run the Vercel development server so `/api/assistant/chat` is handled by the route:

```bash
vercel dev
```

Firebase Authentication and Firestore can remain on the Spark plan. The Firebase Cloud Function and Firebase Secret Manager setup are not required for this Vercel route.

Profiles are stored at `users/{uid}`. Firestore rules restrict users to their own profile document.

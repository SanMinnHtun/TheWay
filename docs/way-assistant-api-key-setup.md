# Way Assistant API Key Setup

This guide is for the person deploying the backend. The Way Assistant uses an OpenRouter API key, stored as a Firebase Secret Manager secret. The key must stay on the server; it must not be placed in Vercel environment variables, frontend `.env` files, or source code.

## What this setup does

The deployed app sends chat requests to the Vercel route `/api/assistant/chat`. That route forwards the request and the signed-in user's Firebase ID token to the Firebase Cloud Function `assistantChat`. The function verifies the token, reads `OPENROUTER_API_KEY`, and calls OpenRouter (currently using `google/gemini-2.5-flash`).
## Prerequisites

- Access to the OpenRouter account and permission to create an API key.
- Access to the Firebase project `the-way-6f882` with permission to manage Functions secrets and deploy Cloud Functions.
- Firebase CLI installed and authenticated (`firebase --version`, `firebase login`).
- The Firebase project must use the Blaze plan for Cloud Functions deployment.
- Access to the Vercel project is useful for checking deployment logs, but the OpenRouter key does not go in Vercel.


/////////////////////////////
 ///////Step By Step ///////
///////////////////////////



## Setup and deployment

1. **Create an OpenRouter key.** Sign in to the team's OpenRouter account, create an API key, and make sure the account has available credits or billing configured. Keep the key available for the next step; do not paste it into chat, email, a ticket, or a repository file.

2. **Open a terminal at the repository root.** This is the directory containing `firebase.json` and `.firebaserc`.

3. **Sign in and select the production Firebase project.**

   ```bash
   firebase login
   firebase use the-way-6f882
   firebase projects:list
   ```

   Confirm that `the-way-6f882` is the intended production project before continuing.

4. **Save the API key as a Firebase secret.**

   ```bash
   firebase functions:secrets:set OPENROUTER_API_KEY
   ```

   The CLI prompts for the secret value. Paste the OpenRouter key into that prompt. Do not add quotes unless the CLI explicitly asks for them. Firebase stores the value in Secret Manager; it is not committed to the repository.

5. **Deploy the assistant function.**

   ```bash
   firebase deploy --only functions:assistantChat
   ```

   The function declares `OPENROUTER_API_KEY` as a bound secret. Deploying after setting or rotating the secret makes the deployed function version use that secret.

6. **Check the deployment result.** The CLI should report that `assistantChat` deployed successfully in `us-central1`. If the deployment is blocked by billing, enable Firebase billing (Blaze) for the correct project, then run the deploy command again.

7. **Verify in the deployed app.** Sign in to the Vercel app, open Way Assistant, and send a short message. In browser Developer Tools → Network, inspect the `POST /api/assistant/chat` response. A successful response is HTTP `200` and contains a `reply` string.

## Vercel configuration

Vercel should deploy the repository's `api/assistant/chat.js` serverless function. The frontend already uses the same-origin `/api/assistant/chat` path by default. Keep `VITE_ASSISTANT_API_URL` unset or empty for the standard deployment. No OpenRouter key or assistant secret is required in Vercel settings.

The Vercel route forwards requests to the Firebase function at:

```text
https://us-central1-the-way-6f882.cloudfunctions.net/assistantChat
```

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `404` from `/api/assistant/chat` | Confirm Vercel deployed `api/assistant/chat.js` and the project root directory is the repository root. |
| `401` | Confirm the user is signed in and check that Firebase Authentication is configured for the same Firebase project. |
| `503` with `assistant-secret-missing` | Confirm `OPENROUTER_API_KEY` was set in `the-way-6f882`, then redeploy `assistantChat`. |
| `502` with `assistant-provider-auth-error` | The OpenRouter key may be invalid, revoked, or copied incorrectly. Create/set a replacement and redeploy. |
| `502` with `assistant-provider-billing-error` | Check OpenRouter account credits and billing. |
| `502` with `assistant-provider-rate-limit` | Check OpenRouter rate limits and account limits, then retry. |
| `502` with `assistant-provider-model-error` | Check the model availability/configuration in `functions/index.js`. |

View Firebase Function logs with:

```bash
firebase functions:log --only assistantChat
```

Also check Vercel deployment/function logs if the request never reaches Firebase. Do not include API key values in log excerpts or support tickets.

## Rotating or removing the key

If a key may have been exposed, revoke it in OpenRouter, create a replacement, set the replacement with `firebase functions:secrets:set OPENROUTER_API_KEY`, and redeploy the function. Never reuse a key that has been committed or shared publicly.

To remove the secret after the assistant is no longer needed, use the Firebase CLI secret deletion command shown by `firebase functions:secrets:destroy --help`, then redeploy or delete the function as appropriate.

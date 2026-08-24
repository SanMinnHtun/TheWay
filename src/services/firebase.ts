import { getAnalytics, isSupported, type Analytics } from "@firebase/analytics";
import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions
} from "@firebase/app";

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;

let analyticsPromise: Promise<Analytics | null> | null = null;

function getFirebaseConfig(): FirebaseOptions {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  } satisfies FirebaseOptions;

  const hasMissingRequiredKey = requiredConfigKeys.some((key) => !config[key]);

  if (hasMissingRequiredKey) {
    throw new Error("missing-firebase-config");
  }

  return config;
}

export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
}

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    return Promise.resolve(null);
  }

  analyticsPromise ??= isSupported()
    .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
    .catch(() => null);

  return analyticsPromise;
}

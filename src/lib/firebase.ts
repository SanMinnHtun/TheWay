import { getApps, initializeApp, type FirebaseApp } from "@firebase/app";
import { getAuth, type Auth } from "@firebase/auth";
import { getFirestore, type Firestore } from "@firebase/firestore/lite";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;

function readFirebaseConfig(): FirebaseConfig {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined
  };

  const missingKeys = Object.entries({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    appId: config.appId
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error("missing-firebase-config");
  }

  return {
    apiKey: config.apiKey as string,
    authDomain: config.authDomain as string,
    projectId: config.projectId as string,
    appId: config.appId as string,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId
  };
}

export function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = getApps()[0] ?? initializeApp(readFirebaseConfig());
  }

  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
}

export function getFirebaseDb() {
  if (!firebaseDb) {
    firebaseDb = getFirestore(getFirebaseApp());
  }

  return firebaseDb;
}

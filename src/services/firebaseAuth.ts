import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
  type User
} from "@firebase/auth";
import { getFirebaseAuth } from "../lib/firebase";

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account"
  });

  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithPopup(auth, provider);

  return result.user;
}

export async function signOutFromFirebase() {
  await signOut(getFirebaseAuth());
}

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

export function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    name: user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? ""
  };
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "missing-firebase-config") {
    return "Google sign-in is not configured yet. Add the Firebase environment variables and try again.";
  }

  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) {
    return "Sign-in was cancelled. You can try again whenever you're ready.";
  }

  if (code.includes("popup-blocked")) {
    return "Your browser blocked the sign-in window. Please allow popups and try again.";
  }

  if (code.includes("network-request-failed")) {
    return "We couldn't connect to Google. Check your internet connection and try again.";
  }

  if (code.includes("unauthorized-domain")) {
    return "This domain is not allowed for Google sign-in yet. Add it in Firebase Authentication settings.";
  }

  if (code.includes("operation-not-allowed")) {
    return "Google sign-in is not enabled yet. Enable the Google provider in Firebase Authentication.";
  }

  if (code.includes("account-exists-with-different-credential")) {
    return "An account already exists with this email. Try signing in with the provider you used before.";
  }

  return "We couldn't complete Google sign-in. Please try again.";
}

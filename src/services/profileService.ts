import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData
} from "@firebase/firestore/lite";
import { getFirebaseDb } from "../lib/firebase";
import type { CreateProfileInput, UpdateProfileInput, UserProfile } from "../types/profile";

function profileRef(uid: string) {
  return doc(getFirebaseDb(), "users", uid);
}

function mapProfileData(data: DocumentData): UserProfile {
  return {
    uid: String(data.uid ?? ""),
    email: String(data.email ?? ""),
    displayName: String(data.displayName ?? ""),
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    currentStatus: typeof data.currentStatus === "string" ? data.currentStatus : "",
    mode: data.mode === "GOAL" ? "GOAL" : "EXPLORE",
    language: data.language === "my" ? "my" : "en",
    onboardingCompleted: Boolean(data.onboardingCompleted),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(profileRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return mapProfileData(snapshot.data());
}

export async function createUserProfile(uid: string, input: CreateProfileInput): Promise<void> {
  const existingProfile = await getUserProfile(uid);

  if (existingProfile?.onboardingCompleted) {
    throw new Error("profile-already-exists");
  }

  await setDoc(profileRef(uid), {
    uid,
    email: input.email,
    displayName: input.displayName,
    photoURL: input.photoURL ?? null,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
    currentStatus: input.currentStatus ?? "",
    mode: input.mode,
    language: input.language,
    onboardingCompleted: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateUserProfile(uid: string, input: UpdateProfileInput): Promise<void> {
  await updateDoc(profileRef(uid), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(profileRef(uid));
}

export function getProfileErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (error instanceof Error && error.message === "profile-already-exists") {
    return "Your profile already exists. We will take you to TheWay.";
  }

  if (code.includes("permission-denied")) {
    return "We couldn't access your profile because the request was not allowed.";
  }

  if (code.includes("unavailable") || code.includes("network-request-failed")) {
    return "We couldn't reach Firestore. Check your connection and try again.";
  }

  if (code.includes("not-found")) {
    return "We couldn't find that profile.";
  }

  return "We couldn't save your profile. Please try again.";
}

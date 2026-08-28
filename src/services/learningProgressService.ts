import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, type DocumentData } from "@firebase/firestore/lite";
import { getFirebaseDb } from "../lib/firebase";
import type { UserLearningState } from "../types/learning";

export type PersistedLearningState = Omit<UserLearningState, "updatedAt">;

function learningProgressRef(uid: string) {
  return doc(getFirebaseDb(), "learningProgress", uid);
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapLearningState(uid: string, data: DocumentData): UserLearningState {
  return {
    uid,
    selectedCareerId: typeof data.selectedCareerId === "string" ? data.selectedCareerId : null,
    roadmapId: typeof data.roadmapId === "string" ? data.roadmapId : null,
    currentStageId: typeof data.currentStageId === "string" ? data.currentStageId : null,
    completedSkillIds: stringArray(data.completedSkillIds),
    savedResourceIds: stringArray(data.savedResourceIds),
    startedAt: data.startedAt ?? null,
    updatedAt: data.updatedAt ?? null
  };
}

export async function getUserLearningState(uid: string): Promise<UserLearningState | null> {
  const snapshot = await getDoc(learningProgressRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return mapLearningState(uid, snapshot.data());
}

export async function saveUserLearningState(
  uid: string,
  state: PersistedLearningState,
  initialize = false
): Promise<void> {
  await setDoc(
    learningProgressRef(uid),
    {
      uid,
      selectedCareerId: state.selectedCareerId,
      roadmapId: state.roadmapId,
      currentStageId: state.currentStageId,
      completedSkillIds: state.completedSkillIds,
      savedResourceIds: state.savedResourceIds,
      ...(initialize ? { startedAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteUserLearningState(uid: string): Promise<void> {
  await deleteDoc(learningProgressRef(uid));
}

export function getLearningProgressErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code.includes("permission-denied")) {
    return "We couldn't update your learning progress because the request was not allowed.";
  }

  if (code.includes("unavailable") || code.includes("network-request-failed")) {
    return "We couldn't reach Firestore. Check your connection and try again.";
  }

  return "We couldn't update your learning progress. Please try again.";
}

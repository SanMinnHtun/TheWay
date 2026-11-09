import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData
} from "@firebase/firestore/lite";
import { getFirebaseDb } from "../lib/firebase";
import type { ExplorationQuizSubmission } from "../data/explorationQuiz";

export interface SavedModel1Assessment {
  id: string;
  result: unknown;
}

function assessmentResultsRef(uid: string) {
  return collection(getFirebaseDb(), "users", uid, "assessment_results");
}

export async function saveModel1Assessment(
  uid: string,
  answers: ExplorationQuizSubmission,
  result: unknown
): Promise<void> {
  if (typeof result !== "object" || result === null) return;

  await addDoc(assessmentResultsRef(uid), {
    userId: uid,
    modelType: "MODEL_1",
    answers,
    result,
    createdAt: serverTimestamp()
  });
}

export async function getLatestModel1Assessment(uid: string): Promise<SavedModel1Assessment | null> {
  const latestQuery = query(assessmentResultsRef(uid), orderBy("createdAt", "desc"), limit(20));
  const snapshot = await getDocs(latestQuery);
  const latest = snapshot.docs.find((item) => item.data().modelType === "MODEL_1");

  if (!latest) return null;
  const data: DocumentData = latest.data();
  return { id: latest.id, result: data.result };
}

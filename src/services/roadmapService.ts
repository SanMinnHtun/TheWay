import { doc, getDoc, setDoc } from "@firebase/firestore/lite";
import { getFirebaseAuth, getFirebaseDb } from "../lib/firebase";
import type { EditableRoadmap } from "../data/roadmapGenerator";

const LOCAL_ROADMAP_KEY = "my_saved_roadmap";

function cacheKey(uid?: string | null) {
  return uid ? `theway.savedRoadmap.${uid}` : LOCAL_ROADMAP_KEY;
}

function readLocalRoadmap(uid?: string | null): EditableRoadmap | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(cacheKey(uid)) ?? "null");
    if (value && typeof value === "object" && "roleTitle" in value && "stages" in value &&
      typeof value.roleTitle === "string" && Array.isArray(value.stages)) return value as EditableRoadmap;
  } catch (error) {
    console.warn("Could not read the local roadmap cache", error);
  }
  return null;
}

function writeLocalRoadmap(data: EditableRoadmap, uid?: string | null) {
  try {
    localStorage.setItem(cacheKey(uid), JSON.stringify(data));
  } catch (error) {
    console.warn("Could not update the local roadmap cache", error);
  }
}

function userRoadmapRef(uid: string) {
  return doc(getFirebaseDb(), "users", uid, "saved_data", "roadmap");
}

function currentFirebaseUser() {
  try {
    return getFirebaseAuth().currentUser;
  } catch {
    return null;
  }
}

function roadmapFromData(data: Record<string, unknown>): EditableRoadmap | null {
  if (typeof data.roleTitle !== "string" || !Array.isArray(data.stages)) return null;
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString();
  return {
    roleTitle: data.roleTitle,
    matchPercentage: typeof data.matchPercentage === "number" ? data.matchPercentage : 0,
    stages: data.stages as EditableRoadmap["stages"],
    lastSaved: typeof data.lastSaved === "string" ? data.lastSaved : updatedAt
  };
}

/** Persist the user's custom roadmap in Firestore, maintaining a local offline cache. */
export async function saveUserRoadmap(roadmapData: EditableRoadmap, uid?: string | null) {
  const user = currentFirebaseUser();
  const userId = user?.uid ?? uid ?? null;
  const payload = { ...roadmapData, updatedAt: new Date().toISOString() };
  writeLocalRoadmap(payload, userId);

  if (!userId || !user) {
    return { success: true as const, storage: "local" as const };
  }

  try {
    await setDoc(userRoadmapRef(userId), payload, { merge: true });
    return { success: true as const, storage: "firestore" as const };
  } catch (error) {
    console.error("Error saving roadmap to Firestore; the local cache was kept:", error);
    return { success: true as const, storage: "local" as const, error };
  }
}

/** Read Firestore first, then use the local cache when Firestore is unavailable or empty. */
export async function fetchUserRoadmap(uid?: string | null): Promise<EditableRoadmap | null> {
  const user = currentFirebaseUser();
  const userId = user?.uid ?? uid ?? null;

  if (userId && user) {
    try {
      const snapshot = await getDoc(userRoadmapRef(userId));
      if (snapshot.exists()) {
        const roadmap = roadmapFromData(snapshot.data());
        if (roadmap) {
          writeLocalRoadmap(roadmap, userId);
          return roadmap;
        }
      }
    } catch (error) {
      console.warn("Error fetching roadmap from Firestore; using the local cache:", error);
    }
  }

  return readLocalRoadmap(userId);
}

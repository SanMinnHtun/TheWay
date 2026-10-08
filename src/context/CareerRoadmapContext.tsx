import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { generateTopRoleRoadmap, type EditableRoadmap } from "../data/roadmapGenerator";
import type { Model2Prediction } from "../services/model2CareerPrediction";
import { fetchUserRoadmap, saveUserRoadmap } from "../services/roadmapService";
import { useAuth } from "./AuthContext";

interface CareerRoadmapContextValue {
  roadmap: EditableRoadmap | null;
  savedRoadmap: EditableRoadmap | null;
  isRoadmapModalOpen: boolean;
  isLoadingRoadmap: boolean;
  recordPrediction: (prediction: Model2Prediction) => void;
  setRoadmapModalOpen: (open: boolean) => void;
  updateRoadmap: (updater: (roadmap: EditableRoadmap) => EditableRoadmap, savedOnly?: boolean) => void;
  saveRoadmap: (savedOnly?: boolean) => Promise<void>;
  refreshSavedRoadmap: () => Promise<void>;
}

const CareerRoadmapContext = createContext<CareerRoadmapContextValue | null>(null);

export function CareerRoadmapProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<EditableRoadmap | null>(null);
  const [savedRoadmap, setSavedRoadmap] = useState<EditableRoadmap | null>(null);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const loadedUserRef = useRef<string | null | undefined>(undefined);
  const previousUserRef = useRef<string | null | undefined>(undefined);
  const revisionRef = useRef(0);
  const loadRequestRef = useRef(0);
  const roadmapRef = useRef<EditableRoadmap | null>(roadmap);
  roadmapRef.current = roadmap;

  const refreshSavedRoadmap = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    setIsLoadingRoadmap(true);
    const uid = user?.uid ?? null;
    try {
      const stored = await fetchUserRoadmap(uid);
      // Ignore a response if the signed-in account changed during the request.
      if (requestId !== loadRequestRef.current || loadedUserRef.current !== uid) return;
      setSavedRoadmap(stored ?? roadmapRef.current);
      if (stored) setRoadmap(stored);
      setIsDirty(false);
      revisionRef.current += 1;
    } catch (error) {
      console.error("Could not load the saved roadmap", error);
    } finally {
      if (requestId === loadRequestRef.current) setIsLoadingRoadmap(false);
    }
  }, [user?.uid]);

  // Hydrate at sign-in, then refresh again when My Roadmap is opened.
  useEffect(() => {
    const nextUid = user?.uid ?? null;
    if (previousUserRef.current !== undefined && previousUserRef.current !== nextUid) {
      setRoadmap(null);
      setSavedRoadmap(null);
      setIsDirty(false);
    }
    previousUserRef.current = nextUid;
    loadedUserRef.current = nextUid;
    void refreshSavedRoadmap();
  }, [refreshSavedRoadmap, user?.uid]);

  const recordPrediction = useCallback((prediction: Model2Prediction) => {
    const topEntry = Object.entries(prediction.probabilities).sort((a, b) => b[1] - a[1])[0];
    const role = topEntry?.[0] ?? prediction.predicted_role;
    const percentage = (topEntry?.[1] ?? prediction.confidence) * 100;
    setRoadmap((current) => current?.roleTitle === role
      ? { ...current, matchPercentage: percentage }
      : generateTopRoleRoadmap(role, percentage));
    setIsDirty(false);
    revisionRef.current += 1;
    setIsRoadmapModalOpen(false);
  }, []);

  const updateRoadmap = useCallback((updater: (current: EditableRoadmap) => EditableRoadmap, savedOnly = false) => {
    const base = savedOnly ? savedRoadmap ?? roadmap : roadmap;
    if (!base) return;
    const next = updater(base);
    setRoadmap(next);
    if (savedOnly) setSavedRoadmap(next);
    setIsDirty(true);
    revisionRef.current += 1;
  }, [roadmap, savedRoadmap]);

  const persist = useCallback(async (source: EditableRoadmap) => {
    const next = { ...source, lastSaved: new Date().toISOString() };
    await saveUserRoadmap(next, user?.uid);
    setRoadmap(next);
    setSavedRoadmap(next);
    setIsDirty(false);
  }, [user?.uid]);

  const saveRoadmap = useCallback(async (savedOnly = false) => {
    const source = savedOnly ? savedRoadmap ?? roadmap : roadmap;
    if (!source) return;
    await persist(source);
  }, [persist, roadmap, savedRoadmap]);

  // Autosync editor changes; save button also performs an immediate write.
  useEffect(() => {
    if (!isDirty || !roadmap) return;
    const revision = revisionRef.current;
    const timer = window.setTimeout(() => {
      void saveUserRoadmap({ ...roadmap, lastSaved: new Date().toISOString() }, user?.uid)
        .then(() => {
          if (revisionRef.current !== revision) return;
          setSavedRoadmap({ ...roadmap, lastSaved: new Date().toISOString() });
          setIsDirty(false);
        })
        .catch((error) => console.error("Could not sync roadmap edits", error));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [isDirty, roadmap, user?.uid]);

  const value = useMemo(() => ({
    roadmap,
    savedRoadmap,
    isRoadmapModalOpen,
    isLoadingRoadmap,
    recordPrediction,
    setRoadmapModalOpen: setIsRoadmapModalOpen,
    updateRoadmap,
    saveRoadmap,
    refreshSavedRoadmap
  }), [roadmap, savedRoadmap, isRoadmapModalOpen, isLoadingRoadmap, recordPrediction, updateRoadmap, saveRoadmap, refreshSavedRoadmap]);

  return <CareerRoadmapContext.Provider value={value}>{children}</CareerRoadmapContext.Provider>;
}

export function useCareerRoadmap() {
  const value = useContext(CareerRoadmapContext);
  if (!value) throw new Error("useCareerRoadmap must be used inside CareerRoadmapProvider");
  return value;
}

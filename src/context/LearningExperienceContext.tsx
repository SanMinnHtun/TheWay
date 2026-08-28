import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getRoadmapById } from "../data/learningCatalog";
import { useAuth } from "./AuthContext";
import {
  getLearningProgressErrorMessage,
  getUserLearningState,
  saveUserLearningState,
  type PersistedLearningState
} from "../services/learningProgressService";
import type { UserLearningState } from "../types/learning";

interface LearningExperienceContextValue {
  state: UserLearningState | null;
  loading: boolean;
  error: string;
  startRoadmap: (careerId: string, roadmapId: string, firstStageId: string) => Promise<void>;
  toggleSkill: (skillId: string) => Promise<boolean>;
  toggleSavedResource: (resourceId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const LearningExperienceContext = createContext<LearningExperienceContextValue | null>(null);

function emptyLearningState(uid: string): UserLearningState {
  return {
    uid,
    selectedCareerId: null,
    roadmapId: null,
    currentStageId: null,
    completedSkillIds: [],
    savedResourceIds: [],
    startedAt: null,
    updatedAt: null
  };
}

function persistable(state: UserLearningState): PersistedLearningState {
  return {
    uid: state.uid,
    selectedCareerId: state.selectedCareerId,
    roadmapId: state.roadmapId,
    currentStageId: state.currentStageId,
    completedSkillIds: state.completedSkillIds,
    savedResourceIds: state.savedResourceIds,
    startedAt: state.startedAt
  };
}

function findCurrentStageId(roadmapId: string | null, completedSkillIds: string[]) {
  const roadmap = getRoadmapById(roadmapId);

  if (!roadmap) {
    return null;
  }

  const currentStage = roadmap.stages.find((stage) =>
    stage.skills.some((skill) => !completedSkillIds.includes(skill.id))
  );

  return currentStage?.id ?? roadmap.stages[roadmap.stages.length - 1]?.id ?? null;
}

export function LearningExperienceProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [state, setState] = useState<UserLearningState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!auth.user) {
      setState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextState = await getUserLearningState(auth.user.uid);
      setState(nextState ?? emptyLearningState(auth.user.uid));
    } catch (loadError) {
      setState(emptyLearningState(auth.user.uid));
      setError(getLearningProgressErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
    if (auth.userState !== "authenticated-profile-complete") {
      setState(null);
      setLoading(auth.userState === "loading");
      return;
    }

    void refresh();
  }, [auth.userState, refresh]);

  const startRoadmap = useCallback(
    async (careerId: string, roadmapId: string, firstStageId: string) => {
      if (!auth.user) {
        throw new Error("learning-user-missing");
      }

      const current = state ?? emptyLearningState(auth.user.uid);

      if (current.roadmapId === roadmapId && current.selectedCareerId === careerId) {
        return;
      }

      const now = new Date().toISOString();
      const nextState: UserLearningState = {
        ...current,
        selectedCareerId: careerId,
        roadmapId,
        currentStageId: firstStageId,
        completedSkillIds: [],
        startedAt: now,
        updatedAt: now
      };

      try {
        await saveUserLearningState(auth.user.uid, persistable(nextState), true);
        setState(nextState);
        setError("");
      } catch (saveError) {
        setError(getLearningProgressErrorMessage(saveError));
        throw saveError;
      }
    },
    [auth.user, state]
  );

  const toggleSkill = useCallback(
    async (skillId: string) => {
      if (!auth.user || !state?.roadmapId) {
        throw new Error("learning-roadmap-missing");
      }

      const isCompleted = state.completedSkillIds.includes(skillId);
      const completedSkillIds = isCompleted
        ? state.completedSkillIds.filter((id) => id !== skillId)
        : [...state.completedSkillIds, skillId];
      const now = new Date().toISOString();
      const nextState: UserLearningState = {
        ...state,
        completedSkillIds,
        currentStageId: findCurrentStageId(state.roadmapId, completedSkillIds),
        updatedAt: now
      };

      try {
        await saveUserLearningState(auth.user.uid, persistable(nextState));
        setState(nextState);
        setError("");
        return !isCompleted;
      } catch (saveError) {
        setError(getLearningProgressErrorMessage(saveError));
        throw saveError;
      }
    },
    [auth.user, state]
  );

  const toggleSavedResource = useCallback(
    async (resourceId: string) => {
      if (!auth.user) {
        throw new Error("learning-user-missing");
      }

      const current = state ?? emptyLearningState(auth.user.uid);
      const isSaved = current.savedResourceIds.includes(resourceId);
      const savedResourceIds = isSaved
        ? current.savedResourceIds.filter((id) => id !== resourceId)
        : [...current.savedResourceIds, resourceId];
      const nextState: UserLearningState = {
        ...current,
        savedResourceIds,
        updatedAt: new Date().toISOString()
      };

      try {
        await saveUserLearningState(auth.user.uid, persistable(nextState), !state);
        setState(nextState);
        setError("");
        return !isSaved;
      } catch (saveError) {
        setError(getLearningProgressErrorMessage(saveError));
        throw saveError;
      }
    },
    [auth.user, state]
  );

  const value = useMemo<LearningExperienceContextValue>(
    () => ({ state, loading, error, startRoadmap, toggleSkill, toggleSavedResource, refresh }),
    [error, loading, refresh, startRoadmap, state, toggleSavedResource, toggleSkill]
  );

  return <LearningExperienceContext.Provider value={value}>{children}</LearningExperienceContext.Provider>;
}

export function useLearningExperience() {
  const context = useContext(LearningExperienceContext);

  if (!context) {
    throw new Error("useLearningExperience must be used within LearningExperienceProvider");
  }

  return context;
}

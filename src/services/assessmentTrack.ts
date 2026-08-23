import type { AssessmentTrack } from "../types/onboarding";

const assessmentTrackStorageKey = "the-way.assessment-track";

export function isAssessmentTrack(value: unknown): value is AssessmentTrack {
  return value === "exploring" || value === "goal-focused";
}

export function saveAssessmentTrack(track: AssessmentTrack) {
  window.sessionStorage.setItem(assessmentTrackStorageKey, track);
}

export function readAssessmentTrack() {
  const storedTrack = window.sessionStorage.getItem(assessmentTrackStorageKey);

  return isAssessmentTrack(storedTrack) ? storedTrack : null;
}

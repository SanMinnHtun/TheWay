import type { Timestamp } from "@firebase/firestore/lite";
import type { AssessmentTrack } from "./onboarding";

export type UserMode = "EXPLORE" | "GOAL";
export type AppLanguage = "en" | "my";
export type ProfileGender = "male" | "female" | "other";

export interface ProfileDateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  gender?: ProfileGender;
  dateOfBirth?: ProfileDateOfBirth;
  currentStatus?: string;
  mode: UserMode;
  language: AppLanguage;
  onboardingCompleted: boolean;
  createdAt: Timestamp | Date | null;
  updatedAt: Timestamp | Date | null;
}

export interface CreateProfileInput {
  email: string;
  displayName: string;
  photoURL?: string | null;
  gender?: ProfileGender;
  dateOfBirth?: ProfileDateOfBirth;
  currentStatus?: string;
  mode: UserMode;
  language: AppLanguage;
}

export interface UpdateProfileInput {
  displayName?: string;
  gender?: ProfileGender;
  dateOfBirth?: ProfileDateOfBirth;
  currentStatus?: string;
  language?: AppLanguage;
}

export function assessmentTrackToMode(track: AssessmentTrack): UserMode {
  return track === "goal-focused" ? "GOAL" : "EXPLORE";
}

export function modeToAssessmentTrack(mode: UserMode): AssessmentTrack {
  return mode === "GOAL" ? "goal-focused" : "exploring";
}

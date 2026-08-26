import { onAuthStateChanged } from "@firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getFirebaseAuth } from "../lib/firebase";
import { mapFirebaseUser, signOutFromFirebase, type AuthUser } from "../services/firebaseAuth";
import { getProfileErrorMessage, getUserProfile } from "../services/profileService";
import type { UserProfile } from "../types/profile";

export type UserState =
  | "loading"
  | "unauthenticated"
  | "authenticated-no-profile"
  | "authenticated-profile-complete"
  | "error"
  | "unconfigured";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  userState: UserState;
  loading: boolean;
  profileError: string;
  isAuthenticated: boolean;
  hasProfile: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  setProfile: (profile: UserProfile | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [userState, setUserState] = useState<UserState>("loading");
  const [profileError, setProfileError] = useState("");

  const loadProfile = useCallback(async (nextUser: AuthUser) => {
    setUserState("loading");
    setProfileError("");

    try {
      const nextProfile = await getUserProfile(nextUser.uid);
      setProfileState(nextProfile);

      if (nextProfile?.onboardingCompleted) {
        setUserState("authenticated-profile-complete");
        return nextProfile;
      }

      setUserState("authenticated-no-profile");
      return nextProfile;
    } catch (error) {
      setProfileState(null);
      setProfileError(getProfileErrorMessage(error));
      setUserState("error");
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfileState(null);
      setUserState("unauthenticated");
      return null;
    }

    return loadProfile(user);
  }, [loadProfile, user]);

  const setProfile = useCallback(
    (nextProfile: UserProfile | null) => {
      setProfileState(nextProfile);

      if (!user) {
        setUserState("unauthenticated");
        return;
      }

      setUserState(nextProfile?.onboardingCompleted ? "authenticated-profile-complete" : "authenticated-no-profile");
    },
    [user]
  );

  const signOut = useCallback(async () => {
    await signOutFromFirebase();
    setUser(null);
    setProfileState(null);
    setProfileError("");
    setUserState("unauthenticated");
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          setProfileState(null);
          setProfileError("");
          setUserState("unauthenticated");
          return;
        }

        const nextUser = mapFirebaseUser(firebaseUser);
        setUser(nextUser);
        void loadProfile(nextUser);
      });

      return unsubscribe;
    } catch {
      setUser(null);
      setProfileState(null);
      setProfileError("Firebase is not configured yet.");
      setUserState("unconfigured");
      return undefined;
    }
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      userState,
      loading: userState === "loading",
      profileError,
      isAuthenticated: Boolean(user),
      hasProfile: Boolean(profile?.onboardingCompleted),
      refreshProfile,
      setProfile,
      signOut
    }),
    [profile, profileError, refreshProfile, setProfile, signOut, user, userState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

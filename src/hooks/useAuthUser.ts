import { onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth, mapFirebaseUser, type AuthUser } from "../services/firebaseAuth";

type AuthUserState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated"; user: null }
  | { status: "unconfigured"; user: null };

export function useAuthUser(): AuthUserState {
  const [authUserState, setAuthUserState] = useState<AuthUserState>({
    status: "loading",
    user: null
  });

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
        if (user) {
          setAuthUserState({ status: "authenticated", user: mapFirebaseUser(user) });
          return;
        }

        setAuthUserState({ status: "unauthenticated", user: null });
      });

      return unsubscribe;
    } catch {
      setAuthUserState({ status: "unconfigured", user: null });
      return undefined;
    }
  }, []);

  return authUserState;
}

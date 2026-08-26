import { useAuth } from "../context/AuthContext";
import type { AuthUser } from "../services/firebaseAuth";

type AuthUserState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated"; user: null }
  | { status: "unconfigured"; user: null };

export function useAuthUser(): AuthUserState {
  const auth = useAuth();

  if (auth.userState === "loading") {
    return { status: "loading", user: null };
  }

  if (auth.userState === "unconfigured") {
    return { status: "unconfigured", user: null };
  }

  if (auth.user) {
    return { status: "authenticated", user: auth.user };
  }

  return { status: "unauthenticated", user: null };
}

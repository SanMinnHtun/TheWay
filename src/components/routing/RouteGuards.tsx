import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AppBootLoading, AppRouteError } from "../app/AppRouteState";

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.userState === "loading") {
    return <AppBootLoading />;
  }

  if (auth.userState === "unconfigured") {
    return <AppRouteError message="Firebase is not configured yet." />;
  }

  if (!auth.user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RequireProfile() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.userState === "loading") {
    return <AppBootLoading />;
  }

  if (auth.userState === "error") {
    return <AppRouteError message={auth.profileError} onRetry={() => void auth.refreshProfile()} />;
  }

  if (auth.userState === "unconfigured") {
    return <AppRouteError message="Firebase is not configured yet." />;
  }

  if (!auth.user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!auth.profile?.onboardingCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute({ allowProfileSetup = false }: { allowProfileSetup?: boolean }) {
  const auth = useAuth();

  if (auth.userState === "loading") {
    return <AppBootLoading />;
  }

  if (auth.userState === "authenticated-profile-complete") {
    return <Navigate to="/app/explore" replace />;
  }

  if (allowProfileSetup && auth.userState === "authenticated-no-profile") {
    return <Outlet />;
  }

  if (!allowProfileSetup && auth.userState === "authenticated-no-profile") {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

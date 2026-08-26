import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StarField from "../effects/StarField";
import { CloseIcon, MenuIcon } from "./AppIcons";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

function getStoredCollapsedState() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem("theway.sidebarCollapsed") === "true";
}

export default function AppShell() {
  const location = useLocation();
  const auth = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(getStoredCollapsedState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAssistantRoute = location.pathname === "/app/assistant";
  const currentUser = {
    name: auth.profile?.displayName || auth.user?.name || "TheWay learner",
    email: auth.profile?.email || auth.user?.email || "",
    avatar: auth.profile?.photoURL || auth.user?.photoURL || null
  };

  useEffect(() => {
    window.localStorage.setItem("theway.sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${isCollapsed ? "app-shell--collapsed" : ""}`}>
      <StarField
        className="app-star-field"
        density={isAssistantRoute ? 0.76 : 0.36}
        intensity={isAssistantRoute ? 0.62 : 0.28}
        speed={isAssistantRoute ? 0.42 : 0.24}
      />
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-bottom" aria-hidden="true" />

      <div className="app-desktop-sidebar">
        <Sidebar
          user={currentUser}
          collapsed={isCollapsed}
          onCollapseToggle={() => setIsCollapsed((current) => !current)}
          onSignOut={auth.signOut}
        />
      </div>

      <header className="app-mobile-header">
        <button
          type="button"
          className="app-icon-button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open navigation"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <span>The Way</span>
      </header>

      <div className={`app-drawer-backdrop ${isDrawerOpen ? "app-drawer-backdrop--open" : ""}`}>
        <button
          type="button"
          className="app-drawer-scrim"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close navigation"
        />
        <div className={`app-drawer-panel ${isDrawerOpen ? "app-drawer-panel--open" : ""}`}>
          <button
            type="button"
            className="app-drawer-close app-icon-button"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <Sidebar
            user={currentUser}
            collapsed={false}
            drawer
            onNavigate={() => setIsDrawerOpen(false)}
            onSignOut={auth.signOut}
          />
        </div>
      </div>

      <main className="app-main" key={location.pathname}>
        <Outlet context={{ currentUser, profile: auth.profile }} />
      </main>
    </div>
  );
}

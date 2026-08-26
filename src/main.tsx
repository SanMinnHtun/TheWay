import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import AppShell from "./components/app/AppShell";
import AuthPage from "./components/AuthPage";
import ProfileSetup from "./components/ProfileSetup";
import { RequireProfile, PublicOnlyRoute } from "./components/routing/RouteGuards";
import { AuthProvider } from "./context/AuthContext";
import EditProfile from "./pages/EditProfile";
import ExploreCareers from "./pages/ExploreCareers";
import LearningResources from "./pages/LearningResources";
import MyRoadmap from "./pages/MyRoadmap";
import ProfileDetails from "./pages/ProfileDetails";
import Settings from "./pages/Settings";
import WayAssistant from "./pages/WayAssistant";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          <Route element={<PublicOnlyRoute allowProfileSetup />}>
            <Route path="/profile-setup" element={<ProfileSetup />} />
          </Route>

          <Route element={<RequireProfile />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/assistant" replace />} />
              <Route path="resources" element={<LearningResources />} />
              <Route path="explore" element={<ExploreCareers />} />
              <Route path="roadmap" element={<MyRoadmap />} />
              <Route path="assistant" element={<WayAssistant />} />
              <Route path="profile" element={<ProfileDetails />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

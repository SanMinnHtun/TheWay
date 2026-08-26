import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import AppShell from "./components/app/AppShell";
import AuthPage from "./components/AuthPage";
import ProfileSetup from "./components/ProfileSetup";
import ExploreCareers from "./pages/ExploreCareers";
import LearningResources from "./pages/LearningResources";
import MyRoadmap from "./pages/MyRoadmap";
import Settings from "./pages/Settings";
import WayAssistant from "./pages/WayAssistant";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/assistant" replace />} />
          <Route path="resources" element={<LearningResources />} />
          <Route path="explore" element={<ExploreCareers />} />
          <Route path="roadmap" element={<MyRoadmap />} />
          <Route path="assistant" element={<WayAssistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

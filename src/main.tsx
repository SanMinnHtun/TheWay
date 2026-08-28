import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import AppShell from "./components/app/AppShell";
import AuthPage from "./components/AuthPage";
import ProfileSetup from "./components/ProfileSetup";
import { RequireProfile, PublicOnlyRoute } from "./components/routing/RouteGuards";
import { AuthProvider } from "./context/AuthContext";
import { I18nProvider } from "./i18n/I18nContext";
import "./index.css";

const CareerDetail = lazy(() => import("./pages/CareerDetail"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ExploreCareers = lazy(() => import("./pages/ExploreCareers"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const InterviewQuestionDetail = lazy(() => import("./pages/InterviewQuestionDetail"));
const LearningResources = lazy(() => import("./pages/LearningResources"));
const MyRoadmap = lazy(() => import("./pages/MyRoadmap"));
const ProfileDetails = lazy(() => import("./pages/ProfileDetails"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const WayAssistant = lazy(() => import("./pages/WayAssistant"));

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <I18nProvider>
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
                <Route index element={<Navigate to="/app/explore" replace />} />
                <Route path="resources" element={<LearningResources />} />
                <Route path="resources/projects/:projectSlug" element={<ProjectDetail />} />
                <Route path="resources/guides/:guideSlug" element={<GuideDetail />} />
                <Route path="resources/interview/:questionSlug" element={<InterviewQuestionDetail />} />
                <Route path="explore" element={<ExploreCareers />} />
                <Route path="explore/:careerSlug" element={<CareerDetail />} />
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
      </I18nProvider>
    </AuthProvider>
  </StrictMode>
);

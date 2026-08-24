import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import AuthPage from "./components/AuthPage";
import ProfileSetup from "./components/ProfileSetup";
import "./index.css";
import { initializeFirebaseAnalytics } from "./services/firebase";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

void initializeFirebaseAnalytics();

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

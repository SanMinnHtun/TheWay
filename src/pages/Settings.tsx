import { useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { deleteUserProfile, getProfileErrorMessage } from "../services/profileService";
import type { AppLanguage } from "../types/profile";

export default function Settings() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [languageState, setLanguageState] = useState<"idle" | "saving">("idle");
  const [signOutState, setSignOutState] = useState<"idle" | "signing-out">("idle");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [deleteState, setDeleteState] = useState<"idle" | "deleting">("idle");
  const modalRef = useRef<HTMLDivElement | null>(null);

  async function handleLanguageChange(nextLanguage: AppLanguage) {
    setError("");
    setFeedback("");
    setLanguageState("saving");

    try {
      await setLanguage(nextLanguage);
      setFeedback(t("settings.languageUpdated"));
    } catch (languageError) {
      setError(getProfileErrorMessage(languageError));
    } finally {
      setLanguageState("idle");
    }
  }

  async function handleSignOut() {
    if (signOutState === "signing-out") {
      return;
    }

    setSignOutState("signing-out");
    setError("");

    try {
      await auth.signOut();
      navigate("/", { replace: true });
    } catch {
      setError(t("settings.signOutError"));
      setSignOutState("idle");
    }
  }

  async function handleDeleteProfile() {
    if (!auth.user || confirmValue !== "DELETE") {
      return;
    }

    setDeleteState("deleting");
    setError("");

    try {
      await deleteUserProfile(auth.user.uid);
      await auth.signOut();
      navigate("/", { replace: true });
    } catch (deleteError) {
      setError(getProfileErrorMessage(deleteError));
      setDeleteState("idle");
    }
  }

  function handleModalKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setIsDeleteOpen(false);
      setConfirmValue("");
      return;
    }

    if (event.key !== "Tab" || !modalRef.current) {
      return;
    }

    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input, [href], [tabindex]:not([tabindex='-1'])")
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <section className="app-page-shell">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <div className="settings-grid">
        <section className="settings-card">
          <div>
            <h2>{t("settings.profileTitle")}</h2>
            <p>{t("settings.profileDescription")}</p>
          </div>
          <div className="settings-actions">
            <Link to="/app/profile" className="app-secondary-link">
              {t("sidebar.profile")}
            </Link>
            <Link to="/app/profile/edit" className="app-primary-link">
              {t("common.edit")}
            </Link>
          </div>
        </section>

        <section className="settings-card">
          <div>
            <h2>{t("settings.languageTitle")}</h2>
            <p>{t("settings.languageDescription")}</p>
          </div>
          <div className="language-options" role="radiogroup" aria-label={t("settings.languageTitle")}>
            {(["en", "my"] as AppLanguage[]).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                className={language === option ? "language-option language-option--active" : "language-option"}
                disabled={languageState === "saving"}
                onClick={() => void handleLanguageChange(option)}
                aria-checked={language === option}
              >
                {option === "en" ? t("settings.english") : t("settings.myanmar")}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-card settings-card--danger">
          <div>
            <h2>{t("settings.accountTitle")}</h2>
            <p>{t("settings.accountDescription")}</p>
          </div>
          <div className="settings-actions">
            <button type="button" className="app-secondary-link" disabled={signOutState === "signing-out"} onClick={() => void handleSignOut()}>
              {signOutState === "signing-out" ? t("settings.signingOut") : t("sidebar.signOut")}
            </button>
          </div>

          <div className="danger-zone">
            <h3>{t("settings.dangerTitle")}</h3>
            <p>{t("settings.dangerDescription")}</p>
            <button type="button" onClick={() => setIsDeleteOpen(true)}>
              {t("settings.deleteProfile")}
            </button>
          </div>
        </section>
      </div>

      <div className="profile-form-feedback" aria-live="polite">
        {feedback ? <p className="profile-form-success">{feedback}</p> : null}
        {error ? <p className="profile-form-error">{error}</p> : null}
      </div>

      {isDeleteOpen ? (
        <div className="delete-modal-backdrop" role="presentation">
          <div
            ref={modalRef}
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-profile-title"
            onKeyDown={handleModalKeyDown}
          >
            <h2 id="delete-profile-title">{t("settings.confirmTitle")}</h2>
            <p>{t("settings.confirmDescription")}</p>
            <label>
              <span>{t("settings.confirmPlaceholder")}</span>
              <input
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.target.value)}
                placeholder={t("settings.confirmPlaceholder")}
                autoFocus
              />
            </label>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="app-secondary-link"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setConfirmValue("");
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="delete-confirm-button"
                disabled={confirmValue !== "DELETE" || deleteState === "deleting"}
                onClick={() => void handleDeleteProfile()}
              >
                {deleteState === "deleting" ? t("settings.deleting") : t("settings.deleteProfile")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

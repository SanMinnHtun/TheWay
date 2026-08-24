import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { isAssessmentTrack, readAssessmentTrack, saveAssessmentTrack } from "../services/assessmentTrack";
import { getAuthErrorMessage, signInWithGoogle } from "../services/firebaseAuth";
import { assessmentTrackLabels, type AssessmentTrack } from "../types/onboarding";

interface AuthLocationState {
  assessmentTrack?: AssessmentTrack;
}

interface AuthCopy {
  eyebrow: string;
  heading: string;
  text: string;
}

const authCopyByTrack: Record<AssessmentTrack, AuthCopy> = {
  exploring: {
    eyebrow: "Career discovery",
    heading: "Discover where you belong in tech",
    text: "Sign in to start your personalized career discovery."
  },
  "goal-focused": {
    eyebrow: "Roadmap builder",
    heading: "Build your path into tech",
    text: "Sign in to create a roadmap around your current skills and goals."
  }
};

const neutralCopy: AuthCopy = {
  eyebrow: "Continue your journey",
  heading: "Welcome to The Way",
  text: "Sign in to continue your personalized tech career journey."
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="oauth-button__google" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function Spinner() {
  return <span aria-hidden="true" className="oauth-button__spinner" />;
}

function BrandMark() {
  return (
    <Link to="/" className="tw-brand" aria-label="The Way home">
      <span className="tw-brand-mark" aria-hidden="true">
        <span />
      </span>
      <span>The Way</span>
    </Link>
  );
}

function MiniNetwork() {
  return (
    <svg className="mini-network" viewBox="0 0 680 280" aria-hidden="true">
      <path d="M70 206 C170 98 280 93 340 142 C410 201 510 190 610 76" />
      <path d="M118 112 C238 38 416 42 548 151" />
      <circle cx="70" cy="206" r="7" />
      <circle cx="340" cy="142" r="8" />
      <circle cx="610" cy="76" r="7" />
      <circle cx="548" cy="151" r="5" />
    </svg>
  );
}

function OnboardingProgress() {
  return (
    <div className="onboarding-progress" aria-label="Onboarding progress">
      <span className="is-active">Account</span>
      <i className="onboarding-progress__line" aria-hidden="true" />
      <span>Profile</span>
      <i className="onboarding-progress__line" aria-hidden="true" />
      <span>Assessment</span>
    </div>
  );
}

function resolveTrack(locationState: AuthLocationState | null) {
  if (isAssessmentTrack(locationState?.assessmentTrack)) {
    return locationState.assessmentTrack;
  }

  return readAssessmentTrack();
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUserState = useAuthUser();
  const [selectedTrack, setSelectedTrack] = useState<AssessmentTrack | null>(() =>
    resolveTrack(location.state as AuthLocationState | null)
  );
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const copy = useMemo(() => (selectedTrack ? authCopyByTrack[selectedTrack] : neutralCopy), [selectedTrack]);

  useEffect(() => {
    const nextTrack = resolveTrack(location.state as AuthLocationState | null);

    if (nextTrack) {
      saveAssessmentTrack(nextTrack);
      setSelectedTrack(nextTrack);
    }
  }, [location.state]);

  useEffect(() => {
    if (authUserState.status === "authenticated") {
      navigate("/profile-setup", {
        replace: true,
        state: {
          assessmentTrack: selectedTrack ?? readAssessmentTrack(),
          authUser: authUserState.user
        }
      });
    }
  }, [authUserState, navigate, selectedTrack]);

  async function handleGoogleSignIn() {
    if (isSigningIn) {
      return;
    }

    setErrorMessage("");
    setIsSigningIn(true);

    try {
      const user = await signInWithGoogle();

      navigate("/profile-setup", {
        replace: true,
        state: {
          assessmentTrack: selectedTrack ?? readAssessmentTrack(),
          authUser: {
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            photoURL: user.photoURL ?? ""
          }
        }
      });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  }

  const isAuthLoading = authUserState.status === "loading";
  const isButtonDisabled = isSigningIn || isAuthLoading;

  return (
    <main className="tw-page auth-shell">
      <div className="tw-bg" aria-hidden="true">
        <span className="tw-bg__grid" />
        <span className="tw-bg__light tw-bg__light--left" />
        <span className="tw-bg__light tw-bg__light--right" />
      </div>
      <MiniNetwork />

      <header className="auth-header">
        <BrandMark />
        <Link to="/" className="tw-button tw-button--secondary tw-button--small">
          Back to Home
        </Link>
      </header>

      <section className="auth-layout page-enter" aria-labelledby="auth-title">
        <div className="auth-card">
          <OnboardingProgress />
          <p className="tw-eyebrow auth-card__eyebrow">{copy.eyebrow}</p>
          <h1 id="auth-title">{copy.heading}</h1>
          <p>{copy.text}</p>

          {selectedTrack ? (
            <div className="journey-chip" aria-label="Your selected journey">
              <span>Your Journey</span>
              <strong>{assessmentTrackLabels[selectedTrack]}</strong>
            </div>
          ) : null}

          <button
            type="button"
            disabled={isButtonDisabled}
            onClick={handleGoogleSignIn}
            aria-busy={isSigningIn}
            className="oauth-button"
          >
            {isSigningIn ? <Spinner /> : <GoogleIcon />}
            <span>{isSigningIn ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <p className="auth-card__security">Secure sign-in with Google</p>

          <div className="auth-error-slot" aria-live="polite">
            {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

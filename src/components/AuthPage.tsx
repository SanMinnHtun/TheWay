import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, signInWithGoogle } from "../services/firebaseAuth";
import { isAssessmentTrack, readAssessmentTrack, saveAssessmentTrack } from "../services/assessmentTrack";
import { assessmentTrackLabels, type AssessmentTrack } from "../types/onboarding";
import { useAuthUser } from "../hooks/useAuthUser";

interface AuthLocationState {
  assessmentTrack?: AssessmentTrack;
}

interface AuthCopy {
  heading: string;
  text: string;
  eyebrow: string;
}

const authCopyByTrack: Record<AssessmentTrack, AuthCopy> = {
  exploring: {
    heading: "Discover where you belong in tech",
    text: "Sign in to start your personalized career discovery assessment.",
    eyebrow: "CAREER DISCOVERY"
  },
  "goal-focused": {
    heading: "Build your path into tech",
    text: "Sign in to create a roadmap based on your current skills and goals.",
    eyebrow: "ROADMAP BUILDER"
  }
};

const neutralCopy: AuthCopy = {
  heading: "Welcome to The Way",
  text: "Sign in to continue your personalized tech career journey.",
  eyebrow: "CONTINUE YOUR JOURNEY"
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-400/40 border-t-white"
    />
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
    <main className="min-h-[100dvh] overflow-hidden bg-[#02090f] text-white">
      <div className="landing-shell flex min-h-[100dvh] flex-col !pb-8 !pt-6 sm:!px-8 sm:!pt-8">
        <div className="stars-layer" />
        <div className="glow glow-left" />
        <div className="glow glow-bottom" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link
            to="/"
            className="text-base font-semibold tracking-[0.16em] text-white transition hover:text-[#beb8ff] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#02090f]"
          >
            THE WAY
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-purple-300/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#02090f]"
          >
            Back<span className="hidden sm:inline"> to home</span>
          </Link>
        </header>

        <section className="mx-auto flex w-full max-w-[500px] flex-1 items-center py-10 sm:py-12">
          <div className="w-full rounded-[19px] border border-white/60 bg-gradient-to-br from-[#1e2532]/90 to-[#0e1622]/80 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
            <p className="mb-5 text-[13px] font-medium tracking-[0.2em] text-[#beb8ff]">{copy.eyebrow}</p>

            <h1 className="mx-auto text-[31px] font-extrabold leading-tight tracking-normal text-[#f7f6ff] sm:text-[40px]">
              {copy.heading}
            </h1>

            <p className="mx-auto mt-5 max-w-[360px] text-sm leading-7 text-[#d9d7e7]">{copy.text}</p>

            {selectedTrack ? (
              <div className="mx-auto mt-7 rounded-xl border border-purple-300/25 bg-purple-400/10 px-4 py-3 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#beb8ff]">Your path</p>
                <p className="mt-1 text-sm font-semibold text-white">{assessmentTrackLabels[selectedTrack]}</p>
              </div>
            ) : null}

            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={handleGoogleSignIn}
              aria-busy={isSigningIn}
              className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 text-base font-bold text-[#172033] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_18px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-[#f7f6ff] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#121324] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
            >
              {isSigningIn ? <Spinner /> : <GoogleIcon />}
              <span className="inline-block min-w-[178px]">{isSigningIn ? "Connecting..." : "Continue with Google"}</span>
            </button>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              Your progress and roadmap stay connected to your account.
            </p>

            <div className="mt-5 min-h-12" aria-live="polite">
              {errorMessage ? (
                <p className="rounded-lg border border-red-300/25 bg-red-500/10 px-4 py-3 text-left text-sm leading-6 text-red-100">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

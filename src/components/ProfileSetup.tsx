import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { isAssessmentTrack, readAssessmentTrack, saveAssessmentTrack } from "../services/assessmentTrack";
import type { AuthUser } from "../services/firebaseAuth";
import { assessmentTrackLabels, type AssessmentTrack } from "../types/onboarding";

interface ProfileSetupLocationState {
  assessmentTrack?: AssessmentTrack;
  authUser?: AuthUser;
  initialGoalType?: "exploring" | "goal";
}

interface ProfileFormData {
  name: string;
  dateOfBirth: string;
  gender: string;
  currentStatus: string;
  assessmentTrack: AssessmentTrack;
}

type ProfileErrors = Partial<Record<keyof ProfileFormData, string>>;

const profileDraftStorageKey = "the-way.profile-draft";

const currentStatusOptions = [
  { value: "high-school-student", label: "High School Student" },
  { value: "university-student", label: "University Student" },
  { value: "self-taught-learner", label: "Self-taught Learner" },
  { value: "career-switcher", label: "Career Switcher" },
  { value: "junior-developer", label: "Junior Developer" },
  { value: "software-professional", label: "Software Professional" },
  { value: "other", label: "Other" }
];

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" }
];

function resolveAssessmentTrack(locationState: ProfileSetupLocationState | null) {
  if (isAssessmentTrack(locationState?.assessmentTrack)) {
    return locationState.assessmentTrack;
  }

  if (locationState?.initialGoalType === "goal") {
    return "goal-focused";
  }

  return readAssessmentTrack() ?? "exploring";
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim();

  if (!source) {
    return "TW";
  }

  return source
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isValidBirthDate(value: string) {
  if (!value) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  const today = new Date();
  const minDate = new Date("1900-01-01T00:00:00");

  return !Number.isNaN(date.getTime()) && date <= today && date >= minDate;
}

function validateProfile(data: ProfileFormData) {
  const errors: ProfileErrors = {};

  if (!data.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!isValidBirthDate(data.dateOfBirth)) {
    errors.dateOfBirth = "Please enter a valid date of birth.";
  }

  if (!data.gender) {
    errors.gender = "Please select a gender option.";
  }

  if (!data.currentStatus) {
    errors.currentStatus = "Please select your current status.";
  }

  return errors;
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
      <span className="is-complete">Account</span>
      <i className="onboarding-progress__line" aria-hidden="true" />
      <span className="is-active">Profile</span>
      <i className="onboarding-progress__line" aria-hidden="true" />
      <span>Assessment</span>
    </div>
  );
}

export default function ProfileSetup() {
  const location = useLocation();
  const locationState = location.state as ProfileSetupLocationState | null;
  const authUserState = useAuthUser();
  const routeAuthUser = locationState?.authUser;
  const currentAuthUser = authUserState.status === "authenticated" ? authUserState.user : null;
  const authUser = routeAuthUser ?? currentAuthUser;
  const assessmentTrack = useMemo(() => resolveAssessmentTrack(locationState), [locationState]);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: authUser?.name ?? "",
    dateOfBirth: "",
    gender: "",
    currentStatus: "",
    assessmentTrack
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isProfileReady, setIsProfileReady] = useState(false);

  const displayName = authUser?.name || formData.name || "The Way learner";
  const displayEmail = authUser?.email || "Signed in with Google";

  function updateField<Field extends keyof ProfileFormData>(field: Field, value: ProfileFormData[Field]) {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
    setIsProfileReady(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProfile(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsProfileReady(false);
      return;
    }

    window.sessionStorage.setItem(
      profileDraftStorageKey,
      JSON.stringify({
        id: authUser?.uid ?? "local-user",
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        occupation: formData.currentStatus,
        track: formData.assessmentTrack,
        updatedAt: new Date().toISOString()
      })
    );
    setIsProfileReady(true);
  }

  useEffect(() => {
    saveAssessmentTrack(assessmentTrack);
    setFormData((current) => ({
      ...current,
      assessmentTrack
    }));
  }, [assessmentTrack]);

  useEffect(() => {
    if (!authUser?.name) {
      return;
    }

    setFormData((current) => ({
      ...current,
      name: current.name || authUser.name
    }));
  }, [authUser?.name]);

  return (
    <main className="tw-page profile-shell">
      <div className="tw-bg" aria-hidden="true">
        <span className="tw-bg__grid" />
        <span className="tw-bg__light tw-bg__light--left" />
        <span className="tw-bg__light tw-bg__light--right" />
      </div>
      <MiniNetwork />

      <header className="profile-header">
        <BrandMark />
        <OnboardingProgress />
      </header>

      <section className="profile-layout page-enter" aria-labelledby="profile-title">
        <div className="profile-intro">
          <p className="tw-eyebrow">Step 1 of 2</p>
          <h1 id="profile-title">Complete your profile</h1>
          <p>One small step before we personalize your career guidance.</p>
        </div>

        <form className="profile-card" onSubmit={handleSubmit} noValidate>
          <div className="profile-person">
            {authUser?.photoURL ? (
              <img src={authUser.photoURL} alt="" className="profile-person__avatar" />
            ) : (
              <div className="profile-person__avatar profile-person__avatar--fallback" aria-hidden="true">
                {getInitials(displayName, displayEmail)}
              </div>
            )}
            <div>
              <strong>{displayName}</strong>
              <span>{displayEmail}</span>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field profile-field--full">
              <label className="form-label" htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="form-input"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "profile-name-error" : undefined}
              />
              {errors.name ? (
                <p className="form-error" id="profile-name-error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="profile-field">
              <label className="form-label" htmlFor="profile-date-of-birth">
                Date of Birth
              </label>
              <input
                id="profile-date-of-birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) => updateField("dateOfBirth", event.target.value)}
                className="form-input"
                autoComplete="bday"
                required
                aria-invalid={Boolean(errors.dateOfBirth)}
                aria-describedby={errors.dateOfBirth ? "profile-date-error" : undefined}
              />
              {errors.dateOfBirth ? (
                <p className="form-error" id="profile-date-error">
                  {errors.dateOfBirth}
                </p>
              ) : null}
            </div>

            <div className="profile-field">
              <label className="form-label" htmlFor="profile-gender">
                Gender
              </label>
              <select
                id="profile-gender"
                value={formData.gender}
                onChange={(event) => updateField("gender", event.target.value)}
                className="form-select"
                autoComplete="sex"
                required
                aria-invalid={Boolean(errors.gender)}
                aria-describedby={errors.gender ? "profile-gender-error" : undefined}
              >
                <option value="">Select</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender ? (
                <p className="form-error" id="profile-gender-error">
                  {errors.gender}
                </p>
              ) : null}
            </div>

            <div className="profile-field profile-field--full">
              <label className="form-label" htmlFor="profile-current-status">
                Current Status
              </label>
              <select
                id="profile-current-status"
                value={formData.currentStatus}
                onChange={(event) => updateField("currentStatus", event.target.value)}
                className="form-select"
                required
                aria-invalid={Boolean(errors.currentStatus)}
                aria-describedby={errors.currentStatus ? "profile-status-error" : undefined}
              >
                <option value="">Choose your current status</option>
                {currentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.currentStatus ? (
                <p className="form-error" id="profile-status-error">
                  {errors.currentStatus}
                </p>
              ) : null}
            </div>
          </div>

          <div className="profile-journey">
            <div>
              <span>Your Journey</span>
              <strong>{assessmentTrackLabels[formData.assessmentTrack]}</strong>
            </div>
            <Link to="/#choose-journey">Change</Link>
          </div>

          <button type="submit" className="tw-button tw-button--primary profile-submit">
            Continue to Assessment
          </button>

          <div className="profile-success-slot" aria-live="polite">
            {isProfileReady ? <p>Your profile is ready. Assessment screens are next.</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
}

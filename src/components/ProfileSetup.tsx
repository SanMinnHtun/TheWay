import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import spaceBg from "../assets/bg.png";
import astronautImg from "../assets/astronaut.png";
import { useAuthUser } from "../hooks/useAuthUser";
import { isAssessmentTrack, readAssessmentTrack, saveAssessmentTrack } from "../services/assessmentTrack";
import type { AuthUser } from "../services/firebaseAuth";
import { assessmentTrackLabels, type AssessmentTrack } from "../types/onboarding";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-[#1c1d30] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30";

const labelClass = "mb-2 block text-sm font-medium text-slate-200";

interface ProfileSetupLocationState {
  assessmentTrack?: AssessmentTrack;
  authUser?: AuthUser;
  initialGoalType?: "exploring" | "goal";
}

interface ProfileFormData {
  name: string;
  birthMonth: string;
  birthDate: string;
  birthYear: string;
  gender: string;
  currentStatus: string;
  assessmentTrack: AssessmentTrack;
}

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
    birthMonth: "",
    birthDate: "",
    birthYear: "",
    gender: "female",
    currentStatus: "",
    assessmentTrack
  });

  const updateField = <Field extends keyof ProfileFormData,>(
    field: Field,
    value: ProfileFormData[Field]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat px-5 py-10 text-white sm:px-8 lg:px-12"
      style={{ backgroundImage: `url(${spaceBg})` }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
        <section className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Ready to Get Started?
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Enter your details on the right to claim your space and start exploring.
            </p>
          </div>

          <img
            src={astronautImg}
            alt="Astronaut"
            className="mt-8 h-auto w-full max-w-[360px] object-contain md:max-w-[430px]"
          />
        </section>

        <section className="w-full rounded-2xl border border-slate-700/50 bg-[#121324]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Create your profile</h2>

            <div className="mt-6 flex items-center gap-4">
              {authUser?.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full border border-purple-300/40 object-cover"
                />
              ) : (
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {getInitials(authUser?.name ?? formData.name, authUser?.email ?? "")}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{authUser?.name || "The Way learner"}</p>
                <p className="text-sm text-slate-400">{authUser?.email || "Signed in with Google"}</p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass} htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <span className={labelClass}>Date Of Birth</span>
              <div className="grid grid-cols-3 gap-3">
                <select
                  aria-label="Birth month"
                  value={formData.birthMonth}
                  onChange={(event) => updateField("birthMonth", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Birth date"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.birthDate}
                  onChange={(event) => updateField("birthDate", event.target.value)}
                  className={inputClass}
                  placeholder="Date"
                />
                <input
                  aria-label="Birth year"
                  type="number"
                  min="1900"
                  value={formData.birthYear}
                  onChange={(event) => updateField("birthYear", event.target.value)}
                  className={inputClass}
                  placeholder="Year"
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Gender</legend>
              <div className="flex flex-wrap gap-5">
                {["Male", "Female"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="radio"
                      name="gender"
                      value={gender.toLowerCase()}
                      checked={formData.gender === gender.toLowerCase()}
                      onChange={(event) => updateField("gender", event.target.value)}
                      className="h-4 w-4 accent-purple-600"
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className={labelClass} htmlFor="profile-current-status">
                Current Status
              </label>
              <select
                id="profile-current-status"
                value={formData.currentStatus}
                onChange={(event) => updateField("currentStatus", event.target.value)}
                className={inputClass}
              >
                <option value="">Choose your current status</option>
                <option value="high-school-student">High School Student</option>
                <option value="university-student">University Student</option>
                <option value="self-taught-learner">Self-taught Learner</option>
                <option value="career-switcher">Career Switcher</option>
                <option value="junior-developer">Junior Developer</option>
                <option value="software-professional">Software Professional</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <span className={labelClass}>Selected Path</span>
              <div className="rounded-lg border border-purple-300/25 bg-purple-500/10 px-4 py-3">
                <p className="text-sm font-medium text-white">{assessmentTrackLabels[formData.assessmentTrack]}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  This came from your landing page choice and will start the right assessment.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#121324]"
            >
              Create Profile &amp; Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

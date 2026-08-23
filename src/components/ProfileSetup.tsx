import { useLocation } from "react-router-dom";
import { useState, type FormEvent } from "react";
import spaceBg from "../assets/bg.png";
import astronautImg from "../assets/astronaut.png";

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

type AssessmentTrack = "exploring" | "goal";

interface ProfileSetupLocationState {
  initialGoalType?: AssessmentTrack;
}

interface ProfileFormData {
  name: string;
  birthMonth: string;
  birthDate: string;
  birthYear: string;
  gender: string;
  occupation: string;
  assessmentTrack: AssessmentTrack;
}

export default function ProfileSetup() {
  const location = useLocation();
  const locationState = location.state as ProfileSetupLocationState | null;
  const assessmentTrack: AssessmentTrack =
    locationState?.initialGoalType === "goal" ? "goal" : "exploring";

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    birthMonth: "",
    birthDate: "",
    birthYear: "",
    gender: "female",
    occupation: "",
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
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                MW
              </div>
              <div>
                <p className="text-sm font-medium text-white">May Win</p>
                <p className="text-sm text-slate-400">maywin00@gmail.com</p>
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
              <label className={labelClass} htmlFor="profile-occupation">
                Occupation
              </label>
              <select
                id="profile-occupation"
                value={formData.occupation}
                onChange={(event) => updateField("occupation", event.target.value)}
                className={inputClass}
              >
                <option value="">+ occupation</option>
                <option value="student">Student</option>
                <option value="designer">Designer</option>
                <option value="developer">Developer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <fieldset>
              <legend className={labelClass}>Assessment Track Choice</legend>
              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#1c1d30]/80 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="radio"
                    name="assessmentTrack"
                    value="exploring"
                    checked={formData.assessmentTrack === "exploring"}
                    onChange={() => updateField("assessmentTrack", "exploring")}
                    className="h-4 w-4 accent-purple-600"
                  />
                  I'm still exploring.
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#1c1d30]/80 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="radio"
                    name="assessmentTrack"
                    value="goal"
                    checked={formData.assessmentTrack === "goal"}
                    onChange={() => updateField("assessmentTrack", "goal")}
                    className="h-4 w-4 accent-purple-600"
                  />
                  I know my goal.
                </label>
              </div>
            </fieldset>

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

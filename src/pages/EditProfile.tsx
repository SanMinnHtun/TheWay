import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import UserAvatar from "../components/app/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { getProfileErrorMessage, updateUserProfile } from "../services/profileService";
import type { ProfileGender } from "../types/profile";

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

const statusOptions = [
  "High School Student",
  "University Student",
  "Self-taught Learner",
  "Career Switcher",
  "Junior Developer",
  "Software Professional",
  "Other"
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.name ?? "");
  const [birthMonth, setBirthMonth] = useState(profile?.dateOfBirth?.month ? String(profile.dateOfBirth.month) : "");
  const [birthDay, setBirthDay] = useState(profile?.dateOfBirth?.day ? String(profile.dateOfBirth.day) : "");
  const [birthYear, setBirthYear] = useState(profile?.dateOfBirth?.year ? String(profile.dateOfBirth.year) : "");
  const [gender, setGender] = useState<ProfileGender>(profile?.gender ?? "female");
  const [currentStatus, setCurrentStatus] = useState(profile?.currentStatus ?? "");
  const [submitState, setSubmitState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }

    setDisplayName(profile.displayName);
    setBirthMonth(profile.dateOfBirth?.month ? String(profile.dateOfBirth.month) : "");
    setBirthDay(profile.dateOfBirth?.day ? String(profile.dateOfBirth.day) : "");
    setBirthYear(profile.dateOfBirth?.year ? String(profile.dateOfBirth.year) : "");
    setGender(profile.gender ?? "female");
    setCurrentStatus(profile.currentStatus ?? "");
  }, [profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !profile) {
      setError(t("profile.errorMissing"));
      return;
    }

    if (!displayName.trim()) {
      setError(t("profile.errorName"));
      return;
    }

    const month = Number(birthMonth);
    const day = Number(birthDay);
    const year = Number(birthYear);

    if (!month || !day || !year) {
      setError(t("profile.errorDob"));
      return;
    }

    setSubmitState("saving");
    setError("");
    setMessage("");

    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        gender,
        dateOfBirth: {
          day,
          month,
          year
        },
        currentStatus
      });
      await refreshProfile();
      setMessage(t("profile.updatedSuccess"));
      window.setTimeout(() => navigate("/app/profile"), 520);
    } catch (saveError) {
      setError(getProfileErrorMessage(saveError));
    } finally {
      setSubmitState("idle");
    }
  }

  const profileUser = {
    name: displayName || profile?.displayName || user?.name || "",
    email: profile?.email || user?.email || "",
    avatar: profile?.photoURL || user?.photoURL || null
  };

  return (
    <section className="app-page-shell profile-page-shell">
      <PageHeader title={t("profile.editTitle")} description={t("profile.editDescription")} />

      <form className="profile-edit-card" onSubmit={handleSubmit}>
        <div className="profile-edit-identity">
          <UserAvatar user={profileUser} />
          <div>
            <h2>{profileUser.name || t("profile.learner")}</h2>
            <p>{profileUser.email}</p>
          </div>
        </div>

        <div className="profile-form-grid">
          <label className="profile-form-field">
            <span>{t("profile.name")}</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </label>

          <div className="profile-form-field">
            <span>{t("profile.dateOfBirth")}</span>
            <div className="profile-date-grid">
              <select aria-label="Birth month" value={birthMonth} onChange={(event) => setBirthMonth(event.target.value)}>
                <option value="">{t("profile.birthMonth")}</option>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                aria-label="Birth day"
                type="number"
                min="1"
                max="31"
                value={birthDay}
                onChange={(event) => setBirthDay(event.target.value)}
                placeholder={t("profile.birthDay")}
              />
              <input
                aria-label="Birth year"
                type="number"
                min="1900"
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
                placeholder={t("profile.birthYear")}
              />
            </div>
          </div>

          <fieldset className="profile-form-field">
            <legend>{t("profile.gender")}</legend>
            <div className="profile-radio-row">
              {(["male", "female", "other"] as ProfileGender[]).map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="profile-gender"
                    value={option}
                    checked={gender === option}
                    onChange={(event) => setGender(event.target.value as ProfileGender)}
                  />
                  <span>
                    {option === "male"
                      ? t("profile.genderMale")
                      : option === "female"
                        ? t("profile.genderFemale")
                        : t("profile.genderOther")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="profile-form-field">
            <span>{t("profile.currentStatus")}</span>
            <select value={currentStatus} onChange={(event) => setCurrentStatus(event.target.value)}>
              <option value="">{t("profile.statusChoose")}</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="profile-form-feedback" aria-live="polite">
          {message ? <p className="profile-form-success">{message}</p> : null}
          {error ? <p className="profile-form-error">{error}</p> : null}
        </div>

        <div className="profile-form-actions">
          <Link to="/app/profile" className="app-secondary-link">
            {t("common.cancel")}
          </Link>
          <button type="submit" disabled={submitState === "saving"} className="app-primary-link">
            {submitState === "saving" ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </section>
  );
}

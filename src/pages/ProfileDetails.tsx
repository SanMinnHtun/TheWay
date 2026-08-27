import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import PageHeader from "../components/app/PageHeader";
import { SkeletonCard } from "../components/app/Skeleton";
import UserAvatar from "../components/app/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { formatDateOfBirth, formatProfileTimestamp } from "../utils/profileFormat";
import type { TranslationKey } from "../i18n/translations";

const statusLabelKeys: Record<string, TranslationKey> = {
  "high-school-student": "profile.statusHighSchool",
  "university-student": "profile.statusUniversity",
  "self-taught-learner": "profile.statusSelfTaught",
  "career-switcher": "profile.statusCareerSwitcher",
  "junior-developer": "profile.statusJuniorDeveloper",
  "software-professional": "profile.statusSoftwareProfessional",
  other: "profile.statusOther"
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="profile-detail-card">
      <div className="profile-detail-card-header">
        <h2>{title}</h2>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

function getCurrentStatusLabel(status: string, t: (key: TranslationKey) => string) {
  const labelKey = statusLabelKeys[status];

  return labelKey ? t(labelKey) : status;
}

export default function ProfileDetails() {
  const { user, profile } = useAuth();
  const { language, t } = useI18n();

  if (!profile || !user) {
    return (
      <section className="app-page-shell">
        <PageHeader title={t("profile.title")} description={t("profile.description")} />
        <SkeletonCard className="min-h-[240px]" />
      </section>
    );
  }

  const profileUser = {
    name: profile.displayName || user.name,
    email: profile.email || user.email,
    avatar: profile.photoURL || user.photoURL || null
  };

  return (
    <section className="app-page-shell profile-page-shell">
      <PageHeader title={t("profile.title")} description={t("profile.description")} />

      <section className="profile-summary-card">
        <UserAvatar user={profileUser} />
        <div>
          <h2>{profileUser.name || "TheWay learner"}</h2>
          <p>{profileUser.email}</p>
          <span>{profile.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore")}</span>
        </div>
        <Link to="/app/profile/edit" className="app-primary-link">
          {t("common.edit")}
        </Link>
      </section>

      <div className="profile-section-grid">
        <InfoSection title={t("profile.personal")}>
          <InfoRow label={t("profile.name")} value={profile.displayName || t("common.notSet")} />
          <InfoRow label={t("profile.dateOfBirth")} value={profile.dateOfBirth ? formatDateOfBirth(profile.dateOfBirth, language) : t("common.notSet")} />
          <InfoRow
            label={t("profile.gender")}
            value={
              profile.gender === "male"
                ? t("profile.genderMale")
                : profile.gender === "female"
                  ? t("profile.genderFemale")
                  : profile.gender === "other"
                    ? t("profile.genderOther")
                    : t("common.notSet")
            }
          />
          <InfoRow
            label={t("profile.currentStatus")}
            value={profile.currentStatus ? getCurrentStatusLabel(profile.currentStatus, t) : t("common.notSet")}
          />
        </InfoSection>

        <InfoSection title={t("profile.preferences")}>
          <InfoRow label={t("profile.careerPath")} value={profile.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore")} />
          <InfoRow label={t("profile.language")} value={profile.language === "my" ? t("settings.myanmar") : t("settings.english")} />
        </InfoSection>

        <InfoSection title={t("profile.account")}>
          <InfoRow label={t("profile.email")} value={profile.email || t("common.notAvailable")} />
          <InfoRow label={t("profile.created")} value={formatProfileTimestamp(profile.createdAt, language)} />
          <InfoRow label={t("profile.updated")} value={formatProfileTimestamp(profile.updatedAt, language)} />
        </InfoSection>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { SkeletonCard } from "../components/app/Skeleton";
import UserAvatar from "../components/app/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { formatDateOfBirth, formatGender, formatMode, formatProfileTimestamp } from "../utils/profileFormat";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function ProfileDetails() {
  const { user, profile } = useAuth();
  const { t } = useI18n();

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
          <span>{formatMode(profile.mode)}</span>
        </div>
        <Link to="/app/profile/edit" className="app-primary-link">
          {t("common.edit")}
        </Link>
      </section>

      <section className="profile-detail-card">
        <div className="profile-detail-card-header">
          <h2>{t("profile.personal")}</h2>
        </div>
        <dl>
          <InfoRow label={t("profile.name")} value={profile.displayName || t("common.notSet")} />
          <InfoRow label={t("profile.dateOfBirth")} value={profile.dateOfBirth ? formatDateOfBirth(profile.dateOfBirth) : t("common.notSet")} />
          <InfoRow label={t("profile.gender")} value={profile.gender ? formatGender(profile.gender) : t("common.notSet")} />
          <InfoRow label={t("profile.currentStatus")} value={profile.currentStatus || t("common.notSet")} />
          <InfoRow label={t("profile.careerPath")} value={profile.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore")} />
          <InfoRow label={t("profile.created")} value={formatProfileTimestamp(profile.createdAt)} />
          <InfoRow label={t("profile.updated")} value={formatProfileTimestamp(profile.updatedAt)} />
        </dl>
      </section>
    </section>
  );
}

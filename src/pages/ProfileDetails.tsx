import { Link } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { SkeletonCard } from "../components/app/Skeleton";
import UserAvatar from "../components/app/UserAvatar";
import { useAuth } from "../context/AuthContext";
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

  if (!profile || !user) {
    return (
      <section className="app-page-shell">
        <PageHeader title="Profile" description="Manage your personal information." />
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
      <PageHeader title="Profile" description="Manage your personal information." />

      <section className="profile-summary-card">
        <UserAvatar user={profileUser} />
        <div>
          <h2>{profileUser.name || "TheWay learner"}</h2>
          <p>{profileUser.email}</p>
          <span>{formatMode(profile.mode)}</span>
        </div>
        <Link to="/app/profile/edit" className="app-primary-link">
          Edit Profile
        </Link>
      </section>

      <section className="profile-detail-card">
        <div className="profile-detail-card-header">
          <h2>Personal Information</h2>
        </div>
        <dl>
          <InfoRow label="Name" value={profile.displayName || "Not set"} />
          <InfoRow label="Date of Birth" value={formatDateOfBirth(profile.dateOfBirth)} />
          <InfoRow label="Gender" value={formatGender(profile.gender)} />
          <InfoRow label="Current Status" value={profile.currentStatus || "Not set"} />
          <InfoRow label="Career Path" value={formatMode(profile.mode)} />
          <InfoRow label="Account created" value={formatProfileTimestamp(profile.createdAt)} />
          <InfoRow label="Updated" value={formatProfileTimestamp(profile.updatedAt)} />
        </dl>
      </section>
    </section>
  );
}

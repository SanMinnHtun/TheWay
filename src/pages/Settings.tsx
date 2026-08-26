import PageHeader from "../components/app/PageHeader";
import { SkeletonBlock, SkeletonCard } from "../components/app/Skeleton";

const settingsTabs = ["Profile", "Preferences", "Account", "Appearance"];

export default function Settings() {
  return (
    <section className="app-page-shell">
      <PageHeader title="Settings" description="Manage your profile, preferences, account, and appearance." />

      <div className="flex flex-wrap gap-3" aria-label="Settings sections skeleton">
        {settingsTabs.map((tab) => (
          <SkeletonBlock key={tab} className="h-10 w-32 rounded-full" />
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SkeletonCard className="min-h-[180px]" />
        <SkeletonCard className="min-h-[180px]" />
        <SkeletonCard className="min-h-[180px]" />
        <SkeletonCard className="min-h-[180px]" />
      </div>
    </section>
  );
}

import PageHeader from "../components/app/PageHeader";
import { SkeletonBlock, SkeletonCard } from "../components/app/Skeleton";

export default function LearningResources() {
  return (
    <section className="app-page-shell">
      <PageHeader title="Learning Resources" description="Curated resources for your roadmap." />

      <div className="app-skeleton-search">
        <SkeletonBlock className="h-12 flex-1" />
        <SkeletonBlock className="h-12 w-36" />
      </div>

      <section className="app-section-block" aria-label="Recommended resources skeleton">
        <h2>Recommended for You</h2>
        <div className="app-card-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      <section className="app-section-block" aria-label="Continue learning skeleton">
        <h2>Continue Learning</h2>
        <div className="app-card-grid app-card-grid--two">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    </section>
  );
}

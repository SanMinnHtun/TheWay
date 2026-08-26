import PageHeader from "../components/app/PageHeader";
import { SkeletonBlock, SkeletonCard } from "../components/app/Skeleton";

export default function MyRoadmap() {
  return (
    <section className="app-page-shell">
      <PageHeader title="My Roadmap" description="Your personalized path, one milestone at a time." />

      <section className="app-section-block" aria-label="Overall progress skeleton">
        <h2>Overall Progress</h2>
        <SkeletonCard>
          <div className="flex items-center justify-between gap-4">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
          <SkeletonBlock className="mt-5 h-3 w-full rounded-full" />
        </SkeletonCard>
      </section>

      <section className="app-section-block" aria-label="Current milestone skeleton">
        <h2>Current Milestone</h2>
        <SkeletonCard className="min-h-[148px]" />
      </section>

      <section className="app-section-block" aria-label="Roadmap timeline skeleton">
        <h2>Roadmap</h2>
        <div className="roadmap-skeleton">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="roadmap-skeleton-step" key={index}>
              <span />
              <SkeletonBlock className="h-14 flex-1" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

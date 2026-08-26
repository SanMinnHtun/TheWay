import PageHeader from "../components/app/PageHeader";
import { SkeletonBlock, SkeletonCard } from "../components/app/Skeleton";

export default function ExploreCareers() {
  return (
    <section className="app-page-shell">
      <PageHeader title="Explore Careers" description="Discover career paths that match your interests and strengths." />

      <div className="app-skeleton-search">
        <SkeletonBlock className="h-12 flex-1" />
      </div>

      <section className="app-section-block" aria-label="Recommended careers skeleton">
        <h2>Recommended Careers</h2>
        <div className="space-y-4">
          <SkeletonCard className="min-h-[126px]" />
          <SkeletonCard className="min-h-[126px]" />
          <SkeletonCard className="min-h-[126px]" />
        </div>
      </section>

      <section className="app-section-block" aria-label="Career category skeleton">
        <h2>Career Categories</h2>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-9 w-32 rounded-full" />
          ))}
        </div>
      </section>
    </section>
  );
}

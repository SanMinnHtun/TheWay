import PageHeader from "../components/app/PageHeader";
import { SkeletonBlock, SkeletonCard } from "../components/app/Skeleton";
import { useI18n } from "../i18n/I18nContext";

export default function LearningResources() {
  const { t } = useI18n();

  return (
    <section className="app-page-shell">
      <PageHeader title={t("resources.title")} description={t("resources.description")} />

      <div className="app-skeleton-search">
        <SkeletonBlock className="h-12 flex-1" />
        <SkeletonBlock className="h-12 w-36" />
      </div>

      <section className="app-section-block" aria-label="Recommended resources skeleton">
        <h2>{t("resources.recommended")}</h2>
        <div className="app-card-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      <section className="app-section-block" aria-label="Continue learning skeleton">
        <h2>{t("resources.continue")}</h2>
        <div className="app-card-grid app-card-grid--two">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    </section>
  );
}

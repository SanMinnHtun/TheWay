import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { learningResources, type LearningResourcePreview } from "../data/appExperience";
import { useI18n } from "../i18n/I18nContext";

const resourceFilters = ["All", "Course", "Documentation", "Video", "Project"] as const;

function ResourceCard({ resource }: { resource: LearningResourcePreview }) {
  const { t } = useI18n();

  return (
    <article className="experience-card resource-card">
      <p className="experience-eyebrow">{resource.type}</p>
      <h3>{resource.title}</h3>
      <p className="experience-summary">
        {resource.difficulty} · {resource.duration}
      </p>
      <dl>
        <div>
          <dt>{t("resources.provider")}</dt>
          <dd>{resource.provider}</dd>
        </div>
        <div>
          <dt>{t("resources.topic")}</dt>
          <dd>{resource.topic}</dd>
        </div>
        <div>
          <dt>{t("resources.recommendedFor")}</dt>
          <dd>{resource.recommendedFor}</dd>
        </div>
      </dl>
      <button type="button" className="text-action-button">
        {t("resources.openResource")}
      </button>
    </article>
  );
}

export default function LearningResources() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<(typeof resourceFilters)[number]>("All");
  const filteredResources = useMemo(
    () =>
      activeFilter === "All"
        ? learningResources
        : learningResources.filter((resource) => resource.type === activeFilter),
    [activeFilter]
  );
  const currentRecommendation = learningResources[0];

  return (
    <section className="app-page-shell">
      <PageHeader title={t("resources.title")} description={t("resources.description")} />

      <section className="experience-hero" aria-labelledby="resource-current">
        <div>
          <p className="experience-eyebrow">{t("resources.currentEyebrow")}</p>
          <h2 id="resource-current">{currentRecommendation.title}</h2>
          <p>{t("resources.currentDescription")}</p>
        </div>
        <Link to="/app/roadmap" className="app-secondary-link">
          {t("resources.viewRoadmap")}
        </Link>
      </section>

      <section className="app-section-block" aria-labelledby="resource-filters">
        <div className="section-heading-row">
          <div>
            <p className="experience-eyebrow">{t("resources.browseEyebrow")}</p>
            <h2 id="resource-filters">{t("resources.recommended")}</h2>
          </div>
        </div>
        <div className="filter-chip-row" aria-label={t("resources.filterLabel")}>
          {resourceFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "filter-chip filter-chip--active" : "filter-chip"}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter === "All" ? t("common.all") : filter}
            </button>
          ))}
        </div>
        <div className="app-card-grid">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="app-section-block" aria-labelledby="continue-learning">
        <h2 id="continue-learning">{t("resources.continue")}</h2>
        <div className="compact-list">
          {learningResources.slice(1, 3).map((resource) => (
            <div key={resource.id} className="compact-list-item">
              <span>{resource.type}</span>
              <p>{resource.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-section-block" aria-labelledby="saved-resources">
        <div className="empty-state-card">
          <h2 id="saved-resources">{t("resources.savedTitle")}</h2>
          <p>{t("resources.savedEmpty")}</p>
          <div className="empty-state-actions">
            <button type="button" className="app-secondary-link" onClick={() => setActiveFilter("All")}>
              {t("resources.browseAll")}
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

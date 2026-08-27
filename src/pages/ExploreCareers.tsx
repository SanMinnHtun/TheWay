import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { careerPreviews, type CareerPreview } from "../data/appExperience";
import { useI18n } from "../i18n/I18nContext";
import type { UserProfile } from "../types/profile";

const categoryFilters = ["All", "Development", "Design", "Data", "Cloud", "Security"] as const;

function matchesCareer(career: CareerPreview, query: string, category: (typeof categoryFilters)[number]) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesCategory = category === "All" || career.category === category;

  if (!matchesCategory) {
    return false;
  }

  if (!normalizedQuery) {
    return true;
  }

  const searchable = [
    career.role,
    career.category,
    career.summary,
    career.fitReason,
    career.firstStep,
    ...career.skills,
    ...career.technologies
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(normalizedQuery);
}

function CareerCard({
  career,
  isSelected,
  onSelect
}: {
  career: CareerPreview;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t } = useI18n();

  return (
    <article className={`experience-card career-card ${isSelected ? "experience-card--selected" : ""}`}>
      <div className="experience-card-header">
        <div>
          <p className="experience-eyebrow">{career.category}</p>
          <h3>{career.role}</h3>
        </div>
        <span className="match-pill">{career.match}%</span>
      </div>
      <p className="experience-summary">{career.summary}</p>
      <p className="experience-reason">{career.fitReason}</p>
      <div className="skill-chip-row" aria-label={t("careers.skillsLabel")}>
        {career.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
      <button type="button" className="text-action-button" onClick={onSelect} aria-expanded={isSelected}>
        {t("careers.viewCareer")}
      </button>
    </article>
  );
}

export default function ExploreCareers() {
  const { t } = useI18n();
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categoryFilters)[number]>("All");
  const [selectedCareerId, setSelectedCareerId] = useState(careerPreviews[0]?.id ?? "");
  const selectedCareer = careerPreviews.find((career) => career.id === selectedCareerId) ?? careerPreviews[0];
  const filteredCareers = useMemo(
    () => careerPreviews.filter((career) => matchesCareer(career, query, activeCategory)),
    [activeCategory, query]
  );
  const recommendedCareers = filteredCareers.slice(0, 3);
  const modeLabel = profile?.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore");

  return (
    <section className="app-page-shell">
      <PageHeader title={t("careers.title")} description={t("careers.description")} />

      <section className="experience-hero" aria-label={t("careers.startingPoint")}>
        <div>
          <p className="experience-eyebrow">{t("careers.startingPoint")}</p>
          <h2>{t("careers.heroTitle")}</h2>
          <p>{t("careers.heroDescription", { mode: modeLabel })}</p>
        </div>
        <Link to="/app/roadmap" className="app-primary-link">
          {t("careers.heroAction")}
        </Link>
      </section>

      <div className="experience-search" role="search">
        <label className="sr-only" htmlFor="career-search">
          {t("careers.searchLabel")}
        </label>
        <input
          id="career-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("careers.searchPlaceholder")}
          autoComplete="off"
        />
      </div>

      <section className="app-section-block" aria-labelledby="recommended-careers">
        <div className="section-heading-row">
          <div>
            <p className="experience-eyebrow">{t("careers.recommendedEyebrow")}</p>
            <h2 id="recommended-careers">{t("careers.recommended")}</h2>
          </div>
          <Link to="/app/assistant" className="app-secondary-link">
            {t("careers.askAssistant")}
          </Link>
        </div>

        {recommendedCareers.length ? (
          <div className="app-card-grid">
            {recommendedCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                isSelected={selectedCareer.id === career.id}
                onSelect={() => setSelectedCareerId(career.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card" role="status">
            <h3>{t("careers.noResultsTitle", { query })}</h3>
            <p>{t("careers.noResultsDescription")}</p>
            <div className="empty-state-actions">
              <button
                type="button"
                className="app-secondary-link"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
              >
                {t("careers.clearSearch")}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="app-section-block" aria-labelledby="career-categories">
        <h2 id="career-categories">{t("careers.categories")}</h2>
        <div className="filter-chip-row" aria-label={t("careers.categories")}>
          {categoryFilters.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "filter-chip filter-chip--active" : "filter-chip"}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category === "All" ? t("common.all") : category}
            </button>
          ))}
        </div>
      </section>

      <section className="app-section-block" aria-labelledby="career-details">
        <div className="career-detail-panel">
          <div>
            <p className="experience-eyebrow">{t("careers.detailEyebrow")}</p>
            <h2 id="career-details">{selectedCareer.role}</h2>
            <p>{selectedCareer.summary}</p>
          </div>
          <div className="detail-grid">
            <div>
              <h3>{t("careers.whatTheyDo")}</h3>
              <p>{selectedCareer.fitReason}</p>
            </div>
            <div>
              <h3>{t("careers.skillsNeeded")}</h3>
              <p>{selectedCareer.skills.join(", ")}</p>
            </div>
            <div>
              <h3>{t("careers.pathDifficulty")}</h3>
              <p>{selectedCareer.difficulty}</p>
            </div>
            <div>
              <h3>{t("careers.learnFirst")}</h3>
              <p>{selectedCareer.firstStep}</p>
            </div>
          </div>
          <div className="panel-actions">
            <Link to="/app/roadmap" className="app-primary-link">
              {t("careers.addToRoadmap")}
            </Link>
            <Link to="/app/resources" className="app-secondary-link">
              {t("careers.findResources")}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}

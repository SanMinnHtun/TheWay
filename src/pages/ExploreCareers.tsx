import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CareerCard from "../components/learning/CareerCard";
import LearningPageSkeleton from "../components/learning/LearningPageSkeleton";
import SectionHeading from "../components/learning/SectionHeading";
import PageHeader from "../components/app/PageHeader";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLearningExperience } from "../context/LearningExperienceContext";
import {
  careerCategories,
  careers,
  getCareerById,
  getCareerRecommendations
} from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize, type CareerCategory } from "../types/learning";
import type { UserProfile } from "../types/profile";

export default function ExploreCareers() {
  const { t, language } = useI18n();
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const learning = useLearningExperience();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CareerCategory>("all");
  const mode = profile?.mode ?? "EXPLORE";
  const recommendations = getCareerRecommendations(mode);
  const selectedCareer = getCareerById(learning.state?.selectedCareerId);
  const targetCareer = selectedCareer ?? recommendations[0];

  const filteredCareers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return careers.filter((career) => {
      if (category !== "all" && career.category !== category) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const searchable = [
        localize(career.name, language),
        localize(career.shortDescription, language),
        localize(career.categoryLabel, language),
        ...career.coreStack,
        ...career.skillGroups.flatMap((group) => group.skills)
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }, [category, language, query]);

  if (learning.loading) {
    return <LearningPageSkeleton cards={6} />;
  }

  return (
    <section className="app-page-shell learning-page-shell">
      <PageHeader title={t("careers.title")} description={t("careers.headerDescription")} />
      <div className="page-context-badge">
        {mode === "GOAL" ? t("careers.trackGoal") : t("careers.trackExplore")}
      </div>

      <div className="learning-search" role="search">
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="career-search">
          {t("careers.searchLabel")}
        </label>
        <Input
          id="career-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("careers.searchPlaceholder")}
          autoComplete="off"
        />
      </div>

      <section className="learning-section" aria-labelledby="career-recommendations">
        <SectionHeading
          id="career-recommendations"
          eyebrow={mode === "GOAL" ? t("careers.currentReadiness") : t("careers.recommendedForYou")}
          title={mode === "GOAL" ? t("careers.targetCareer") : t("careers.recommendedForYou")}
          description={mode === "GOAL" ? undefined : t("careers.basedOnStrengths")}
        />

        {mode === "GOAL" ? (
          <div className="featured-career-wrap">
            <CareerCard career={targetCareer} mode={mode} featured />
          </div>
        ) : (
          <div className="career-recommendation-grid">
            {recommendations.map((career, index) => (
              <CareerCard key={career.id} career={career} mode={mode} featured={index === 0} />
            ))}
          </div>
        )}
      </section>

      <section className="learning-section" aria-labelledby="career-catalogue">
        <SectionHeading
          id="career-catalogue"
          eyebrow={t("careers.categories")}
          title={t("careers.catalogue")}
          description={t("careers.catalogueDescription")}
        />

        <Tabs value={category} onValueChange={(value) => setCategory(value as "all" | CareerCategory)}>
          <div className="scrolling-tabs-wrap">
            <TabsList aria-label={t("careers.categories")} className="career-category-tabs">
              {careerCategories.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {localize(item.label, language)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {filteredCareers.length ? (
          <div className="career-catalogue-grid">
            {filteredCareers.map((career) => (
              <CareerCard key={career.id} career={career} mode={mode} />
            ))}
          </div>
        ) : (
          <div className="empty-state-card" role="status">
            <h3>{t("careers.noResultsTitle", { query })}</h3>
            <p>{t("careers.noResultsDescription")}</p>
            <button
              type="button"
              className="app-secondary-link"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              {t("careers.clearSearch")}
            </button>
          </div>
        )}
      </section>
    </section>
  );
}

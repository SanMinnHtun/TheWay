import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import CareerCard from "../components/learning/CareerCard";
import LearningPageSkeleton from "../components/learning/LearningPageSkeleton";
import ResourceCard from "../components/learning/ResourceCard";
import SectionHeading from "../components/learning/SectionHeading";
import PageHeader from "../components/app/PageHeader";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { useLearningExperience } from "../context/LearningExperienceContext";
import {
  careerCategories,
  careers,
  getCareerById,
  getCareerRecommendations
} from "../data/learningCatalog";
import { getCareerForModel1Role, getResourcesForModel1Role } from "../data/model1Recommendations";
import { getLatestModel1Assessment } from "../services/assessmentResultService";
import { getModel1RoleMatches } from "../services/model1Result";
import { useI18n } from "../i18n/I18nContext";
import { localize, type CareerCategory } from "../types/learning";
import type { UserProfile } from "../types/profile";

export default function ExploreCareers() {
  const { t, language } = useI18n();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const learning = useLearningExperience();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CareerCategory>("all");
  const routeState = location.state as { model1Result?: unknown } | null;
  const hasRouteResult = Boolean(routeState && Object.prototype.hasOwnProperty.call(routeState, "model1Result"));
  const [model1Result, setModel1Result] = useState<unknown>(routeState?.model1Result ?? null);
  const [model1ResultLoading, setModel1ResultLoading] = useState(true);
  const mode = profile?.mode ?? "EXPLORE";
  const recommendations = getCareerRecommendations(mode);
  const selectedCareer = getCareerById(learning.state?.selectedCareerId);
  const targetCareer = selectedCareer ?? recommendations[0];
  const isSearching = query.trim().length > 0;
  const { primary: primaryModel1Match, matches: model1Matches } = useMemo(
    () => getModel1RoleMatches(model1Result),
    [model1Result]
  );
  const primaryModel1Resources = useMemo(
    () => primaryModel1Match ? getResourcesForModel1Role(primaryModel1Match.role, 3) : [],
    [primaryModel1Match]
  );

  useEffect(() => {
    if (hasRouteResult) {
      setModel1Result(routeState?.model1Result ?? null);
      setModel1ResultLoading(false);
      return;
    }

    if (auth.userState === "loading") {
      setModel1ResultLoading(true);
      return;
    }

    if (!auth.user) {
      setModel1Result(null);
      setModel1ResultLoading(false);
      return;
    }

    let cancelled = false;
    setModel1ResultLoading(true);
    void getLatestModel1Assessment(auth.user.uid)
      .then((assessment) => {
        if (!cancelled) setModel1Result(assessment?.result ?? null);
      })
      .catch((error) => {
        console.error("Could not load the latest Model 1 assessment", error);
        if (!cancelled) setModel1Result(null);
      })
      .finally(() => {
        if (!cancelled) setModel1ResultLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auth.user, auth.userState, hasRouteResult, routeState?.model1Result]);

  const filteredCareers = useMemo(() => {
    const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return careers.filter((career) => {
      if (category !== "all" && career.category !== category) {
        return false;
      }

      if (searchTerms.length === 0) {
        return true;
      }

      const searchable = [
        localize(career.name, language),
        localize(career.shortDescription, language),
        localize(career.categoryLabel, language),
        ...career.coreStack,
        ...career.skillGroups.flatMap((group) => group.skills)
      ]
        .map((value) => value.toLowerCase());

      return searchTerms.every((term) => searchable.some((value) => value.includes(term)));
    });
  }, [category, language, query]);

  if (learning.loading) {
    return <LearningPageSkeleton cards={6} />;
  }

  return (
    <section className="app-page-shell learning-page-shell">
      <PageHeader title={t("careers.title")} description={t("careers.headerDescription")} />
      <section className="career-track-grid" aria-label={t("careers.trackOptions")}>
        <article className="career-track-card">
          <h2>{t("careers.exploreCardTitle")}</h2>
          <p>{t("careers.exploreCardDescription")}</p>
          <ul>
            <li><span aria-hidden="true">✓</span>{t("careers.exploreBenefitCareers")}</li>
            <li><span aria-hidden="true">✓</span>{t("careers.exploreBenefitWork")}</li>
            <li><span aria-hidden="true">✓</span>{t("careers.exploreBenefitSkills")}</li>
          </ul>
          <button
            type="button"
            className="career-track-action"
            onClick={() => navigate("/app/assessment/explore")}
          >
            {t("careers.exploreCardAction")} <span aria-hidden="true">→</span>
          </button>
        </article>

        <article className="career-track-card">
          <h2>{t("careers.goalCardTitle")}</h2>
          <p>{t("careers.goalCardDescription")}</p>
          <ul>
            <li><span aria-hidden="true">✓</span>{t("careers.goalBenefitPlan")}</li>
            <li><span aria-hidden="true">✓</span>{t("careers.goalBenefitGuidance")}</li>
            <li><span aria-hidden="true">✓</span>{t("careers.goalBenefitSkills")}</li>
          </ul>
          <button type="button" className="career-track-action" onClick={() => navigate("/app/assessment/goal")}>
            {t("careers.goalCardAction")} <span aria-hidden="true">→</span>
          </button>
        </article>
      </section>

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

      {isSearching ? (
        <section className="learning-section" aria-labelledby="career-search-results">
          <SectionHeading
            id="career-search-results"
            eyebrow={t("careers.categories")}
            title={t("careers.catalogue")}
            description={t("careers.catalogueDescription")}
          />

          {filteredCareers.length ? (
            <div className="career-catalogue-grid" aria-live="polite">
              {filteredCareers.map((career) => (
                <CareerCard key={career.id} career={career} mode={mode} showScore={false} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card" role="status">
              <h3>{t("careers.noResultsTitle", { query: query.trim() })}</h3>
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
      ) : (
        <>
          {mode === "GOAL" ? (
            <section className="learning-section" aria-labelledby="career-recommendations">
              <SectionHeading
                id="career-recommendations"
                eyebrow={t("careers.currentReadiness")}
                title={t("careers.targetCareer")}
              />
              <div className="featured-career-wrap">
                <CareerCard career={targetCareer} mode={mode} featured showScore={false} />
              </div>
            </section>
          ) : model1ResultLoading ? (
            <LearningPageSkeleton cards={3} />
          ) : model1Matches.length ? (
            <>
              <section className="learning-section" aria-labelledby="career-recommendations">
                <SectionHeading
                  id="career-recommendations"
                  eyebrow="Model 1"
                  title={t("careers.model1Matches")}
                  description={t("careers.model1MatchesDescription")}
                />
                <div className="career-recommendation-grid">
                  {model1Matches.slice(0, 3).map((match, index) => {
                    const career = getCareerForModel1Role(match.role);
                    return career ? (
                      <CareerCard
                        key={match.role}
                        career={career}
                        mode="EXPLORE"
                        featured={index === 0}
                        matchPercentage={match.percentage}
                        roleLabel={match.role}
                      />
                    ) : (
                      <Card key={match.role} className="learning-card career-catalog-card">
                        <CardHeader className="relative gap-4">
                          <div className="learning-card-topline">
                            <Badge variant="outline">{t("careers.catalogue")}</Badge>
                            <strong className="career-score">{Math.round(match.percentage)}%</strong>
                          </div>
                          <CardTitle>{match.role}</CardTitle>
                          <CardDescription>{t("careers.noMappedCareer")}</CardDescription>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {primaryModel1Match ? (
                <section className="learning-section" aria-labelledby="model1-resources">
                  <SectionHeading
                    id="model1-resources"
                    title={t("careers.model1Resources")}
                    description={t("careers.model1ResourcesDescription", { role: primaryModel1Match?.role ?? "" })}
                  />
                  {primaryModel1Resources.length ? (
                    <div className="learning-card-grid">
                      {primaryModel1Resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  ) : <p className="empty-state-card">{t("careers.noModel1Resources")}</p>}
                </section>
              ) : null}
            </>
          ) : (
            <section className="empty-state-card" aria-labelledby="career-recommendations">
              <h2 id="career-recommendations">
                {model1Result ? t("careers.noModel1Matches") : t("careers.model1Matches")}
              </h2>
              {!model1Result ? <p>{t("careers.model1MatchesDescription")}</p> : null}
              <Button type="button" className="mt-5" onClick={() => navigate("/app/assessment/explore")}>
                {t("careers.takeModel1")}
              </Button>
            </section>
          )}

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

            <div className="career-catalogue-grid">
              {filteredCareers.map((career) => (
                <CareerCard key={career.id} career={career} mode={mode} showScore={false} />
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

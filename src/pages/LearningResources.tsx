import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import InlineToast from "../components/learning/InlineToast";
import LearningPageSkeleton from "../components/learning/LearningPageSkeleton";
import ProjectCard from "../components/learning/ProjectCard";
import ResourceCard from "../components/learning/ResourceCard";
import SectionHeading from "../components/learning/SectionHeading";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLearningExperience } from "../context/LearningExperienceContext";
import {
  careers,
  getCareerById,
  getGuideBySlug,
  getInterviewQuestionBySlug,
  getResourceById,
  getRoadmapById,
  getSkillById,
  guides,
  interviewQuestions,
  learningResources,
  projects
} from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize, type LearningLevel, type LearningResource, type ResourceType } from "../types/learning";

const typeOptions: Array<"all" | ResourceType> = ["all", "course", "docs", "guide", "project", "interview"];
const levelOptions: Array<"all" | LearningLevel> = ["all", "beginner", "intermediate", "advanced"];

function GuideCard({ guideSlug }: { guideSlug: string }) {
  const { language, t } = useI18n();
  const guide = getGuideBySlug(guideSlug);
  if (!guide) return null;

  return (
    <Card className="learning-card guide-card">
      <CardHeader>
        <Badge variant="outline" className="w-fit">{localize(guide.categoryLabel, language)}</Badge>
        <CardTitle>{localize(guide.title, language)}</CardTitle>
        <CardDescription>{localize(guide.summary, language)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="resource-meta-line">{localize(guide.readTime, language)}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to={`/app/resources/guides/${guide.slug}`}>{t("resources.readGuide")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function InterviewQuestionCard({ questionSlug }: { questionSlug: string }) {
  const { language, t } = useI18n();
  const question = getInterviewQuestionBySlug(questionSlug);
  if (!question) return null;

  return (
    <Card className="learning-card interview-question-card">
      <CardHeader>
        <Badge variant="outline" className="w-fit">{localize(question.categoryLabel, language)}</Badge>
        <CardTitle>{localize(question.question, language)}</CardTitle>
        <CardDescription>{localize(question.summary, language)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="learning-card-label">{t("interview.whatEvaluated")}</p>
        <div className="learning-stack-row">
          {question.evaluates.map((item) => (
            <span key={item.en}>{localize(item, language)}</span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to={`/app/resources/interview/${question.slug}`}>{t("resources.practiceQuestion")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResourceFilters({
  type,
  role,
  level,
  onChange
}: {
  type: string;
  role: string;
  level: string;
  onChange: (key: "type" | "role" | "level", value: string) => void;
}) {
  const { language, t } = useI18n();

  return (
    <div className="resource-filter-controls">
      <label>
        <span>{t("resources.typeFilter")}</span>
        <Select value={type} onValueChange={(value) => onChange("type", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "all" ? t("resources.allTypes") : t(`resources.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label>
        <span>{t("resources.roleFilter")}</span>
        <Select value={role} onValueChange={(value) => onChange("role", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("resources.allRoles")}</SelectItem>
            {careers.map((career) => (
              <SelectItem key={career.id} value={career.id}>{localize(career.name, language)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label>
        <span>{t("resources.levelFilter")}</span>
        <Select value={level} onValueChange={(value) => onChange("level", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {levelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "all" ? t("resources.allLevels") : t(`resources.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}

export default function LearningResources() {
  const { language, t } = useI18n();
  const learning = useLearningExperience();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const query = searchParams.get("q") ?? "";
  const skillFilter = searchParams.get("skill") ?? "";
  const typeFilter = searchParams.get("type") ?? "all";
  const roleFilter = searchParams.get("role") ?? "all";
  const levelFilter = searchParams.get("level") ?? "all";
  const roadmap = getRoadmapById(learning.state?.roadmapId);
  const career = getCareerById(learning.state?.selectedCareerId);
  const currentStage = roadmap?.stages.find((stage) => stage.id === learning.state?.currentStageId) ?? roadmap?.stages[0];
  const currentSkill = getSkillById(skillFilter)?.skill ?? currentStage?.skills.find((skill) => !learning.state?.completedSkillIds.includes(skill.id)) ?? currentStage?.skills[0];
  const recommendedResource = currentSkill?.resourceIds.map(getResourceById).find(Boolean) ?? learningResources[4];

  const expandedCatalog = useMemo<LearningResource[]>(() => {
    const projectResources: LearningResource[] = projects.map((project) => ({
      id: `project-${project.id}`,
      slug: project.slug,
      title: project.name,
      description: project.description,
      type: "project",
      roles: project.roleIds,
      skills: project.skillIds,
      level: project.level,
      provider: "TheWay",
      duration: project.duration,
      internalPath: `/app/resources/projects/${project.slug}`
    }));
    const guideResources: LearningResource[] = guides.map((guide) => ({
      id: `guide-${guide.id}`,
      slug: guide.slug,
      title: guide.title,
      description: guide.summary,
      type: "guide",
      roles: guide.careerIds,
      skills: guide.skillIds,
      level: "beginner",
      provider: "TheWay",
      duration: guide.readTime,
      internalPath: `/app/resources/guides/${guide.slug}`
    }));
    const interviewResources: LearningResource[] = interviewQuestions.map((question) => ({
      id: `interview-${question.id}`,
      slug: question.slug,
      title: question.question,
      description: question.summary,
      type: "interview",
      roles: question.roleIds,
      skills: question.skillIds,
      level: "intermediate",
      provider: "TheWay",
      duration: { en: "15 min practice", my: "၁၅ မိနစ်လေ့ကျင့်ရန်" },
      internalPath: `/app/resources/interview/${question.slug}`
    }));

    return [...learningResources, ...projectResources, ...guideResources, ...interviewResources];
  }, []);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return expandedCatalog.filter((resource) => {
      const matchesSkill = !skillFilter || resource.skills.includes(skillFilter);
      const matchesType = typeFilter === "all" || resource.type === typeFilter;
      const matchesRole =
        roleFilter === "all" ||
        resource.roles.includes(roleFilter) ||
        resource.roles.some((role) => role.startsWith(`${roleFilter}-`));
      const matchesLevel = levelFilter === "all" || resource.level === levelFilter;
      const searchable = [
        localize(resource.title, language),
        localize(resource.description, language),
        resource.provider,
        ...resource.skills,
        ...resource.roles
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesSkill && matchesType && matchesRole && matchesLevel && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [expandedCatalog, language, levelFilter, query, roleFilter, skillFilter, typeFilter]);

  const relatedProjects = currentSkill
    ? projects.filter((project) => project.skillIds.includes(currentSkill.id))
    : projects;

  function updateParam(key: "q" | "skill" | "type" | "role" | "level", value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: key === "q" });
  }

  function clearFilters() {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("type");
      next.delete("role");
      next.delete("level");
      next.delete("skill");
      return next;
    });
  }

  function handleFeedback(message: string, tone: "success" | "error" = "success") {
    setToast({ message, tone });
  }

  if (learning.loading) {
    return <LearningPageSkeleton cards={6} />;
  }

  return (
    <section className="app-page-shell learning-page-shell resources-page">
      <PageHeader title={t("resources.title")} description={t("resources.headerDescription")} />

      <div className="learning-search" role="search">
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="resource-search">{t("common.search")}</label>
        <Input
          id="resource-search"
          value={query}
          onChange={(event) => updateParam("q", event.target.value)}
          placeholder={t("resources.searchPlaceholder")}
        />
      </div>

      {recommendedResource ? (
        <section className="learning-section" aria-labelledby="recommended-resource-title">
          <SectionHeading
            id="recommended-resource-title"
            eyebrow={t("resources.recommended")}
            title={localize(recommendedResource.title, language)}
            description={currentSkill ? t("resources.recommendedReason", { skill: localize(currentSkill.name, language) }) : undefined}
          />
          <div className="featured-resource-wrap">
            <ResourceCard resource={recommendedResource} featured onFeedback={handleFeedback} />
          </div>
        </section>
      ) : null}

      {currentStage ? (
        <section className="learning-section" aria-labelledby="current-stage-resources">
          <SectionHeading
            id="current-stage-resources"
            eyebrow={career ? localize(career.name, language) : undefined}
            title={t("resources.currentRoadmapStage")}
            description={`${localize(currentStage.title, language)} · ${t("resources.currentStageDescription")}`}
            action={<Button asChild variant="outline"><Link to="/app/roadmap">{t("resources.viewRoadmap")}</Link></Button>}
          />
          <div className="learning-card-grid">
            {currentStage.skills
              .flatMap((skill) => skill.resourceIds)
              .filter((id, index, ids) => ids.indexOf(id) === index)
              .map(getResourceById)
              .filter(Boolean)
              .slice(0, 3)
              .map((resource) => <ResourceCard key={resource!.id} resource={resource!} onFeedback={handleFeedback} />)}
          </div>
        </section>
      ) : null}

      <section className="learning-section" aria-labelledby="continue-learning-title">
        <SectionHeading id="continue-learning-title" title={t("resources.continue")} />
        <div className="continue-learning-list">
          {learningResources.slice(0, 3).map((resource, index) => (
            <Link key={resource.id} to={resource.internalPath ?? resource.url ?? "/app/resources"} target={resource.url ? "_blank" : undefined} rel={resource.url ? "noreferrer" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{localize(resource.title, language)}</strong>
                <p>{resource.provider} · {resource.duration ? localize(resource.duration, language) : ""}</p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="learning-section" aria-labelledby="project-library-title">
        <SectionHeading
          id="project-library-title"
          title={t("resources.projects")}
          description={t("resources.projectsDescription")}
        />
        <div className="learning-card-grid">
          {(relatedProjects.length ? relatedProjects : projects).slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="learning-section" aria-labelledby="guides-title">
        <SectionHeading id="guides-title" title={t("resources.guides")} description={t("resources.guidesDescription")} />
        <div className="learning-card-grid">
          {guides.slice(0, 3).map((guide) => <GuideCard key={guide.id} guideSlug={guide.slug} />)}
        </div>
      </section>

      <section className="learning-section" aria-labelledby="interview-prep-title">
        <SectionHeading
          id="interview-prep-title"
          title={t("resources.interviewPrep")}
          description={t("resources.interviewDescription")}
        />
        <Tabs defaultValue="behavioral">
          <div className="scrolling-tabs-wrap">
            <TabsList>
              <TabsTrigger value="behavioral">{t("interview.behavioral")}</TabsTrigger>
              <TabsTrigger value="technical">{t("interview.technical")}</TabsTrigger>
              <TabsTrigger value="system-design">{t("interview.systemDesign")}</TabsTrigger>
              <TabsTrigger value="role-specific">{t("interview.roleSpecific")}</TabsTrigger>
            </TabsList>
          </div>
          {(["behavioral", "technical", "system-design", "role-specific"] as const).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="learning-card-grid">
                {interviewQuestions.filter((question) => question.category === category).map((question) => (
                  <InterviewQuestionCard key={question.id} questionSlug={question.slug} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="learning-section" aria-labelledby="browse-all-resources">
        <SectionHeading
          id="browse-all-resources"
          title={t("resources.browseAllTitle")}
          description={t("resources.browseAllDescription")}
        />

        <div className="resource-filter-desktop">
          <ResourceFilters type={typeFilter} role={roleFilter} level={levelFilter} onChange={updateParam} />
          <Button type="button" variant="ghost" onClick={clearFilters}>{t("resources.clearFilters")}</Button>
        </div>

        <div className="resource-filter-mobile">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline"><span aria-hidden="true">☷</span>{t("common.filters")}</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="resource-filter-sheet">
              <SheetHeader>
                <SheetTitle>{t("common.filters")}</SheetTitle>
                <SheetDescription>{t("resources.browseAllDescription")}</SheetDescription>
              </SheetHeader>
              <ResourceFilters type={typeFilter} role={roleFilter} level={levelFilter} onChange={updateParam} />
              <div className="resource-filter-sheet-actions">
                <Button type="button" variant="ghost" onClick={clearFilters}>{t("resources.clearFilters")}</Button>
                <SheetClose asChild>
                  <Button>{t("resources.showResults", { count: String(filteredResources.length) })}</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {filteredResources.length ? (
          <>
            <p className="resource-results-count" role="status">{t("common.results", { count: String(filteredResources.length) })}</p>
            <div className="learning-card-grid resource-browse-grid">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onFeedback={handleFeedback} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state-card" role="status">
            <h3>{t("resources.noResultsTitle")}</h3>
            <p>{t("resources.noResultsDescription")}</p>
            <Button type="button" variant="outline" className="mt-5" onClick={clearFilters}>{t("resources.clearFilters")}</Button>
          </div>
        )}
      </section>

      {toast ? <InlineToast message={toast.message} tone={toast.tone} onDismiss={dismissToast} /> : null}
    </section>
  );
}

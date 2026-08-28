import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import InlineToast from "../components/learning/InlineToast";
import ProjectCard from "../components/learning/ProjectCard";
import SectionHeading from "../components/learning/SectionHeading";
import { Badge } from "../components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../components/ui/breadcrumb";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLearningExperience } from "../context/LearningExperienceContext";
import {
  getCareerBySlug,
  getCareerCounts,
  getRelatedProjects,
  getRoadmapById,
  getSkillById
} from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize } from "../types/learning";
import type { UserProfile } from "../types/profile";

export default function CareerDetail() {
  const { careerSlug } = useParams();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const learning = useLearningExperience();
  const career = getCareerBySlug(careerSlug);
  const roadmap = getRoadmapById(career?.roadmapId);
  const [isStarting, setIsStarting] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const isSelected = learning.state?.roadmapId === roadmap?.id;

  const projects = useMemo(
    () => getRelatedProjects(roadmap?.stages.flatMap((stage) => stage.skills.map((skill) => skill.id)) ?? [], career?.id),
    [career?.id, roadmap]
  );

  if (!career || !roadmap) {
    return (
      <section className="app-page-shell learning-page-shell">
        <div className="empty-state-card">
          <h1>{t("careers.notFound")}</h1>
          <Button asChild className="mt-5">
            <Link to="/app/explore">{t("careers.backToExplore")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  const counts = getCareerCounts(career);
  const mode = profile?.mode ?? "EXPLORE";

  async function handleRoadmapAction() {
    if (isSelected) {
      navigate("/app/roadmap");
      return;
    }

    setIsStarting(true);
    try {
      await learning.startRoadmap(career!.id, roadmap!.id, roadmap!.stages[0]?.id ?? "");
      setToast({ message: t("careers.roadmapStarted"), tone: "success" });
      navigate("/app/roadmap");
    } catch {
      setToast({ message: t("careers.roadmapError"), tone: "error" });
    } finally {
      setIsStarting(false);
    }
  }

  const assistantPrompt = t("assistant.prefillCareer", { career: localize(career.name, language) });

  return (
    <section className="app-page-shell learning-page-shell career-detail-page">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/app/explore">{t("careers.backToExplore")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{localize(career.name, language)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="career-detail-hero">
        <div>
          <div className="career-detail-eyebrow-row">
            <Badge variant="outline">{localize(career.categoryLabel, language)}</Badge>
            <span>{career.matchByMode[mode]}% {mode === "GOAL" ? t("careers.currentReadiness") : t("careers.match")}</span>
          </div>
          <h1>{localize(career.name, language)}</h1>
          <p>{localize(career.description, language)}</p>
          <div className="learning-stack-row career-detail-stack">
            {career.coreStack.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <div className="career-detail-counts">
            <strong>{counts.stages}</strong> {t("careers.stageCountLabel")}
            <span aria-hidden="true">·</span>
            <strong>{counts.skills}</strong> {t("careers.skillCountLabel")}
          </div>
        </div>
        <div className="career-detail-actions">
          <Button type="button" size="lg" onClick={() => void handleRoadmapAction()} disabled={isStarting}>
            {isStarting ? t("careers.starting") : isSelected ? t("careers.openRoadmap") : t("careers.startRoadmap")}
          </Button>
          <Button asChild variant="outline">
            <Link to={`/app/assistant?prompt=${encodeURIComponent(assistantPrompt)}`}>{t("careers.askAboutCareer")}</Link>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="career-detail-tabs">
        <div className="scrolling-tabs-wrap">
          <TabsList>
            <TabsTrigger value="overview">{t("careers.overviewTab")}</TabsTrigger>
            <TabsTrigger value="skills">{t("careers.skillsTab")}</TabsTrigger>
            <TabsTrigger value="roadmap">{t("careers.roadmapTab")}</TabsTrigger>
            <TabsTrigger value="projects">{t("careers.projectsTab")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="career-overview-grid">
            <Card>
              <CardContent className="pt-6">
                <h2>{t("careers.whatYouWillDo")}</h2>
                <ul className="learning-check-list">
                  {career.responsibilities.map((responsibility) => (
                    <li key={responsibility.en}>{localize(responsibility, language)}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h2>{t("careers.whyThisFits")}</h2>
                <ul className="learning-check-list">
                  {career.fitReasons.map((reason) => (
                    <li key={reason.en}>{localize(reason, language)}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="career-skill-groups">
            {career.skillGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="pt-6">
                  <p className="experience-eyebrow">{localize(group.label, language)}</p>
                  <div className="career-skill-list">
                    {group.skills.map((skillId) => {
                      const skill = getSkillById(skillId)?.skill;
                      return skill ? <span key={skill.id}>{localize(skill.name, language)}</span> : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardContent className="pt-6">
              <SectionHeading title={t("careers.roadmapPreview")} description={localize(roadmap.description, language)} />
              <ol className="roadmap-preview-list">
                {roadmap.stages.map((stage) => (
                  <li key={stage.id}>
                    <span>{String(stage.order).padStart(2, "0")}</span>
                    <p>{localize(stage.title, language)}</p>
                  </li>
                ))}
              </ol>
              <Separator className="my-5" />
              <Button type="button" onClick={() => void handleRoadmapAction()} disabled={isStarting}>
                {isSelected ? t("careers.viewFullRoadmap") : t("careers.startRoadmap")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <SectionHeading title={t("careers.recommendedProjects")} />
          <div className="learning-card-grid">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {toast ? <InlineToast message={toast.message} tone={toast.tone} onDismiss={dismissToast} /> : null}
    </section>
  );
}

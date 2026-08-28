import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { BorderBeam } from "../components/magic/BorderBeam";
import { NumberTicker } from "../components/magic/NumberTicker";
import InlineToast from "../components/learning/InlineToast";
import LearningPageSkeleton from "../components/learning/LearningPageSkeleton";
import SectionHeading from "../components/learning/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { useLearningExperience } from "../context/LearningExperienceContext";
import {
  getCareerById,
  getResourceById,
  getRoadmapById,
  projects
} from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize, type RoadmapSkill, type RoadmapStage, type SkillPriority } from "../types/learning";

function priorityTranslationKey(priority: SkillPriority) {
  return `roadmap.${priority}` as const;
}

function RoadmapSkillDetail({
  skill,
  careerName,
  completed,
  pending,
  onToggle
}: {
  skill: RoadmapSkill;
  careerName: string;
  completed: boolean;
  pending: boolean;
  onToggle: (skillId: string) => void;
}) {
  const { language, t } = useI18n();
  const resources = skill.resourceIds.map(getResourceById).filter(Boolean);
  const project = projects.find((item) => skill.projectIds?.includes(item.id));
  const skillName = localize(skill.name, language);
  const explainPrompt = t("assistant.prefillSkill", { skill: skillName, career: careerName });
  const whyPrompt = t("assistant.prefillWhy", { skill: skillName, career: careerName });

  return (
    <article id={skill.id} className={`roadmap-skill-detail ${completed ? "roadmap-skill-detail--completed" : ""}`}>
      <div className="roadmap-skill-heading">
        <div>
          <Badge variant={skill.priority === "essential" ? "default" : "outline"}>
            {t(priorityTranslationKey(skill.priority))}
          </Badge>
          <h4>{skillName}</h4>
        </div>
        <div className="skill-completion-control">
          <Checkbox
            id={`complete-${skill.id}`}
            checked={completed}
            onCheckedChange={() => onToggle(skill.id)}
            disabled={pending}
            aria-label={`${completed ? t("roadmap.completed") : t("roadmap.markComplete")}: ${skillName}`}
          />
          <label htmlFor={`complete-${skill.id}`}>
            {pending ? t("roadmap.updating") : completed ? t("roadmap.completed") : t("roadmap.markComplete")}
          </label>
        </div>
      </div>

      <div className="skill-explanation-grid">
        <section>
          <h5>{t("roadmap.descriptionLabel")}</h5>
          <p>{localize(skill.description, language)}</p>
        </section>
        <section>
          <h5>{t("roadmap.whyItMattersTitle")}</h5>
          <p>{localize(skill.whyItMatters, language)}</p>
          <Button asChild variant="link" size="sm">
            <Link to={`/app/assistant?prompt=${encodeURIComponent(whyPrompt)}`}>{t("roadmap.askWhy")}</Link>
          </Button>
        </section>
      </div>

      <section className="skill-objectives">
        <h5>{t("roadmap.whatToLearnTitle")}</h5>
        <ul>
          {skill.learningObjectives.map((objective) => (
            <li key={objective.en}>{localize(objective, language)}</li>
          ))}
        </ul>
      </section>

      {resources.length ? (
        <section className="skill-resource-list">
          <h5>{t("roadmap.recommendedResources")}</h5>
          {resources.slice(0, 3).map((resource) => (
            <div key={resource!.id}>
              <Badge variant="secondary">{t(`resources.${resource!.type}`)}</Badge>
              <p>{localize(resource!.title, language)}</p>
              {resource!.internalPath ? (
                <Link to={resource!.internalPath}>{t("common.open")}</Link>
              ) : (
                <a href={resource!.url} target="_blank" rel="noreferrer">
                  {t("common.open")} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          ))}
          <Button asChild variant="link">
            <Link to={`/app/resources?skill=${encodeURIComponent(skill.id)}`}>{t("roadmap.viewAllResources")}</Link>
          </Button>
        </section>
      ) : null}

      {project ? (
        <section className="skill-practice-project">
          <div>
            <p className="learning-card-label">{t("roadmap.practiceProject")}</p>
            <h5>{localize(project.name, language)}</h5>
            <p>{localize(project.description, language)}</p>
          </div>
          <Button asChild variant="outline">
            <Link to={`/app/resources/projects/${project.slug}`}>{t("resources.openProject")}</Link>
          </Button>
        </section>
      ) : null}

      <Button asChild variant="ghost" className="skill-assistant-link">
        <Link to={`/app/assistant?prompt=${encodeURIComponent(explainPrompt)}`}>{t("roadmap.askExplainSkill")}</Link>
      </Button>
    </article>
  );
}

function getStageState(stage: RoadmapStage, currentStageId: string | null, completedSkillIds: string[]) {
  const complete = stage.skills.every((skill) => completedSkillIds.includes(skill.id));
  if (complete) return "completed" as const;
  if (stage.id === currentStageId) return "current" as const;
  return "upcoming" as const;
}

export default function MyRoadmap() {
  const { language, t } = useI18n();
  const learning = useLearningExperience();
  const [pendingSkillId, setPendingSkillId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const roadmap = getRoadmapById(learning.state?.roadmapId);
  const career = getCareerById(learning.state?.selectedCareerId);
  const completedSkillIds = learning.state?.completedSkillIds ?? [];
  const currentStage = roadmap?.stages.find((stage) => stage.id === learning.state?.currentStageId) ?? roadmap?.stages[0];
  const allSkills = roadmap?.stages.flatMap((stage) => stage.skills) ?? [];
  const progress = allSkills.length ? Math.round((completedSkillIds.length / allSkills.length) * 100) : 0;
  const currentStageCompleted = currentStage?.skills.filter((skill) => completedSkillIds.includes(skill.id)).length ?? 0;
  const currentSkill =
    currentStage?.skills.find((skill) => !completedSkillIds.includes(skill.id)) ??
    currentStage?.skills[currentStage.skills.length - 1];

  const upcomingSkills = useMemo(() => {
    if (!roadmap || !currentSkill) return [];
    const currentIndex = allSkills.findIndex((skill) => skill.id === currentSkill.id);
    return allSkills.slice(currentIndex + 1, currentIndex + 4);
  }, [allSkills, currentSkill, roadmap]);

  useEffect(() => {
    const skillId = window.location.hash.slice(1);
    if (!skillId) return;
    window.requestAnimationFrame(() => document.getElementById(skillId)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [roadmap?.id]);

  if (learning.loading) {
    return <LearningPageSkeleton cards={4} />;
  }

  if (!roadmap || !career || !learning.state?.roadmapId) {
    return (
      <section className="app-page-shell learning-page-shell">
        <PageHeader title={t("roadmap.title")} description={t("roadmap.description")} />
        <Card className="roadmap-empty-state">
          <CardContent className="pt-6">
            <div className="empty-state-icon" aria-hidden="true">◇</div>
            <h2>{t("roadmap.noRoadmapTitle")}</h2>
            <p>{t("roadmap.noRoadmapDescription")}</p>
            <Button asChild className="mt-5">
              <Link to="/app/explore">{t("roadmap.exploreCareers")}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const careerName = localize(career.name, language);

  async function handleToggleSkill(skillId: string) {
    setPendingSkillId(skillId);
    try {
      const completed = await learning.toggleSkill(skillId);
      setToast({
        message: completed ? t("roadmap.skillCompletedToast") : t("roadmap.skillReopenedToast"),
        tone: "success"
      });
    } catch {
      setToast({ message: t("roadmap.updateError"), tone: "error" });
    } finally {
      setPendingSkillId(null);
    }
  }

  const currentResourceLink = currentSkill ? `/app/resources?skill=${encodeURIComponent(currentSkill.id)}` : "/app/resources";

  return (
    <section className="app-page-shell learning-page-shell roadmap-page">
      <PageHeader title={t("roadmap.title")} description={t("roadmap.description")} />

      {learning.error ? (
        <div className="learning-error-banner" role="alert">
          <p>{t("errors.learningLoad")}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void learning.refresh()}>
            {t("common.tryAgain")}
          </Button>
        </div>
      ) : null}

      <header className="roadmap-header-card">
        <div>
          <p className="experience-eyebrow">{t("roadmap.pathEyebrow")}</p>
          <h1>{careerName}</h1>
          <p>{localize(roadmap.description, language)}</p>
        </div>
        <div className="roadmap-progress-summary">
          <div aria-label={`${progress}% ${t("roadmap.overallProgress")}`}>
            <NumberTicker value={progress} /><span>%</span>
          </div>
          <p>{t("roadmap.skillsComplete", { completed: String(completedSkillIds.length), total: String(allSkills.length) })}</p>
          <Progress value={progress} aria-label={t("roadmap.overallProgress")} />
        </div>
      </header>

      {currentStage ? (
        <section className="learning-section" aria-labelledby="current-focus-title">
          <Card className="current-focus-card">
            <BorderBeam duration={14} />
            <CardContent className="relative pt-6">
              <div className="current-focus-layout">
                <div>
                  <p className="experience-eyebrow">{t("roadmap.currentFocus")}</p>
                  <h2 id="current-focus-title">{localize(currentStage.title, language)}</h2>
                  <p className="current-focus-progress">
                    {t("roadmap.skillsInStage", { completed: String(currentStageCompleted), total: String(currentStage.skills.length) })}
                  </p>
                  <p>{localize(currentStage.description, language)}</p>
                </div>
                <Button asChild size="lg">
                  <Link to={currentResourceLink}>{t("roadmap.continueLearning")}</Link>
                </Button>
              </div>
              <Progress
                value={currentStage.skills.length ? (currentStageCompleted / currentStage.skills.length) * 100 : 0}
                aria-label={t("roadmap.skillsInStage", { completed: String(currentStageCompleted), total: String(currentStage.skills.length) })}
                className="mt-6"
              />
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="learning-section" aria-labelledby="up-next-title">
        <SectionHeading id="up-next-title" title={t("roadmap.upNext")} />
        <div className="roadmap-up-next">
          {upcomingSkills.map((skill, index) => (
            <div key={skill.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{localize(skill.name, language)}</p>
              <Badge variant="outline">{t(priorityTranslationKey(skill.priority))}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="learning-section" aria-labelledby="full-path-title">
        <SectionHeading id="full-path-title" eyebrow={t("roadmap.timeline")} title={t("roadmap.fullPath")} />
        <Accordion type="multiple" defaultValue={currentStage ? [currentStage.id] : []} className="roadmap-stage-list">
          {roadmap.stages.map((stage) => {
            const state = getStageState(stage, learning.state?.currentStageId ?? null, completedSkillIds);
            const completedCount = stage.skills.filter((skill) => completedSkillIds.includes(skill.id)).length;

            return (
              <AccordionItem key={stage.id} value={stage.id} className={`roadmap-stage roadmap-stage--${state}`}>
                <AccordionTrigger className="roadmap-stage-trigger">
                  <span className="roadmap-stage-marker" aria-hidden="true">
                    {state === "completed" ? "✓" : state === "current" ? "●" : "○"}
                  </span>
                  <span className="roadmap-stage-title-block">
                    <span className="experience-eyebrow">{t("roadmap.stageNumber", { number: String(stage.order).padStart(2, "0") })}</span>
                    <strong>{localize(stage.title, language)}</strong>
                    <span>{localize(stage.description, language)}</span>
                  </span>
                  <span className="roadmap-stage-status">
                    <Badge variant={state === "completed" ? "success" : state === "current" ? "default" : "outline"}>
                      {t(`roadmap.status${state === "completed" ? "Completed" : state === "current" ? "Current" : "Upcoming"}`)}
                    </Badge>
                    <span>{completedCount}/{stage.skills.length}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="roadmap-stage-content">
                  <div className="stage-why-block">
                    <h3>{t("roadmap.whyItMattersTitle")}</h3>
                    <p>{localize(stage.whyItMatters, language)}</p>
                  </div>
                  <Separator className="my-5" />
                  <div className="roadmap-skill-list">
                    {stage.skills.map((skill) => (
                      <RoadmapSkillDetail
                        key={skill.id}
                        skill={skill}
                        careerName={careerName}
                        completed={completedSkillIds.includes(skill.id)}
                        pending={pendingSkillId === skill.id}
                        onToggle={(skillId) => void handleToggleSkill(skillId)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {toast ? <InlineToast message={toast.message} tone={toast.tone} onDismiss={dismissToast} /> : null}
    </section>
  );
}

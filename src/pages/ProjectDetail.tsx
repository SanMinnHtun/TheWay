import { Link, useParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
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
import { getCareerById, getProjectBySlug, getSkillById } from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize } from "../types/learning";

export default function ProjectDetail() {
  const { projectSlug } = useParams();
  const { language, t } = useI18n();
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    return (
      <section className="app-page-shell learning-page-shell">
        <div className="empty-state-card">
          <h1>{t("projects.notFound")}</h1>
          <Button asChild className="mt-5"><Link to="/app/resources">{t("projects.backToResources")}</Link></Button>
        </div>
      </section>
    );
  }

  const skills = project.skillIds.map((skillId) => getSkillById(skillId)?.skill).filter(Boolean);
  const careers = project.roleIds.map(getCareerById).filter(Boolean);
  const assistantPrompt = t("assistant.prefillProject", { project: localize(project.name, language) });

  return (
    <article className="app-page-shell learning-page-shell detail-article-page">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/app/resources">{t("projects.backToResources")}</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{localize(project.name, language)}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="detail-article-hero">
        <div className="detail-article-badges">
          <Badge variant="outline">{localize(project.domainLabel, language)}</Badge>
          <Badge>{t(`resources.${project.level}`)}</Badge>
          <span>{localize(project.duration, language)}</span>
        </div>
        <h1>{localize(project.name, language)}</h1>
        <p>{localize(project.description, language)}</p>
        <Button asChild variant="outline">
          <Link to={`/app/assistant?prompt=${encodeURIComponent(assistantPrompt)}`}>{t("projects.askHowToStart")}</Link>
        </Button>
      </header>

      <section className="detail-article-section" aria-labelledby="skills-proved-title">
        <h2 id="skills-proved-title">{t("projects.skillsProved")}</h2>
        <div className="learning-stack-row">
          {skills.map((skill) => <span key={skill!.id}>{localize(skill!.name, language)}</span>)}
        </div>
      </section>

      <div className="detail-two-column">
        <Card>
          <CardContent className="pt-6">
            <h2>{t("projects.whatYouBuild")}</h2>
            <ul className="learning-check-list">
              {project.whatYouBuild.map((item) => <li key={item.en}>{localize(item, language)}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2>{t("projects.whatYouLearn")}</h2>
            <ul className="learning-check-list">
              {project.learningOutcomes.map((item) => <li key={item.en}>{localize(item, language)}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="detail-article-section" aria-labelledby="architecture-title">
        <h2 id="architecture-title">{t("projects.architecture")}</h2>
        <div className="project-architecture" aria-label={project.architecture.map((step) => localize(step, language)).join(", ")}>
          {project.architecture.map((step, index) => (
            <div key={step.en}>
              <span>{localize(step, language)}</span>
              {index < project.architecture.length - 1 ? <i aria-hidden="true">↓</i> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="detail-article-section" aria-labelledby="build-steps-title">
        <h2 id="build-steps-title">{t("projects.buildSteps")}</h2>
        <Accordion type="multiple" defaultValue={[project.buildSteps[0]?.id ?? ""]} className="project-step-list">
          {project.buildSteps.map((step, index) => (
            <AccordionItem key={step.id} value={step.id}>
              <AccordionTrigger>
                <span className="project-step-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{localize(step.title, language)}</strong>
              </AccordionTrigger>
              <AccordionContent><p>{localize(step.description, language)}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="detail-article-section" aria-labelledby="take-further-title">
        <h2 id="take-further-title">{t("projects.takeFurther")}</h2>
        <div className="extension-grid">
          {project.extensions.map((extension) => <div key={extension.en}><span aria-hidden="true">+</span>{localize(extension, language)}</div>)}
        </div>
      </section>

      <section className="detail-article-section" aria-labelledby="related-skills-title">
        <h2 id="related-skills-title">{t("projects.relatedSkills")}</h2>
        <div className="related-link-list">
          {skills.map((skill) => (
            <Link key={skill!.id} to={`/app/roadmap#${skill!.id}`}>
              <span>{localize(skill!.name, language)}</span><span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <p className="related-career-line">
          {careers.map((career) => localize(career!.name, language)).join(" · ")}
        </p>
      </section>
    </article>
  );
}

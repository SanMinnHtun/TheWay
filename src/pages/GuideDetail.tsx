import { Link, useParams } from "react-router-dom";
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
import { getCareerById, getGuideBySlug, getResourceById, getSkillById } from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize } from "../types/learning";

export default function GuideDetail() {
  const { guideSlug } = useParams();
  const { language, t } = useI18n();
  const guide = getGuideBySlug(guideSlug);

  if (!guide) {
    return (
      <section className="app-page-shell learning-page-shell">
        <div className="empty-state-card">
          <h1>{t("guides.notFound")}</h1>
          <Button asChild className="mt-5"><Link to="/app/resources">{t("guides.backToResources")}</Link></Button>
        </div>
      </section>
    );
  }

  const careers = guide.careerIds.map(getCareerById).filter(Boolean);
  const skills = guide.skillIds.map((skillId) => getSkillById(skillId)?.skill).filter(Boolean);
  const resources = guide.resourceIds.map(getResourceById).filter(Boolean);

  return (
    <article className="app-page-shell learning-page-shell detail-article-page guide-detail-page">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/app/resources">{t("guides.backToResources")}</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{localize(guide.title, language)}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="detail-article-hero guide-article-hero">
        <div className="detail-article-badges">
          <Badge variant="outline">{localize(guide.categoryLabel, language)}</Badge>
          <span>{localize(guide.readTime, language)}</span>
        </div>
        <h1>{localize(guide.title, language)}</h1>
        <p>{localize(guide.summary, language)}</p>
      </header>

      <div className="guide-layout">
        <aside className="guide-toc" aria-labelledby="guide-toc-title">
          <h2 id="guide-toc-title">{t("guides.tableOfContents")}</h2>
          <nav>
            {guide.sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{localize(section.heading, language)}</a>
            ))}
          </nav>
        </aside>

        <div className="guide-content">
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{localize(section.heading, language)}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph.en}>{localize(paragraph, language)}</p>)}
            </section>
          ))}

          <Card className="guide-checklist">
            <CardContent className="pt-6">
              <h2>{t("guides.checklist")}</h2>
              <ul className="learning-check-list">
                {guide.checklist.map((item) => <li key={item.en}>{localize(item, language)}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="detail-two-column">
        <Card>
          <CardContent className="pt-6">
            <h2>{t("guides.relatedRoadmap")}</h2>
            <div className="related-link-list">
              {skills.map((skill) => <Link key={skill!.id} to={`/app/roadmap#${skill!.id}`}>{localize(skill!.name, language)}<span aria-hidden="true">→</span></Link>)}
            </div>
            <p className="related-career-line">{careers.map((career) => localize(career!.name, language)).join(" · ")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2>{t("guides.relatedResources")}</h2>
            <div className="related-link-list">
              {resources.map((resource) => resource!.internalPath ? (
                <Link key={resource!.id} to={resource!.internalPath}>{localize(resource!.title, language)}<span aria-hidden="true">→</span></Link>
              ) : (
                <a key={resource!.id} href={resource!.url} target="_blank" rel="noreferrer">{localize(resource!.title, language)}<span aria-hidden="true">↗</span></a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}

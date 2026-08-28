import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useI18n } from "../../i18n/I18nContext";
import { getSkillById } from "../../data/learningCatalog";
import { localize, type PortfolioProject } from "../../types/learning";

export default function ProjectCard({ project, compact = false }: { project: PortfolioProject; compact?: boolean }) {
  const { language, t } = useI18n();
  const skillNames = project.skillIds
    .map((skillId) => getSkillById(skillId)?.skill)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Card className={`learning-card project-card ${compact ? "project-card--compact" : ""}`}>
      <CardHeader>
        <div className="learning-card-topline">
          <Badge variant="outline">{localize(project.domainLabel, language)}</Badge>
          <Badge variant="secondary">{t(`resources.${project.level}`)}</Badge>
        </div>
        <CardTitle>{localize(project.name, language)}</CardTitle>
        <CardDescription>{localize(project.description, language)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="resource-meta-line">{localize(project.duration, language)}</p>
        <div>
          <p className="learning-card-label">{t("projects.skillsProved")}</p>
          <div className="learning-stack-row">
            {skillNames.map((skill) => (
              <span key={skill!.id}>{localize(skill!.name, language)}</span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to={`/app/resources/projects/${project.slug}`}>
            {t("resources.openProject")} <span aria-hidden="true">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

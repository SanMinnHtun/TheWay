import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useLearningExperience } from "../../context/LearningExperienceContext";
import { getCareerById, getSkillById } from "../../data/learningCatalog";
import { useI18n } from "../../i18n/I18nContext";
import { localize, type LearningResource } from "../../types/learning";

export default function ResourceCard({
  resource,
  featured = false,
  onFeedback
}: {
  resource: LearningResource;
  featured?: boolean;
  onFeedback?: (message: string, tone?: "success" | "error") => void;
}) {
  const { language, t } = useI18n();
  const learning = useLearningExperience();
  const [isSaving, setIsSaving] = useState(false);
  const saved = learning.state?.savedResourceIds.includes(resource.id) ?? false;
  const career = getCareerById(resource.roles[0]);
  const relatedSkill = getSkillById(resource.skills[0])?.skill;

  async function handleSave() {
    setIsSaving(true);
    try {
      const nextSaved = await learning.toggleSavedResource(resource.id);
      onFeedback?.(nextSaved ? t("resources.saved") : t("resources.save"));
    } catch {
      onFeedback?.(t("resources.saveError"), "error");
    } finally {
      setIsSaving(false);
    }
  }

  const action = resource.internalPath ? (
    <Button asChild>
      <Link to={resource.internalPath}>{t("resources.openResource")}</Link>
    </Button>
  ) : (
    <Button asChild>
      <a href={resource.url} target="_blank" rel="noreferrer">
        {t("resources.openResource")} <span aria-hidden="true">↗</span>
      </a>
    </Button>
  );

  return (
    <Card className={`learning-card resource-catalog-card ${featured ? "resource-catalog-card--featured" : ""}`}>
      <CardHeader>
        <div className="learning-card-topline">
          <Badge>{t(`resources.${resource.type}`)}</Badge>
          <Badge variant="secondary">{t(`resources.${resource.level}`)}</Badge>
        </div>
        <CardTitle>{localize(resource.title, language)}</CardTitle>
        <CardDescription>{localize(resource.description, language)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="resource-meta-line">
          {[resource.provider, resource.duration ? localize(resource.duration, language) : null].filter(Boolean).join(" · ")}
        </p>
        {career || relatedSkill ? (
          <div className="resource-relationship">
            <p className="learning-card-label">{t("resources.relatedPath")}</p>
            <p>
              {career ? localize(career.name, language) : null}
              {career && relatedSkill ? " → " : null}
              {relatedSkill ? localize(relatedSkill.name, language) : null}
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="resource-card-actions">
        {action}
        <Button
          type="button"
          variant="ghost"
          onClick={() => void handleSave()}
          disabled={isSaving}
          aria-pressed={saved}
        >
          <span aria-hidden="true">{saved ? "★" : "☆"}</span>
          {isSaving ? t("resources.saving") : saved ? t("resources.saved") : t("resources.save")}
        </Button>
      </CardFooter>
    </Card>
  );
}

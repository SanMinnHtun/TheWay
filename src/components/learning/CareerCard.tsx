import { Link } from "react-router-dom";
import { BorderBeam } from "../magic/BorderBeam";
import { NumberTicker } from "../magic/NumberTicker";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { getCareerCounts } from "../../data/learningCatalog";
import { useI18n } from "../../i18n/I18nContext";
import { localize, type Career } from "../../types/learning";
import type { UserMode } from "../../types/profile";

export default function CareerCard({
  career,
  mode,
  featured = false
}: {
  career: Career;
  mode: UserMode;
  featured?: boolean;
}) {
  const { language, t } = useI18n();
  const counts = getCareerCounts(career);
  const score = career.matchByMode[mode];

  return (
    <Card className={`learning-card career-catalog-card ${featured ? "career-catalog-card--featured" : ""}`}>
      {featured ? <BorderBeam duration={12} /> : null}
      <CardHeader className="relative gap-4">
        <div className="learning-card-topline">
          <Badge variant="outline">{localize(career.categoryLabel, language)}</Badge>
          <div className="career-score" aria-label={`${score}% ${mode === "GOAL" ? t("careers.currentReadiness") : t("careers.match")}`}>
            {featured ? <NumberTicker value={score} /> : score}%
          </div>
        </div>
        <div>
          {featured ? <p className="experience-eyebrow">{t("careers.featuredLabel")}</p> : null}
          <CardTitle>{localize(career.name, language)}</CardTitle>
          <CardDescription className="mt-2">{localize(career.shortDescription, language)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative grid gap-4">
        <div className="learning-stack-row" aria-label={t("careers.skillsLabel")}>
          {career.coreStack.slice(0, 4).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        <div className="career-count-row">
          <span>{t("careers.stageSkillCount", { stages: String(counts.stages), skills: String(counts.skills) })}</span>
          <span>{t("careers.resourceCount", { count: String(counts.resources) })}</span>
        </div>
      </CardContent>
      <CardFooter className="relative">
        <Button asChild variant={featured ? "default" : "outline"} className="career-card-action">
          <Link to={`/app/explore/${career.slug}`}>
            {t("careers.viewCareer")} <span aria-hidden="true" className="button-arrow">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

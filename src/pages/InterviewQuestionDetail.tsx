import { useState } from "react";
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
import { getInterviewQuestionBySlug } from "../data/learningCatalog";
import { useI18n } from "../i18n/I18nContext";
import { localize } from "../types/learning";

export default function InterviewQuestionDetail() {
  const { questionSlug } = useParams();
  const { language, t } = useI18n();
  const [answer, setAnswer] = useState("");
  const question = getInterviewQuestionBySlug(questionSlug);

  if (!question) {
    return (
      <section className="app-page-shell learning-page-shell">
        <div className="empty-state-card">
          <h1>{t("interview.notFound")}</h1>
          <Button asChild className="mt-5"><Link to="/app/resources">{t("interview.backToResources")}</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <article className="app-page-shell learning-page-shell detail-article-page interview-detail-page">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/app/resources#interview-prep-title">{t("interview.backToResources")}</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{localize(question.categoryLabel, language)}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="detail-article-hero">
        <Badge variant="outline" className="w-fit">{localize(question.categoryLabel, language)}</Badge>
        <h1>{localize(question.question, language)}</h1>
        <p>{localize(question.summary, language)}</p>
      </header>

      <div className="detail-two-column">
        <Card>
          <CardContent className="pt-6">
            <h2>{t("interview.whatEvaluated")}</h2>
            <div className="interview-evaluation-grid">
              {question.evaluates.map((item) => <span key={item.en}>{localize(item, language)}</span>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2>{t("interview.howToApproach")}</h2>
            <ol className="interview-approach-list">
              {question.approach.map((item, index) => <li key={item.en}><span>{index + 1}</span>{localize(item, language)}</li>)}
            </ol>
          </CardContent>
        </Card>
      </div>

      {question.starFramework ? (
        <section className="detail-article-section" aria-labelledby="star-title">
          <h2 id="star-title">{t("interview.starFramework")}</h2>
          <div className="star-framework-grid">
            {([
              ["situation", t("interview.situation")],
              ["task", t("interview.task")],
              ["action", t("interview.action")],
              ["result", t("interview.result")]
            ] as const).map(([key, label]) => (
              <Card key={key}>
                <CardContent className="pt-6"><span>{label.slice(0, 1)}</span><h3>{label}</h3><p>{localize(question.starFramework![key], language)}</p></CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="detail-article-section" aria-labelledby="mistakes-title">
        <h2 id="mistakes-title">{t("interview.commonMistakes")}</h2>
        <ul className="common-mistake-list">
          {question.commonMistakes.map((mistake) => <li key={mistake.en}>{localize(mistake, language)}</li>)}
        </ul>
      </section>

      <section className="detail-article-section practice-answer-section" aria-labelledby="practice-answer-title">
        <h2 id="practice-answer-title">{t("interview.practiceAnswer")}</h2>
        <label className="sr-only" htmlFor="practice-answer">{t("interview.practiceAnswer")}</label>
        <textarea
          id="practice-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={t("interview.practicePlaceholder")}
          rows={10}
        />
      </section>
    </article>
  );
}

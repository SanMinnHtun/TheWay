import { Link, useOutletContext } from "react-router-dom";
import PageHeader from "../components/app/PageHeader";
import { roadmapMilestones, type RoadmapMilestone } from "../data/appExperience";
import { useI18n } from "../i18n/I18nContext";
import type { UserProfile } from "../types/profile";

const milestoneStateLabels: Record<RoadmapMilestone["state"], string> = {
  completed: "✓ Completed",
  current: "● Current",
  available: "○ Available",
  locked: "Locked"
};

function MilestoneCard({ milestone }: { milestone: RoadmapMilestone }) {
  const { t } = useI18n();

  return (
    <article className={`milestone-card milestone-card--${milestone.state}`}>
      <div className="milestone-card-header">
        <span>{milestoneStateLabels[milestone.state]}</span>
        <h3>{milestone.title}</h3>
      </div>
      <p>{milestone.summary}</p>
      <details>
        <summary>{t("roadmap.milestoneDetails")}</summary>
        <dl>
          <div>
            <dt>{t("roadmap.whyItMatters")}</dt>
            <dd>{milestone.why}</dd>
          </div>
          <div>
            <dt>{t("roadmap.whatToLearn")}</dt>
            <dd>{milestone.learn}</dd>
          </div>
          <div>
            <dt>{t("roadmap.completion")}</dt>
            <dd>{milestone.completion}</dd>
          </div>
        </dl>
      </details>
    </article>
  );
}

export default function MyRoadmap() {
  const { t } = useI18n();
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const currentMilestone = roadmapMilestones.find((milestone) => milestone.state === "current") ?? roadmapMilestones[0];
  const upcomingMilestones = roadmapMilestones.filter((milestone) => milestone.state === "available" || milestone.state === "locked");
  const completedCount = roadmapMilestones.filter((milestone) => milestone.state === "completed").length;
  const progress = Math.round((completedCount / roadmapMilestones.length) * 100);
  const targetTitle = profile?.mode === "GOAL" ? t("roadmap.goalTitle") : t("roadmap.exploreTitle");

  return (
    <section className="app-page-shell">
      <PageHeader title={t("roadmap.title")} description={t("roadmap.description")} />

      <section className="experience-hero roadmap-summary" aria-labelledby="roadmap-target-title">
        <div>
          <p className="experience-eyebrow">{t("roadmap.pathEyebrow")}</p>
          <h2 id="roadmap-target-title">{targetTitle}</h2>
          <p>{t("roadmap.pathDescription")}</p>
        </div>
        <div className="progress-summary" aria-label={t("roadmap.progress")}>
          <span>{progress}%</span>
          <p>{t("roadmap.milestoneCount", { completed: String(completedCount), total: String(roadmapMilestones.length) })}</p>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="app-section-block" aria-labelledby="current-focus">
        <div className="section-heading-row">
          <div>
            <p className="experience-eyebrow">{t("roadmap.currentEyebrow")}</p>
            <h2 id="current-focus">{t("roadmap.current")}</h2>
          </div>
          <Link to="/app/resources" className="app-primary-link">
            {t("roadmap.continueLearning")}
          </Link>
        </div>
        <MilestoneCard milestone={currentMilestone} />
      </section>

      <section className="app-section-block" aria-labelledby="up-next">
        <h2 id="up-next">{t("roadmap.upNext")}</h2>
        <div className="compact-list">
          {upcomingMilestones.slice(0, 3).map((milestone) => (
            <div key={milestone.id} className="compact-list-item">
              <span>{milestoneStateLabels[milestone.state]}</span>
              <p>{milestone.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-section-block" aria-labelledby="full-roadmap">
        <h2 id="full-roadmap">{t("roadmap.timeline")}</h2>
        <div className="roadmap-timeline">
          {roadmapMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </section>
    </section>
  );
}

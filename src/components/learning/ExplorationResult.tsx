import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getCareerById, getResourceById, getRoadmapById, learningResources } from "../../data/learningCatalog";
import { getCareerIdForQuizRole } from "../../data/explorationQuiz";
import { localize, type LearningResource } from "../../types/learning";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "../ui/sheet";

type Language = "en" | "my";
type DataRecord = Record<string, unknown>;

interface RoleMatch {
  role: string;
  percentage: number;
}

const labels = {
  en: {
    eyebrow: "Your Model 1 result",
    title: "Your top career matches",
    viewAll: "View all",
    allMatches: "All career matches",
    allMatchesDescription: "Your ranked career paths and their match percentages.",
    recommendedSources: "Recommended learning sources",
    sourcesFor: "Recommended for {role}",
    openSource: "Open resource",
    buildRoadmap: "Build my roadmap",
    buildRoadmapDescription: "Use the Model 2 diagnostic to turn your direction into an editable learning roadmap.",
    noSources: "No learning sources are available for this match yet.",
    fitScores: "Career fit scores",
    reasoning: "Why this may fit",
    roadmap: "Roadmap details",
    resources: "Suggested resources",
    additional: "Assessment details",
    noResult: "The assessment was submitted, but the server did not return a result to display."
  },
  my: {
    eyebrow: "Model 1 ရလဒ်",
    title: "သင့်အတွက် ကိုက်ညီမှုအများဆုံး အလုပ်အကိုင်များ",
    viewAll: "အားလုံးကြည့်ရန်",
    allMatches: "အလုပ်အကိုင်ကိုက်ညီမှုအားလုံး",
    allMatchesDescription: "အဆင့်လိုက် အလုပ်အကိုင်လမ်းကြောင်းများနှင့် ကိုက်ညီမှုရာခိုင်နှုန်း။",
    recommendedSources: "အကြံပြုသင်ယူမှုရင်းမြစ်များ",
    sourcesFor: "{role} အတွက် အကြံပြုထားသည်",
    openSource: "ရင်းမြစ်ဖွင့်ရန်",
    buildRoadmap: "ကျွန်ုပ်၏လမ်းပြမြေပုံတည်ဆောက်ရန်",
    buildRoadmapDescription: "သင့်အလုပ်အကိုင်ဦးတည်ချက်ကို ပြင်ဆင်နိုင်သော သင်ယူမှုလမ်းပြမြေပုံအဖြစ် ပြောင်းလဲရန် Model 2 အကဲဖြတ်မှုကို အသုံးပြုပါ။",
    noSources: "ဤအလုပ်အကိုင်အတွက် သင်ယူမှုရင်းမြစ်များ မရရှိနိုင်သေးပါ။",
    fitScores: "အလုပ်အကိုင်ကိုက်ညီမှုရမှတ်များ",
    reasoning: "သင်နှင့်ကိုက်ညီနိုင်သည့်အကြောင်းရင်း",
    roadmap: "လမ်းပြမြေပုံအသေးစိတ်",
    resources: "အကြံပြုအရင်းအမြစ်များ",
    additional: "အကဲဖြတ်မှုအသေးစိတ်",
    noResult: "အကဲဖြတ်မှုကို ပေးပို့ပြီးပါပြီ၊ သို့သော် server မှ ပြသရန်ရလဒ် မပြန်ပေးခဲ့ပါ။"
  }
} satisfies Record<Language, Record<string, string>>;

const roleColors = ["#a184ed", "#ff7a1a", "#b36ded", "#f3c944", "#78a8ff"];

const keyAliases = {
  recommendation: ["recommendedPath", "recommended_path", "primary_field", "recommendation", "recommended_career", "top_recommendation", "topRecommendation"],
  fitScores: ["fitScores", "fit_scores", "fieldScores", "field_scores", "scores", "career_scores"],
  reasoning: ["reasoning", "explanation", "why_this_fits", "fit_reason"],
  roadmap: ["roadmapSeed", "roadmap_seed", "roadmap", "roadmap_phases", "roadmapStages", "roadmap_stages"],
  resources: ["resourceTags", "resource_tags", "resources", "recommended_resources"]
};

function isRecord(value: unknown): value is DataRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function unwrapResult(value: unknown): unknown {
  if (!isRecord(value)) return value;

  for (const envelopeKey of ["result", "results", "assessment", "assessment_result", "data"]) {
    const matchingKey = Object.keys(value).find((key) => normalizeKey(key) === normalizeKey(envelopeKey));
    const nestedValue = matchingKey ? value[matchingKey] : undefined;
    if (matchingKey && (isRecord(nestedValue) || Array.isArray(nestedValue))) {
      return unwrapResult(nestedValue);
    }
  }

  return value;
}

function findField(record: DataRecord, aliases: string[]) {
  const normalizedAliases = aliases.map(normalizeKey);
  const key = Object.keys(record).find((candidate) => normalizedAliases.includes(normalizeKey(candidate)));
  return key ? record[key] : undefined;
}

function labelForKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DynamicValue({ value, depth = 0 }: { value: unknown; depth?: number }): ReactNode {
  if (value === null || value === undefined || value === "") return <span>—</span>;
  if (typeof value === "string" || typeof value === "number") return <span>{String(value)}</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;

  if (Array.isArray(value)) {
    return (
      <ul className={`result-value-list ${depth > 0 ? "result-value-list--nested" : ""}`}>
        {value.map((item, index) => (
          <li key={`${index}-${typeof item === "string" ? item : "item"}`}>
            <DynamicValue value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }

  if (isRecord(value)) {
    return (
      <dl className="result-value-fields">
        {Object.entries(value).map(([key, nested]) => (
          <div key={key}>
            <dt>{labelForKey(key)}</dt>
            <dd><DynamicValue value={nested} depth={depth + 1} /></dd>
          </div>
        ))}
      </dl>
    );
  }

  return <span>{String(value)}</span>;
}

function readRoleMatch(value: unknown): RoleMatch | null {
  if (!isRecord(value)) return null;
  const role = findField(value, ["role", "career", "name", "path"]);
  const percentage = findField(value, ["percentage", "score", "match", "fit"]);
  const parsedPercentage = typeof percentage === "number" ? percentage : Number(percentage);

  if (typeof role !== "string" || !Number.isFinite(parsedPercentage)) return null;
  return { role, percentage: Math.max(0, Math.min(100, parsedPercentage)) };
}

function findRoleMatches(data: DataRecord): { primary: RoleMatch | null; matches: RoleMatch[] } {
  const primary = readRoleMatch(findField(data, ["primary_recommendation", "primaryRecommendation", "top_match"]));
  const runnerUp = readRoleMatch(findField(data, ["runner_up", "runnerUp", "second_recommendation"]));
  const all = findField(data, ["all_role_percentages", "allRolePercentages", "role_percentages", "career_matches"]);
  const matches = Array.isArray(all)
    ? all.map(readRoleMatch).filter((match): match is RoleMatch => match !== null)
    : [];

  for (const fallback of [primary, runnerUp]) {
    if (fallback && !matches.some((match) => normalizeKey(match.role) === normalizeKey(fallback.role))) {
      matches.push(fallback);
    }
  }

  matches.sort((a, b) => b.percentage - a.percentage);
  return { primary: primary ?? matches[0] ?? null, matches };
}

function matchesToGradient(matches: RoleMatch[]) {
  const total = matches.reduce((sum, match) => sum + match.percentage, 0) || 1;
  let position = 0;
  const stops = matches.map((match, index) => {
    const start = position;
    position += (match.percentage / total) * 360;
    return `${roleColors[index % roleColors.length]} ${start}deg ${position}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function getRecommendedResources(role: string): LearningResource[] {
  const careerId = getCareerIdForQuizRole(role);
  const career = getCareerById(careerId);
  const roadmap = getRoadmapById(career?.roadmapId);
  const recommendations: LearningResource[] = [];
  const seen = new Set<string>();
  const add = (resource?: LearningResource) => {
    if (resource && !seen.has(resource.id)) {
      seen.add(resource.id);
      recommendations.push(resource);
    }
  };

  roadmap?.stages.forEach((stage) => stage.skills.forEach((skill) => {
    skill.resourceIds.forEach((resourceId) => add(getResourceById(resourceId)));
  }));

  if (career) {
    const careerSkillIds = new Set(career.skillGroups.flatMap((group) => group.skills));
    learningResources
      .filter((resource) => resource.roles.includes(career.id))
      .forEach(add);
    learningResources
      .filter((resource) => resource.skills.some((skillId) => careerSkillIds.has(skillId)))
      .forEach(add);
    // Broad beginner resources such as Git help learners in any role.
    learningResources
      .filter((resource) => resource.roles.length > 1)
      .forEach(add);
  }

  if (recommendations.length < 3) learningResources.forEach(add);
  return recommendations.slice(0, 3);
}

function RecommendedSources({ role, resources, language, title, subtitle, openLabel, emptyLabel }: {
  role: string;
  resources: LearningResource[];
  language: Language;
  title: string;
  subtitle: string;
  openLabel: string;
  emptyLabel: string;
}) {
  return (
    <section className="exploration-result-card exploration-result-next-step exploration-recommended-panel" aria-label={title}>
      <header>
        <p className="exploration-quiz-eyebrow">{title}</p>
        <p className="exploration-recommended-subtitle">{subtitle.replace("{role}", role)}</p>
      </header>
      <div className="exploration-recommended-list">
        {resources.map((resource) => (
          <article className="exploration-recommended-item" key={resource.id}>
            <div className="exploration-recommended-meta">
              <span>{resource.type}</span>
              {resource.provider ? <span>{resource.provider}</span> : null}
            </div>
            <h3>{localize(resource.title, language)}</h3>
            <p>{localize(resource.description, language)}</p>
            {resource.internalPath ? (
              <Link to={resource.internalPath} className="exploration-recommended-link">{openLabel} <span aria-hidden="true">↗</span></Link>
            ) : resource.url ? (
              <a href={resource.url} target="_blank" rel="noreferrer" className="exploration-recommended-link">{openLabel} <span aria-hidden="true">↗</span></a>
            ) : null}
          </article>
        ))}
        {!resources.length ? <p className="exploration-recommended-empty">{emptyLabel}</p> : null}
      </div>
    </section>
  );
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function normalizeScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value <= 1 ? value * 100 : value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace("%", ""));
    if (Number.isFinite(parsed)) return parsed <= 1 ? parsed * 100 : parsed;
  }
  if (isRecord(value)) {
    const score = findField(value, ["score", "fit", "fit_percentage", "percentage", "match", "value"]);
    if (score !== undefined) return normalizeScore(score);
  }
  return null;
}

function scoreEntries(value: unknown): Array<{ label: string; score: number }> {
  const entries: Array<{ label: string; score: number }> = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (isRecord(item)) {
        const title = findField(item, ["field", "path", "career", "role", "name", "label"]);
        const score = normalizeScore(item);
        if (score !== null) entries.push({ label: title === undefined ? `Career ${index + 1}` : String(title), score });
      }
    });
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([label, item]) => {
      const score = normalizeScore(item);
      if (score !== null) entries.push({ label: labelForKey(label), score });
    });
  }
  return entries;
}

function ScoreList({ matches, compact = false }: { matches: RoleMatch[]; compact?: boolean }) {
  return (
    <div className={`exploration-score-list ${compact ? "exploration-score-list--compact" : ""}`}>
      {matches.map((match, index) => (
        <div className="exploration-score-row" key={match.role} style={{ "--score-index": index } as CSSProperties}>
          <div>
            <span>{match.role}</span>
            <strong>{Math.round(match.percentage)}%</strong>
          </div>
          <div
            className="exploration-score-track"
            role="img"
            aria-label={`${match.role}: ${Math.round(match.percentage)}%`}
          >
            <span style={{ width: `${match.percentage}%`, backgroundColor: roleColors[index % roleColors.length] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExplorationResult({
  result,
  language
}: {
  result: unknown;
  language: Language;
}) {
  const copy = labels[language];
  const [showAllMatches, setShowAllMatches] = useState(false);
  const data = useMemo(() => unwrapResult(result), [result]);

  if (!hasValue(data) || (isRecord(data) && Object.keys(data).length === 0)) {
    return <p className="exploration-result-empty">{copy.noResult}</p>;
  }

  if (!isRecord(data)) {
    return <section className="exploration-result-card"><DynamicValue value={data} /></section>;
  }

  const { primary, matches } = findRoleMatches(data);
  const runnerUp = readRoleMatch(findField(data, ["runner_up", "runnerUp", "second_recommendation"]));
  const hasStructuredMatches = matches.length > 0;
  const topRoleResources = primary ? getRecommendedResources(primary.role) : [];

  if (hasStructuredMatches && primary) {
    return (
      <>
        <div className="exploration-result-grid">
          <section className="exploration-result-card exploration-result-matches">
            <header className="exploration-result-card-header">
              <div>
                <p className="exploration-quiz-eyebrow">{copy.eyebrow}</p>
                <h1>{copy.title}</h1>
              </div>
              <button type="button" className="exploration-view-all" onClick={() => setShowAllMatches(true)}>
                {copy.viewAll}
              </button>
            </header>
            <div className="exploration-match-overview">
              <div
                className="exploration-match-donut"
                style={{ background: matchesToGradient(matches) }}
                role="img"
                aria-label={`${primary.role}, ${Math.round(primary.percentage)}%`}
              >
                <span>{Math.round(primary.percentage)}%</span>
              </div>
              <ScoreList matches={matches.slice(0, 4)} compact />
            </div>
            {runnerUp && !matches.some((match) => normalizeKey(match.role) === normalizeKey(runnerUp.role)) ? (
              <p className="exploration-runner-up">{runnerUp.role} · {Math.round(runnerUp.percentage)}%</p>
            ) : null}
          </section>

          <RecommendedSources
            role={primary.role}
            resources={topRoleResources}
            language={language}
            title={copy.recommendedSources}
            subtitle={copy.sourcesFor}
            openLabel={copy.openSource}
            emptyLabel={copy.noSources}
          />
        </div>
        <section className="exploration-result-card exploration-roadmap-next-step">
          <p className="exploration-quiz-eyebrow">Model 2</p>
          <h2>{copy.buildRoadmap}</h2>
          <p>{copy.buildRoadmapDescription}</p>
          <Link to="/app/assessment/goal" className="exploration-recommended-link">
            {copy.buildRoadmap} <span aria-hidden="true">→</span>
          </Link>
        </section>

        <Sheet open={showAllMatches} onOpenChange={setShowAllMatches}>
          <SheetContent side="right" className="exploration-result-sheet">
            <SheetHeader>
              <SheetTitle>{copy.allMatches}</SheetTitle>
              <SheetDescription>{copy.allMatchesDescription}</SheetDescription>
            </SheetHeader>
            <div className="exploration-result-sheet-list">
              <ScoreList matches={matches} />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  const recommendation = findField(data, keyAliases.recommendation);
  const scores = findField(data, keyAliases.fitScores);
  const reasoning = findField(data, keyAliases.reasoning);
  const roadmap = findField(data, keyAliases.roadmap);
  const resources = findField(data, keyAliases.resources);
  const modelType = findField(data, ["modelType", "model_type", "model"]);
  const scoreRows = scoreEntries(scores);
  const handledKeys = new Set([
    ...Object.values(keyAliases).flat(),
    "primary_recommendation", "primaryRecommendation", "runner_up", "all_role_percentages",
    "modelType", "model_type", "model"
  ].map(normalizeKey));
  const additionalEntries = Object.entries(data).filter(([key, value]) => !handledKeys.has(normalizeKey(key)) && hasValue(value));

  return (
    <div className="exploration-result-body">
      <header className="exploration-result-header">
        <p className="exploration-quiz-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        {hasValue(modelType) ? <p className="exploration-result-model"><DynamicValue value={modelType} /></p> : null}
      </header>
      {hasValue(recommendation) ? <section className="exploration-result-card exploration-result-recommendation"><h2>{copy.title}</h2><DynamicValue value={recommendation} /></section> : null}
      {scoreRows.length ? <section className="exploration-result-card"><h2>{copy.fitScores}</h2><ScoreList matches={scoreRows.map(({ label, score }) => ({ role: label, percentage: score }))} /></section> : null}
      {hasValue(scores) && !scoreRows.length ? <section className="exploration-result-card"><h2>{copy.fitScores}</h2><DynamicValue value={scores} /></section> : null}
      {hasValue(reasoning) ? <section className="exploration-result-card"><h2>{copy.reasoning}</h2><DynamicValue value={reasoning} /></section> : null}
      {hasValue(roadmap) ? <section className="exploration-result-card"><h2>{copy.roadmap}</h2><DynamicValue value={roadmap} /></section> : null}
      {hasValue(resources) ? <section className="exploration-result-card"><h2>{copy.resources}</h2><DynamicValue value={resources} /></section> : null}
      {additionalEntries.length ? (
        <details className="exploration-result-additional">
          <summary>{copy.additional}</summary>
          <dl className="result-value-fields">
            {additionalEntries.map(([key, value]) => <div key={key}><dt>{labelForKey(key)}</dt><dd><DynamicValue value={value} /></dd></div>)}
          </dl>
        </details>
      ) : null}
    </div>
  );
}

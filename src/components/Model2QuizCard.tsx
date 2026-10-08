import { useEffect, useRef, useState, type CSSProperties } from "react";
import loadingVideo from "../assets/model1-loading.mp4";
import loadingPoster from "../assets/model1-loading-poster.jpg";
import { MODEL2_QUESTIONS_BILINGUAL } from "../data/model2Questions";
import { useCareerRoadmap } from "../context/CareerRoadmapContext";
import { useI18n } from "../i18n/I18nContext";
import { predictCareerForModel2, type Model2Prediction } from "../services/model2CareerPrediction";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

type DisplayLanguage = "en" | "my";

const copy = {
  en: {
    eyebrow: "Career direction assessment",
    question: (current: number) => `Question ${current} of ${MODEL2_QUESTIONS_BILINGUAL.length}`,
    back: "Back",
    submit: "Submit Assessment",
    submitting: "Analyzing your answers...",
    title: "Your top career matches",
    resultEyebrow: "Your Model 2 result",
    predictedRole: "Predicted role",
    confidence: "Confidence",
    probabilities: "Career match probabilities",
    viewAll: "View all",
    allMatches: "All career matches",
    allMatchesDescription: "Your ranked career paths and their match percentages.",
    nextStep: "Your Next Step",
    roadmapReady: "Your roadmap is ready",
    roadmapDescription: "Start a learning roadmap for your top match, {role}.",
    openRoadmap: "Open Your Roadmap",
    retake: "Retake Assessment",
    error: "We couldn't analyze your answers. Please check your connection and try again."
  },
  my: {
    eyebrow: "အလုပ်အကိုင်ဦးတည်ချက် အကဲဖြတ်မှု",
    question: (current: number) => `မေးခွန်း ${current} / ${MODEL2_QUESTIONS_BILINGUAL.length}`,
    back: "နောက်သို့",
    submit: "အကဲဖြတ်မှု ပေးပို့ရန်",
    submitting: "သင့်အဖြေများကို ခွဲခြမ်းစိတ်ဖြာနေသည်...",
    title: "သင့်အတွက် ကိုက်ညီမှုအများဆုံး အလုပ်အကိုင်များ",
    resultEyebrow: "Model 2 ရလဒ်",
    predictedRole: "ခန့်မှန်းထားသော အလုပ်အကိုင်",
    confidence: "ယုံကြည်မှု",
    probabilities: "အလုပ်အကိုင် ကိုက်ညီမှု ရာခိုင်နှုန်း",
    viewAll: "အားလုံးကြည့်ရန်",
    allMatches: "အလုပ်အကိုင်ကိုက်ညီမှုအားလုံး",
    allMatchesDescription: "အဆင့်လိုက် အလုပ်အကိုင်လမ်းကြောင်းများနှင့် ကိုက်ညီမှုရာခိုင်နှုန်း။",
    nextStep: "နောက်တစ်ဆင့်",
    roadmapReady: "သင့်လမ်းပြမြေပုံ အသင့်ဖြစ်ပါပြီ",
    roadmapDescription: "ထိပ်ဆုံးကိုက်ညီမှုဖြစ်သော {role} အတွက် သင်ယူမှုလမ်းပြမြေပုံကို စတင်ပါ။",
    openRoadmap: "ကျွန်ုပ်၏လမ်းပြမြေပုံဖွင့်ရန်",
    retake: "အကဲဖြတ်မှု ပြန်ဖြေမည်",
    error: "အဖြေများကို ခွဲခြမ်းစိတ်ဖြာ၍ မရပါ။ အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်စမ်းပါ။"
  }
} satisfies Record<DisplayLanguage, {
  eyebrow: string;
  question: (current: number) => string;
  back: string;
  submit: string;
  submitting: string;
  title: string;
  resultEyebrow: string;
  predictedRole: string;
  confidence: string;
  probabilities: string;
  viewAll: string;
  allMatches: string;
  allMatchesDescription: string;
  nextStep: string;
  roadmapReady: string;
  roadmapDescription: string;
  openRoadmap: string;
  retake: string;
  error: string;
}>;

const chartColors = ["#a184ed", "#ff7a1a", "#b36ded", "#f3c944", "#78a8ff"];

function matchesToGradient(matches: Array<{ role: string; percentage: number }>) {
  const total = matches.reduce((sum, match) => sum + match.percentage, 0) || 1;
  let position = 0;
  const stops = matches.map((match, index) => {
    const start = position;
    position += (match.percentage / total) * 360;
    return `${chartColors[index % chartColors.length]} ${start}deg ${position}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function Model2QuizCard() {
  const { language } = useI18n();
  const { recordPrediction, setRoadmapModalOpen } = useCareerRoadmap();
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(language);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(10).fill(0));
  const [answered, setAnswered] = useState<boolean[]>(() => Array(10).fill(false));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Model2Prediction | null>(null);
  const [error, setError] = useState("");
  const [showAllMatches, setShowAllMatches] = useState(false);
  const advanceTimer = useRef<number | null>(null);
  const currentQuestion = MODEL2_QUESTIONS_BILINGUAL[questionIndex];
  const labels = copy[displayLanguage];
  const isComplete = answered.every(Boolean);
  const progress = ((questionIndex + 1) / MODEL2_QUESTIONS_BILINGUAL.length) * 100;

  useEffect(() => () => {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  function chooseOption(value: number) {
    if (submitting) return;
    setError("");
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? value : answer));
    setAnswered((current) => current.map((wasAnswered, index) => index === questionIndex ? true : wasAnswered));

    if (questionIndex === MODEL2_QUESTIONS_BILINGUAL.length - 1) return;

    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      setQuestionIndex((current) => Math.min(current + 1, MODEL2_QUESTIONS_BILINGUAL.length - 1));
      advanceTimer.current = null;
    }, 220);
  }

  function goBack() {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setQuestionIndex((current) => Math.max(0, current - 1));
    setError("");
  }

  async function submitAssessment() {
    if (!isComplete || submitting) return;
    const loadingStartedAt = Date.now();
    const minimumLoadingDuration = 4000;
    setSubmitting(true);
    setError("");
    try {
      const prediction = await predictCareerForModel2(answers);
      recordPrediction(prediction);
      setResult(prediction);
    } catch {
      setError(labels.error);
    } finally {
      const remainingLoadingTime = minimumLoadingDuration - (Date.now() - loadingStartedAt);
      if (remainingLoadingTime > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingLoadingTime));
      }
      setSubmitting(false);
    }
  }

  function retakeAssessment() {
    setAnswers(Array(10).fill(0));
    setAnswered(Array(10).fill(false));
    setQuestionIndex(0);
    setResult(null);
    setError("");
  }

  if (submitting) {
    return (
      <section className="app-page-shell learning-page-shell exploration-quiz-page" aria-live="polite">
        <div className="exploration-quiz-loading" role="status" aria-live="polite">
          <video
            className="exploration-quiz-loading-video"
            src={loadingVideo}
            poster={loadingPoster}
            autoPlay={!prefersReducedMotion}
            loop={!prefersReducedMotion}
            muted
            playsInline
            aria-hidden="true"
          />
          <h1>{labels.submitting}</h1>
        </div>
      </section>
    );
  }

  if (result) {
    const sortedProbabilities = Object.entries(result.probabilities)
      .map(([role, probability]) => ({ role, percentage: Math.max(0, Math.min(100, probability * 100)) }))
      .sort((a, b) => b.percentage - a.percentage);
    const predictedMatch = sortedProbabilities.find((match) => match.role === result.predicted_role)
      ?? sortedProbabilities[0];
    const confidencePercent = Math.max(0, Math.min(100, result.confidence * 100));

    return (
      <section className="app-page-shell learning-page-shell exploration-quiz-page" aria-live="polite">
        <div className="exploration-result-grid model2-result-grid">
          <section className="exploration-result-card exploration-result-matches">
            <header className="exploration-result-card-header">
              <div>
                <p className="exploration-quiz-eyebrow">{labels.resultEyebrow}</p>
                <h1>{labels.title}</h1>
                {predictedMatch && (
                  <p className="model2-result-confidence">
                    {labels.predictedRole}: <strong>{result.predicted_role}</strong> · {labels.confidence} <strong>{confidencePercent.toFixed(1)}%</strong>
                  </p>
                )}
              </div>
              <button type="button" className="exploration-view-all" onClick={() => setShowAllMatches(true)}>
                {labels.viewAll}
              </button>
            </header>
            <div className="exploration-match-overview" role="group" aria-label={labels.probabilities}>
              <div
                className="exploration-match-donut"
                style={{ background: matchesToGradient(sortedProbabilities) }}
                role="img"
                aria-label={`${result.predicted_role}, ${confidencePercent.toFixed(1)}% ${labels.confidence.toLowerCase()}`}
              >
                <span>{confidencePercent.toFixed(0)}%</span>
              </div>
              <div className="exploration-score-list exploration-score-list--compact">
                {sortedProbabilities.slice(0, 4).map((match, index) => (
                  <div className="exploration-score-row" key={match.role} style={{ "--score-index": index } as CSSProperties}>
                    <div><span>{match.role}</span><strong>{Math.round(match.percentage)}%</strong></div>
                    <div className="exploration-score-track" role="img" aria-label={`${match.role}: ${Math.round(match.percentage)}%`}>
                      <span style={{ width: `${match.percentage}%`, backgroundColor: chartColors[index % chartColors.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="exploration-result-card exploration-result-next-step">
            <p className="exploration-quiz-eyebrow">{labels.nextStep}</p>
            <h2>{labels.roadmapReady}</h2>
            <p>{labels.roadmapDescription.replace("{role}", result.predicted_role)}</p>
            <Button type="button" onClick={() => setRoadmapModalOpen(true)}>
              {labels.openRoadmap} <span aria-hidden="true">→</span>
            </Button>
          </section>
        </div>
        <div className="model2-result-actions">
          <Button type="button" variant="outline" onClick={retakeAssessment}>{labels.retake}</Button>
        </div>

        <Sheet open={showAllMatches} onOpenChange={setShowAllMatches}>
          <SheetContent side="right" className="exploration-result-sheet">
            <SheetHeader>
              <SheetTitle>{labels.allMatches}</SheetTitle>
              <SheetDescription>{labels.allMatchesDescription}</SheetDescription>
            </SheetHeader>
            <div className="exploration-result-sheet-list">
              <div className="exploration-score-list">
                {sortedProbabilities.map((match, index) => (
                  <div className="exploration-score-row" key={match.role} style={{ "--score-index": index } as CSSProperties}>
                    <div><span>{match.role}</span><strong>{Math.round(match.percentage)}%</strong></div>
                    <div className="exploration-score-track" role="img" aria-label={`${match.role}: ${Math.round(match.percentage)}%`}>
                      <span style={{ width: `${match.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    );
  }

  return (
    <section className="app-page-shell learning-page-shell exploration-quiz-page" aria-live="polite">
      <div className="exploration-quiz-content" key={currentQuestion.id}>
        <div
          className="exploration-quiz-progress"
          role="progressbar"
          aria-label={labels.question(questionIndex + 1)}
          aria-valuemin={1}
          aria-valuemax={MODEL2_QUESTIONS_BILINGUAL.length}
          aria-valuenow={questionIndex + 1}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="exploration-quiz-meta">
          <p className="exploration-quiz-step">{labels.question(questionIndex + 1)}</p>
          <div className="exploration-quiz-language" aria-label="Display language">
            <button type="button" className={displayLanguage === "en" ? "is-active" : ""} aria-pressed={displayLanguage === "en"} onClick={() => setDisplayLanguage("en")}>EN</button>
            <button type="button" className={displayLanguage === "my" ? "is-active" : ""} aria-pressed={displayLanguage === "my"} onClick={() => setDisplayLanguage("my")}>မြန်မာ</button>
          </div>
        </div>

        <p className="exploration-quiz-eyebrow">{labels.eyebrow}</p>
        <h1 className="exploration-quiz-question">{currentQuestion.text[displayLanguage]}</h1>

        <div className="exploration-quiz-options" data-option-count={currentQuestion.options.length}>
          {currentQuestion.options.map((option) => {
            const isSelected = answered[questionIndex] && answers[questionIndex] === option.value;
            return (
              <button
                className={`exploration-quiz-option ${isSelected ? "is-selected" : ""}`}
                key={option.value}
                type="button"
                aria-pressed={Boolean(isSelected)}
                disabled={submitting}
                onClick={() => chooseOption(option.value)}
              >
                {option.label[displayLanguage]}
              </button>
            );
          })}
        </div>

        {error && <p className="exploration-quiz-error" role="alert">{error}</p>}
        <div className="exploration-quiz-actions">
          <Button type="button" variant="outline" onClick={goBack} disabled={questionIndex === 0 || submitting}>{labels.back}</Button>
          {questionIndex === MODEL2_QUESTIONS_BILINGUAL.length - 1 && (
            <Button type="button" onClick={() => void submitAssessment()} disabled={!isComplete || submitting}>
              {labels.submit}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

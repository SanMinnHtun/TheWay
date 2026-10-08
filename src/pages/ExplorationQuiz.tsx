import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildExplorationSubmission, explorationQuestions } from "../data/explorationQuiz";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n/I18nContext";
import { submitExplorationQuiz } from "../services/explorationQuiz";

export default function ExplorationQuiz() {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const [displayLanguage, setDisplayLanguage] = useState<"en" | "my">(language);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(explorationQuestions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const advanceTimer = useRef<number | null>(null);
  const currentQuestion = explorationQuestions[questionIndex];
  const selectedOption = answers[questionIndex];
  const progress = ((questionIndex + 1) / explorationQuestions.length) * 100;
  const displayCopy = displayLanguage === "my"
    ? {
        eyebrow: "အလုပ်အကိုင်စူးစမ်းလေ့လာမှု",
        progress: `မေးခွန်း ${questionIndex + 1} / ${explorationQuestions.length}`,
        back: "နောက်သို့",
        submit: "မေးခွန်းလွှာပေးပို့ရန်",
        submitting: "ပေးပို့နေသည်...",
        error: "သင့်အဖြေများကို မပေးပို့နိုင်ပါ။ အင်တာနက်ချိတ်ဆက်မှုစစ်ပြီး ထပ်စမ်းပါ။"
      }
    : {
        eyebrow: "Career exploration",
        progress: `Question ${questionIndex + 1} of ${explorationQuestions.length}`,
        back: "Back",
        submit: "Submit Quiz",
        submitting: "Submitting...",
        error: "We couldn't submit your answers. Check your connection and try again."
      };

  useEffect(() => () => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
    }
  }, []);

  function chooseOption(optionIndex: number) {
    setError("");
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer));

    if (questionIndex === explorationQuestions.length - 1) {
      return;
    }

    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
    }
    advanceTimer.current = window.setTimeout(() => {
      setQuestionIndex((current) => Math.min(current + 1, explorationQuestions.length - 1));
      advanceTimer.current = null;
    }, 225);
  }

  function goBack() {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setQuestionIndex((current) => Math.max(current - 1, 0));
    setError("");
  }

  async function handleSubmit() {
    if (submitting || answers.some((answer) => answer === null)) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitExplorationQuiz(buildExplorationSubmission(answers));
      setSubmitted(true);
    } catch {
      setError(displayCopy.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="app-page-shell learning-page-shell exploration-quiz-page" aria-live="polite">
      {submitted ? (
        <div className="exploration-quiz-success">
          <span className="exploration-quiz-success-mark" aria-hidden="true">✓</span>
          <p className="exploration-quiz-eyebrow">{t("explorationQuiz.eyebrow")}</p>
          <h1>{t("explorationQuiz.successTitle")}</h1>
          <p className="exploration-quiz-success-copy">{t("explorationQuiz.successDescription")}</p>
          <Button type="button" onClick={() => navigate("/app/explore")}>
            {t("explorationQuiz.return")}
          </Button>
        </div>
      ) : (
        <div className="exploration-quiz-content" key={currentQuestion.id}>
          <div
            className="exploration-quiz-progress"
            role="progressbar"
            aria-label={displayCopy.progress}
            aria-valuemin={1}
            aria-valuemax={explorationQuestions.length}
            aria-valuenow={questionIndex + 1}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="exploration-quiz-meta">
            <p className="exploration-quiz-step">{displayCopy.progress}</p>
            <div className="exploration-quiz-language" role="group" aria-label="Question language / မေးခွန်းဘာသာစကား">
              <button
                type="button"
                className={displayLanguage === "en" ? "is-active" : ""}
                aria-pressed={displayLanguage === "en"}
                onClick={() => {
                  setDisplayLanguage("en");
                  setError("");
                }}
              >
                English
              </button>
              <button
                type="button"
                className={displayLanguage === "my" ? "is-active" : ""}
                aria-pressed={displayLanguage === "my"}
                onClick={() => {
                  setDisplayLanguage("my");
                  setError("");
                }}
              >
                မြန်မာ
              </button>
            </div>
          </div>
          <p className="exploration-quiz-eyebrow">{displayCopy.eyebrow}</p>
          <span className="exploration-quiz-sparkle" aria-hidden="true">✦</span>
          <h1 className="exploration-quiz-question">
            {displayLanguage === "my" ? currentQuestion.myPrompt : currentQuestion.prompt}
          </h1>

          <div
            className="exploration-quiz-options"
            role="group"
            aria-label={displayLanguage === "my" ? currentQuestion.myPrompt : currentQuestion.prompt}
            data-option-count={currentQuestion.options.length}
          >
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                className={`exploration-quiz-option ${selectedOption === optionIndex ? "is-selected" : ""}`}
                aria-pressed={selectedOption === optionIndex}
                disabled={submitting}
                onClick={() => chooseOption(optionIndex)}
              >
                {displayLanguage === "my" ? currentQuestion.myOptions[optionIndex] : option}
              </button>
            ))}
          </div>

          {error ? <p className="exploration-quiz-error" role="alert">{error}</p> : null}

          <div className="exploration-quiz-actions">
            {questionIndex > 0 ? (
              <Button type="button" variant="outline" onClick={goBack} disabled={submitting}>
                {displayCopy.back}
              </Button>
            ) : <span />}
            {questionIndex === explorationQuestions.length - 1 ? (
              <Button type="button" onClick={() => void handleSubmit()} disabled={selectedOption === null || submitting}>
                {submitting ? displayCopy.submitting : displayCopy.submit}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

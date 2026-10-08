import type { ExplorationQuizSubmission } from "../data/explorationQuiz";

const apiBaseUrl =
  import.meta.env.VITE_QUIZ_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

export async function submitExplorationQuiz(payload: ExplorationQuizSubmission): Promise<void> {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/quiz/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`exploration-quiz-submit-failed:${response.status}`);
  }
}

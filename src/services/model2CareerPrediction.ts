export interface Model2Option {
  value: number;
  label: string;
}

export interface Model2Question {
  id: string;
  text: string;
  options: Model2Option[];
}

export interface Model2Prediction {
  predicted_role: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const configuredApiUrl = import.meta.env.VITE_MODEL2_API_URL?.trim().replace(/\/$/, "");
const proxyBase = "/api/model2";

function endpoint(path: "questions" | "predict") {
  return configuredApiUrl
    ? `${configuredApiUrl}/api/v1/career/${path}`
    : `${proxyBase}/${path}`;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) }
    });
  } catch {
    throw new Error("Unable to reach the career assessment service. Check the API URL and your connection.");
  }

  if (!response.ok) {
    let message = "";
    const responseText = await response.text().catch(() => "");
    try {
      const body: unknown = JSON.parse(responseText);
      if (body && typeof body === "object") {
        const detail = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
        message = typeof detail === "string" ? detail : detail ? JSON.stringify(detail) : "";
      }
    } catch {
      message = responseText;
    }
    const statusMessage = response.status === 422
      ? "The answers were rejected. Review them and try again."
      : response.status === 503
        ? "The prediction model is temporarily unavailable. Please try again later."
        : `The career service returned an error (${response.status}).`;
    throw new Error(message ? `${statusMessage} ${message}` : statusMessage);
  }

  try {
    return await response.json() as T;
  } catch {
    throw new Error("The career service returned an invalid response.");
  }
}

function isQuestion(value: unknown): value is Model2Question {
  if (!value || typeof value !== "object") return false;
  const question = value as Partial<Model2Question>;
  return typeof question.id === "string" && question.id.length > 0
    && typeof question.text === "string" && question.text.length > 0
    && Array.isArray(question.options) && question.options.length === 5
    && question.options.every((option, index) => option && Number.isInteger(option.value)
      && option.value >= 0 && option.value <= 4 && typeof option.label === "string"
      && question.options?.filter((candidate) => candidate.value === index).length === 1);
}

export async function fetchModel2Questions(): Promise<Model2Question[]> {
  const result = await requestJson<{ questions?: unknown }>(endpoint("questions"));
  if (!Array.isArray(result?.questions) || result.questions.length !== 10 || !result.questions.every(isQuestion)) {
    throw new Error("The career service returned invalid questions. Please try again later.");
  }
  const ids = result.questions.map((question) => question.id);
  if (new Set(ids).size !== 10 || ids.some((id, index) => id !== `Q${index + 1}`)) {
    throw new Error("The career service questions are not in Q1 to Q10 order. Please try again later.");
  }
  return result.questions;
}

function isPrediction(value: unknown): value is Model2Prediction {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<Model2Prediction>;
  return typeof result.predicted_role === "string" && result.predicted_role.length > 0
    && typeof result.confidence === "number" && result.confidence >= 0 && result.confidence <= 1
    && Boolean(result.probabilities) && typeof result.probabilities === "object"
    && !Array.isArray(result.probabilities)
    && Object.keys(result.probabilities).length > 0
    && Object.values(result.probabilities).every((probability) => typeof probability === "number"
      && Number.isFinite(probability) && probability >= 0 && probability <= 1);
}

export async function predictCareerForModel2(answers: number[]): Promise<Model2Prediction> {
  if (answers.length !== 10 || answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4)) {
    throw new Error("Select one answer for each question before submitting.");
  }
  const result = await requestJson<unknown>(endpoint("predict"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });
  if (!isPrediction(result)) throw new Error("The career service returned an invalid prediction.");
  return result;
}

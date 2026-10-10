export interface Model2Prediction {
  predicted_role: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const model2ApiOrigin = "https://model2-s2.onrender.com";
const apiBaseUrl = import.meta.env.VITE_MODEL2_API_URL || model2ApiOrigin;

function isModel2Prediction(value: unknown): value is Model2Prediction {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<Model2Prediction>;
  return typeof result.predicted_role === "string"
    && typeof result.confidence === "number"
    && Boolean(result.probabilities)
    && typeof result.probabilities === "object"
    && !Array.isArray(result.probabilities)
    && Object.values(result.probabilities).every((probability) => typeof probability === "number");
}

export async function predictCareerForModel2(answers: number[]): Promise<Model2Prediction> {
  if (
    answers.length !== 10 ||
    answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4)
  ) {
    throw new Error("model2-invalid-answers");
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/v1/career/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ answers })
  });

  if (!response.ok) {
    let detail: unknown;
    const errorResponse = response.clone();
    try {
      detail = await response.json();
    } catch {
      detail = await errorResponse.text().catch(() => "<response body unavailable>");
    }
    console.error("Model 2 career prediction failed", {
      status: response.status,
      statusText: response.statusText,
      detail
    });
    throw new Error(`model2-prediction-failed:${response.status}`);
  }

  const result: unknown = await response.json();
  if (!isModel2Prediction(result)) {
    console.error("Model 2 returned an unexpected response", result);
    throw new Error("model2-invalid-response");
  }

  return result;
}

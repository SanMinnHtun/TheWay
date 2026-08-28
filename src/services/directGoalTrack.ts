import type {
  DirectGoalRequest,
  DirectGoalResponse
} from "../types/directGoal";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://imstillexploring.onrender.com";

export async function fetchDirectGoalRoadmap(
  targetCareer: string,
  experienceLevel?: string
): Promise<DirectGoalResponse> {
  const request: DirectGoalRequest = {
    target_career: targetCareer,
    experience_level: experienceLevel
  };

  const response = await fetch(`${apiBaseUrl}/api/analyze-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch direct goal roadmap: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as DirectGoalResponse;
}
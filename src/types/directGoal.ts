export interface DirectGoalRequest {
  target_career: string;
  experience_level?: string;
}

export interface DirectGoalResponse {
  primary_field: string;
  roadmap_phases: unknown[];
}
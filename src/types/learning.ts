import type { AppLanguage, UserMode } from "./profile";

export interface LocalizedText {
  en: string;
  my: string;
}

export type CareerCategory =
  | "web"
  | "mobile"
  | "data-ai"
  | "cloud-devops"
  | "security"
  | "qa"
  | "systems"
  | "game";

export type SkillPriority = "essential" | "recommended" | "optional";
export type LearningLevel = "beginner" | "intermediate" | "advanced";
export type ResourceType = "course" | "docs" | "guide" | "video" | "article" | "project" | "interview";
export type ProjectDomain =
  | "ai-agents"
  | "backend-apis"
  | "data-ml"
  | "mobile"
  | "security"
  | "systems-cli"
  | "web"
  | "devops-cloud";

export interface CareerSkillGroup {
  id: string;
  label: LocalizedText;
  skills: string[];
}

export interface Career {
  id: string;
  slug: string;
  name: LocalizedText;
  category: CareerCategory;
  categoryLabel: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  coreStack: string[];
  responsibilities: LocalizedText[];
  traits: LocalizedText[];
  fitReasons: LocalizedText[];
  skillGroups: CareerSkillGroup[];
  roadmapId: string;
  matchByMode: Record<UserMode, number>;
}

export interface RoadmapSkill {
  id: string;
  name: LocalizedText;
  priority: SkillPriority;
  description: LocalizedText;
  whyItMatters: LocalizedText;
  learningObjectives: LocalizedText[];
  resourceIds: string[];
  projectIds?: string[];
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  whyItMatters: LocalizedText;
  skills: RoadmapSkill[];
  projectIds?: string[];
}

export interface Roadmap {
  id: string;
  careerId: string;
  title: LocalizedText;
  description: LocalizedText;
  stages: RoadmapStage[];
}

export interface LearningResource {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  type: ResourceType;
  roles: string[];
  skills: string[];
  level: LearningLevel;
  provider?: string;
  duration?: LocalizedText;
  url?: string;
  internalPath?: string;
}

export interface ProjectBuildStep {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  name: LocalizedText;
  domain: ProjectDomain;
  domainLabel: LocalizedText;
  level: LearningLevel;
  duration: LocalizedText;
  description: LocalizedText;
  roleIds: string[];
  skillIds: string[];
  whatYouBuild: LocalizedText[];
  learningOutcomes: LocalizedText[];
  architecture: LocalizedText[];
  buildSteps: ProjectBuildStep[];
  extensions: LocalizedText[];
}

export interface GuideSection {
  id: string;
  heading: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface LearningGuide {
  id: string;
  slug: string;
  category: "career" | "learning" | "projects" | "software-engineering" | "system-design" | "interview";
  categoryLabel: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  readTime: LocalizedText;
  sections: GuideSection[];
  checklist: LocalizedText[];
  careerIds: string[];
  skillIds: string[];
  resourceIds: string[];
}

export interface InterviewQuestion {
  id: string;
  slug: string;
  category: "behavioral" | "technical" | "system-design" | "role-specific";
  categoryLabel: LocalizedText;
  question: LocalizedText;
  summary: LocalizedText;
  evaluates: LocalizedText[];
  approach: LocalizedText[];
  starFramework?: {
    situation: LocalizedText;
    task: LocalizedText;
    action: LocalizedText;
    result: LocalizedText;
  };
  commonMistakes: LocalizedText[];
  roleIds: string[];
  skillIds: string[];
}

export interface UserLearningState {
  uid: string;
  selectedCareerId: string | null;
  roadmapId: string | null;
  currentStageId: string | null;
  completedSkillIds: string[];
  savedResourceIds: string[];
  startedAt: unknown;
  updatedAt: unknown;
}

export function localize(value: LocalizedText, language: AppLanguage) {
  return value[language] || value.en;
}

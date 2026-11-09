import { getCareerById, getResourceById, getRoadmapById, learningResources } from "./learningCatalog";
import { getCareerIdForQuizRole } from "./explorationQuiz";
import type { LearningResource } from "../types/learning";

export function getCareerForModel1Role(role: string) {
  const careerId = getCareerIdForQuizRole(role);
  return careerId ? getCareerById(careerId) ?? null : null;
}

export function getResourcesForModel1Role(role: string, count = 4): LearningResource[] {
  const career = getCareerForModel1Role(role);
  if (!career) return [];

  const roadmap = getRoadmapById(career.roadmapId);
  const skillIds = new Set(career.skillGroups.flatMap((group) => group.skills));
  const recommended: LearningResource[] = [];
  const seen = new Set<string>();

  const add = (resource?: LearningResource) => {
    if (resource && !seen.has(resource.id)) {
      seen.add(resource.id);
      recommended.push(resource);
    }
  };

  roadmap?.stages.forEach((stage) => {
    stage.skills.forEach((skill) => skill.resourceIds.forEach((resourceId) => add(getResourceById(resourceId))));
  });

  learningResources
    .filter((resource) => resource.roles.includes(career.id) || resource.skills.some((skillId) => skillIds.has(skillId)))
    .forEach(add);

  return recommended.slice(0, count);
}

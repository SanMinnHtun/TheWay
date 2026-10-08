import { CAREER_ROADMAPS } from "./careerRoadmaps";
import { getCareerById, getRoadmapById } from "./learningCatalog";
import { getCareerIdForQuizRole } from "./explorationQuiz";

export type RoadmapStatus = "pending" | "in-progress" | "completed";

export interface EditableRoadmapSkill {
  id: string;
  name: string;
  status: RoadmapStatus;
}

export interface EditableRoadmapStage {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  skills: EditableRoadmapSkill[];
}

export interface EditableRoadmap {
  roleTitle: string;
  matchPercentage: number;
  lastSaved: string;
  stages: EditableRoadmapStage[];
}

interface StageTemplate {
  id: string;
  title: string;
  status: RoadmapStatus;
  description: string;
  skills: string[];
}

const baseTemplates: Record<string, StageTemplate[]> = {
  "Frontend / UI-UX Developer": [
    { id: "stage-1", title: "Stage 1: Web Core & UI Design", status: "completed", description: "Master semantic layout structure, CSS systems, and basic interactive state.", skills: ["HTML5 / CSS3", "Modern Flexbox & Grid", "JavaScript (ES6+)", "Figma UI Tokens"] },
    { id: "stage-2", title: "Stage 2: Modern Component Architecture", status: "in-progress", description: "Build reactive interfaces, handle state, and streamline client builds.", skills: ["React.js", "Vite", "Tailwind CSS", "Zustand / Redux"] },
    { id: "stage-3", title: "Stage 3: Type Safety & API Integration", status: "pending", description: "Integrate backends cleanly while maintaining rigid type correctness.", skills: ["TypeScript", "TanStack Query", "Axios", "REST & GraphQL"] },
    { id: "stage-4", title: "Stage 4: Animation & Performance", status: "pending", description: "Optimize user experience, framer motion animations, and Lighthouse Web Vitals.", skills: ["Framer Motion", "Next.js / SSR", "Lighthouse Audit", "Design System Deployment"] }
  ],
  "Knowledge Graph / Ontology Specialist": [
    { id: "stage-1", title: "Stage 1: Formal Logic & Knowledge Representation", status: "in-progress", description: "Understand taxonomy hierarchy, semantic links, and formal schema logic.", skills: ["Discrete Logic", "Data Modeling", "JSON-LD", "Set Theory"] },
    { id: "stage-2", title: "Stage 2: Semantic Web Standards", status: "pending", description: "Build domain ontologies using standard semantic languages.", skills: ["RDF / RDFS", "OWL Language", "Protégé", "SPARQL Queries"] },
    { id: "stage-3", title: "Stage 3: Graph Databases & Vector Search", status: "pending", description: "Store and retrieve interconnected graphs alongside vector indexes.", skills: ["Neo4j / Cypher", "Vector DBs (Chroma/Qdrant)", "Entity Resolution"] },
    { id: "stage-4", title: "Stage 4: Graph RAG & LLM Integration", status: "pending", description: "Ground AI generation engines using factual graph knowledge bases.", skills: ["GraphRAG", "Knowledge-Grounded LLMs", "Ontology Alignment"] }
  ]
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stagesForRole(role: string): StageTemplate[] {
  const direct = baseTemplates[role];
  if (direct) return direct;

  const supplied = CAREER_ROADMAPS[role];
  if (supplied) {
    return supplied.stages.map((stage, index) => ({
      id: `stage-${index + 1}`,
      title: `${stage.stage}: ${stage.title}`,
      status: index === 0 ? "in-progress" : "pending",
      description: stage.description,
      skills: stage.skills
    }));
  }

  const career = getCareerById(getCareerIdForQuizRole(role));
  const catalogRoadmap = getRoadmapById(career?.roadmapId);
  if (catalogRoadmap) {
    return catalogRoadmap.stages.map((stage) => ({
      id: `stage-${stage.order}`,
      title: `Stage ${stage.order}: ${stage.title.en}`,
      status: stage.order === 1 ? "in-progress" : "pending",
      description: stage.description.en,
      skills: stage.skills.map((skill) => skill.name.en)
    }));
  }

  return baseTemplates["Frontend / UI-UX Developer"];
}

export function generateTopRoleRoadmap(
  topRoleName = "Frontend / UI-UX Developer",
  matchPercentage = 0
): EditableRoadmap {
  const stages = stagesForRole(topRoleName);
  return {
    roleTitle: topRoleName,
    matchPercentage: Math.max(0, Math.min(100, matchPercentage)),
    lastSaved: new Date().toISOString(),
    stages: stages.map((stage) => ({
      ...stage,
      skills: stage.skills.map((name) => ({
        id: `${stage.id}-${slug(name)}`,
        name,
        status: "pending"
      }))
    }))
  };
}

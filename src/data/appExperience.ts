export type CareerCategory = "Development" | "Design" | "Data" | "Cloud" | "Security";

export interface CareerPreview {
  id: string;
  role: string;
  category: CareerCategory;
  summary: string;
  fitReason: string;
  skills: string[];
  technologies: string[];
  match: number;
  firstStep: string;
  difficulty: "Beginner friendly" | "Moderate" | "Advanced";
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  state: "completed" | "current" | "available" | "locked";
  summary: string;
  why: string;
  learn: string;
  completion: string;
}

export interface LearningResourcePreview {
  id: string;
  type: "Course" | "Documentation" | "Video" | "Project";
  title: string;
  provider: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate";
  duration: string;
  recommendedFor: string;
}

export const careerPreviews: CareerPreview[] = [
  {
    id: "frontend-developer",
    role: "Frontend Developer",
    category: "Development",
    summary: "Build the screens, flows, and interactions people use in web applications.",
    fitReason: "Strong fit if you enjoy visual problem solving, quick feedback, and making ideas feel usable.",
    skills: ["HTML", "CSS", "React"],
    technologies: ["JavaScript", "TypeScript", "UI"],
    match: 91,
    firstStep: "Practice responsive layouts and small interactive components.",
    difficulty: "Beginner friendly"
  },
  {
    id: "backend-developer",
    role: "Backend Developer",
    category: "Development",
    summary: "Build APIs, services, databases, and systems behind applications.",
    fitReason: "Strong fit if you enjoy logic, problem solving, and organizing how systems work.",
    skills: ["APIs", "Databases", "Testing"],
    technologies: ["Node.js", "Java", "SQL"],
    match: 88,
    firstStep: "Learn HTTP basics, SQL fundamentals, and one backend framework.",
    difficulty: "Moderate"
  },
  {
    id: "ui-ux-designer",
    role: "UI/UX Designer",
    category: "Design",
    summary: "Research user needs and design clear product experiences before they are built.",
    fitReason: "Strong fit if you like understanding people, simplifying choices, and improving clarity.",
    skills: ["Research", "Wireframes", "Prototyping"],
    technologies: ["Figma", "Design systems", "Usability"],
    match: 84,
    firstStep: "Redesign one familiar app flow and explain each decision.",
    difficulty: "Beginner friendly"
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    category: "Data",
    summary: "Turn messy information into reports, dashboards, and decisions.",
    fitReason: "Strong fit if you like patterns, questions, and explaining findings with evidence.",
    skills: ["Spreadsheets", "SQL", "Charts"],
    technologies: ["Python", "Power BI", "Analytics"],
    match: 79,
    firstStep: "Analyze a small public dataset and write three useful insights.",
    difficulty: "Beginner friendly"
  },
  {
    id: "devops-engineer",
    role: "Cloud / DevOps Engineer",
    category: "Cloud",
    summary: "Help teams deploy, monitor, and keep applications reliable.",
    fitReason: "Strong fit if you like systems thinking, automation, and improving reliability.",
    skills: ["Linux", "Cloud", "CI/CD"],
    technologies: ["Docker", "AWS", "Monitoring"],
    match: 74,
    firstStep: "Deploy a small app and document how it runs.",
    difficulty: "Advanced"
  },
  {
    id: "security-analyst",
    role: "Cybersecurity Analyst",
    category: "Security",
    summary: "Protect systems by finding risks, monitoring activity, and improving defenses.",
    fitReason: "Strong fit if you are careful, curious, and comfortable investigating details.",
    skills: ["Networking", "Threats", "Logs"],
    technologies: ["Linux", "Security tools", "Risk"],
    match: 72,
    firstStep: "Learn networking basics and practice reading security scenarios.",
    difficulty: "Moderate"
  }
];

export const roadmapMilestones: RoadmapMilestone[] = [
  {
    id: "orientation",
    title: "Choose a focused direction",
    state: "completed",
    summary: "Compare a few roles and pick one primary path to study first.",
    why: "A focused direction keeps the roadmap practical and prevents random course switching.",
    learn: "Role responsibilities, daily work, and required beginner skills.",
    completion: "Select one career path to use as your first roadmap target."
  },
  {
    id: "web-foundations",
    title: "Web foundations",
    state: "current",
    summary: "Learn how pages, requests, browsers, and basic application structure fit together.",
    why: "Most modern tech roles benefit from understanding how web software is built and delivered.",
    learn: "HTML, CSS, JavaScript basics, HTTP, Git, and simple debugging.",
    completion: "Build and publish one small responsive project."
  },
  {
    id: "core-programming",
    title: "Core programming habits",
    state: "available",
    summary: "Practice writing readable code, breaking problems down, and testing small functions.",
    why: "Good habits make every later framework or tool easier to learn.",
    learn: "Functions, data structures, errors, modules, and simple tests.",
    completion: "Complete three small projects with clear README notes."
  },
  {
    id: "portfolio-project",
    title: "Portfolio project",
    state: "locked",
    summary: "Combine your skills into one larger project that proves what you can build.",
    why: "A finished project gives you evidence for internships, interviews, and self-assessment.",
    learn: "Planning, implementation, deployment, and project presentation.",
    completion: "Ship a project with screenshots, source code, and a short case study."
  }
];

export const learningResources: LearningResourcePreview[] = [
  {
    id: "mdn-web-basics",
    type: "Documentation",
    title: "MDN Web Docs: Getting started",
    provider: "MDN",
    topic: "Web foundations",
    difficulty: "Beginner",
    duration: "2 hours",
    recommendedFor: "My Roadmap -> Web foundations"
  },
  {
    id: "freecodecamp-responsive",
    type: "Course",
    title: "Responsive Web Design",
    provider: "freeCodeCamp",
    topic: "HTML and CSS",
    difficulty: "Beginner",
    duration: "6 hours",
    recommendedFor: "My Roadmap -> Web foundations"
  },
  {
    id: "git-basics",
    type: "Video",
    title: "Git and GitHub basics",
    provider: "The Way picks",
    topic: "Developer workflow",
    difficulty: "Beginner",
    duration: "45 minutes",
    recommendedFor: "My Roadmap -> Web foundations"
  },
  {
    id: "portfolio-landing",
    type: "Project",
    title: "Build a responsive portfolio page",
    provider: "Practice project",
    topic: "HTML, CSS, deployment",
    difficulty: "Beginner",
    duration: "1 weekend",
    recommendedFor: "My Roadmap -> Web foundations"
  }
];

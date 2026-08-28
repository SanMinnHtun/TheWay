# Career Learning Experience Spec

## Purpose

This spec replaces the authenticated learning preview phase with a connected, production-ready experience. The product loop is:

```text
Discover -> Choose -> Learn -> Practice -> Build -> Progress
```

Explore Careers answers where the learner can go. My Roadmap explains the ordered path. Learning Resources identifies what to study now. Projects provide evidence of applied skill. Way Assistant remains available as contextual help throughout the loop.

ResuMax is an information-architecture reference only. The implementation must preserve TheWay's brand, copy, data model, component conventions, and dark-purple visual system.

## Routes

Authenticated routes remain nested under `/app` and must survive refresh:

- `/app/explore`
- `/app/explore/:careerSlug`
- `/app/roadmap`
- `/app/resources`
- `/app/resources/projects/:projectSlug`
- `/app/resources/guides/:guideSlug`
- `/app/resources/interview/:questionSlug`
- `/app/assistant`
- `/app/profile`
- `/app/profile/edit`
- `/app/settings`

`/app/explore` is the default authenticated entry, not a redirect target for every authenticated deep link.

## Static Catalog and Relationships

Career definitions, roadmap templates, learning resources, projects, guides, and interview prompts are typed static catalog data. They share stable IDs. A skill ID must connect its career roadmap stage to relevant resources, practice projects, and assistant prompts.

The catalog is read-only application content. Per-user state never mutates catalog records.

Core entities:

- `Career`: role metadata, category, stack, responsibilities, traits, roadmap ID, and catalog counts.
- `Roadmap`: career relationship and ordered stages.
- `RoadmapStage`: description, skills, project relationships, and dependency order.
- `RoadmapSkill`: priority, description, purpose, objectives, resources, and projects.
- `LearningResource`: type, provider, level, duration, roles, skills, and destination URL.
- `PortfolioProject`: domain, difficulty, skills proved, build steps, architecture flow, and extensions.
- `LearningGuide`: structured sections, checklist, and related IDs.
- `InterviewQuestion`: evaluation criteria, approach, STAR guidance, and common mistakes.

## Personalization

Until assessment-result persistence is connected, recommendation scores are deterministic catalog/service data selected by the user's profile mode. They must be isolated from JSX and clearly presented as guidance, not as live AI inference.

- `EXPLORE`: show ranked recommendations based on interests-and-strengths framing.
- `GOAL`: highlight the selected target career and current readiness framing.

Starting a roadmap is idempotent. It selects one career, initializes progress only when no matching progress exists, and navigates to My Roadmap. Starting the same roadmap again must not create a duplicate.

## User Learning State

User-specific learning state is stored separately from the static catalog:

```ts
interface UserLearningState {
  uid: string;
  selectedCareerId: string | null;
  roadmapId: string | null;
  currentStageId: string | null;
  completedSkillIds: string[];
  savedResourceIds: string[];
  startedAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
```

Firestore stores one document at `learningProgress/{uid}`. The document ID must match the authenticated UID. The frontend reads it once through a shared provider, updates local UI immediately around successful writes, and exposes recoverable errors without leaking raw Firebase messages. Profile deletion must also delete this learning-state document.

## Explore Careers

The page order is title, search, personalized recommendation, categories, and the full catalog. Search matches role names, categories, stack, and skills. Category controls use accessible tabs and may scroll horizontally on small screens.

Career cards expose only the decision-making metadata needed for comparison: role, summary, core stack, stage/skill counts, and match/readiness context. Career Detail owns the deeper content: responsibilities, fit reasoning, grouped core skills, roadmap preview, related projects, and start/open-roadmap action.

## My Roadmap

The first decision card is Current Focus. It identifies the current stage, explains why the stage matters, shows skill progress, and links to contextual resources. Up Next remains compact. The full path is a responsive vertical stage accordion, never a wide graph.

Every skill includes:

- Essential, Recommended, or Optional priority.
- A concise description.
- Why it matters.
- Practical learning objectives.
- Curated resources.
- A practice project when available.
- Completion control and contextual Way Assistant action.

Stage state and progress must include text/icon cues in addition to color.

## Learning Resources

The page prioritizes current needs before the catalog:

1. Recommended for You.
2. Current Roadmap Stage.
3. Continue Learning.
4. Projects.
5. Guides.
6. Interview Prep.
7. Browse All.

Search and type, role, level, and skill filters use URL search parameters so refresh, Back, and deep links preserve context. Desktop uses compact controls; mobile uses a focus-trapped Sheet.

Saving a resource updates only the user's `savedResourceIds`. Opening external resources uses safe new-tab behavior. Empty and error states explain the next action.

## Projects, Guides, and Interview Prep

Project Detail connects proof back to learning. It includes skills proved, deliverables, learning outcomes, a simple CSS/SVG architecture flow, ordered build-step accordion, extensions, related roadmap skills, and an assistant prompt.

Guide Detail uses a readable article structure with breadcrumb, summary, table of contents, sections, checklist, and related links.

Interview Prep uses Behavioral, Technical, System Design, and Role Specific tabs. Behavioral practice explains what is evaluated, an original approach, STAR structure, common mistakes, and a private local practice textarea. Practice text is not persisted unless a future spec explicitly adds it.

## Assistant Context

Context actions navigate to `/app/assistant?prompt=...`. The Assistant reads the prompt parameter into the composer but does not auto-send. The prompt is removed from the URL after it is consumed so refresh does not repeatedly replace in-progress text.

## Component and Motion Rules

Use existing shadcn primitives for cards, buttons, badges, input, tabs, progress, accordion, checkbox, select, sheet, breadcrumb, and skeletons. Add no duplicate primitives.

Magic UI is limited to the verified local Border Beam and Number Ticker implementations. Only the main recommendation or Current Focus may use a Border Beam in a viewport. Reduced motion shows a static border and final number.

Semantic tokens in `src/index.css` remain mapped to TheWay's near-black, navy, violet, lavender, and cool-gray palette. The authenticated star field uses lower density than landing and assistant surfaces.

## Localization and Accessibility

All new interface labels and explanatory product copy must resolve through the existing English/Myanmar provider or localized static catalog fields. Technology names, provider names, and URLs remain untranslated.

Layouts must tolerate Myanmar wrapping without fixed-height text regions. All controls require visible focus, keyboard operation, semantic headings, accessible names, and correct expanded/current/progress state. Sheets and tabs rely on Radix focus and keyboard behavior. Decorative motion and diagrams are hidden from assistive technology when equivalent text is present.

## Acceptance Flows

- A new Explore learner can open a recommendation, start its roadmap, inspect the current skill, open filtered resources, open a project, complete the skill, and see progress update.
- A Goal learner sees a target-career treatment, current readiness, skill gaps, and directly related study/build actions.
- Opening `/app/resources?skill=sql-fundamentals` filters the catalog after refresh.
- A project can link back to its roadmap skill without losing the selected roadmap.
- English and Myanmar work across cards, badges, filters, accordions, detail pages, and mobile sheets.
- Firebase Auth restoration, profile routing, profile CRUD, and language persistence continue to behave as defined by the Firebase profile spec.

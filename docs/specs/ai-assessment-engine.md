# AI Assessment Engine Spec

## Purpose

The assessment engine selects the correct model, collects answers, scores the user, and returns a structured recommendation that can power charts, roadmaps, resources, and chatbot context.

## Model Selection

- `exploring`: use the beginner model for users who are still choosing a tech field.
- `goal-oriented`: use the experienced learner model for users with prior IT study or a target area.

## Beginner Model

The beginner model should use around 10 non-technical questions. It must focus on personality, work preferences, problem-solving style, motivation, communication, creativity, logical comfort, and appetite for abstract systems.

Expected fields to score:

- Frontend Development
- Backend Development
- UI/UX Design
- Data Analytics
- Cybersecurity
- Cloud or DevOps

Output must include field fit percentages, top recommendation, secondary options, reasoning, and beginner roadmap seed data.

## Experienced Learner Model

The experienced model evaluates skill inventory and honest self-assessment. It should ask about programming languages, projects, debugging, APIs, databases, frontend, backend, deployment, tooling, and career constraints.

Output must include target role, confidence score, skill gaps, current level, roadmap stages, and recommended resources.

## Output Contract

Every completed assessment should return:

- `modelType`
- `answers`
- `fitScores`
- `recommendedPath`
- `reasoning`
- `roadmapSeed`
- `resourceTags`

## Quality Rules

- Questions must be understandable without coaching.
- Scores must total or normalize consistently for charts.
- Reasoning must reference user answers.
- The system should allow retakes without deleting previous results.

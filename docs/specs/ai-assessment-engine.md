# AI Assessment Engine Spec

## Purpose

The assessment engine selects the correct model, collects answers, scores the user, and returns a structured recommendation that can power charts, roadmaps, resources, and chatbot context.

## Model Selection

- `exploring`: use the beginner model for users who are still choosing a tech field.
- `goal-oriented`: use the experienced learner model for users with prior IT study or a target area.

## Beginner Model

The current Explore Careers Model 1 flow uses exactly 11 questions:

1. Zodiac sign, with one button for each of the 12 signs.
2. MBTI group.
3. Preferred source of energy.
4. Social personality.
5. Through 11. Scenario-based role choices.

Each answer advances automatically after about 225 ms. The final answer stays selected until the user submits. Users can go back and change prior answers. Keep the option copy and ordering in `src/data/explorationQuiz.ts` aligned with the backend contract.

The quiz card offers an English/Myanmar display toggle. Myanmar copy is for display only: submit the canonical English option value for each of the first four answers and keep the seven scenario answers as zero-based option indices. Zodiac choices are individual sign names (for example, `Aries`), not translated values or grouped signs. The payload is:

```json
{
  "zodiac": "string",
  "mbti": "string",
  "energy": "string",
  "personality_type": "string",
  "role_choices": [0, 1, 2, 3, 4, 0, 1]
}
```

Submit this payload to `/quiz/submit` through the assessment service. The API base URL comes from `VITE_QUIZ_API_URL`, defaulting to `http://127.0.0.1:8000`. Do not calculate recommendations in the quiz component.

Assessment questions should remain understandable without coaching and focus on personality, work preferences, problem-solving style, motivation, communication, creativity, logical comfort, and appetite for abstract systems.

For each scenario question, option indices map consistently to the backend scoring channels: `0` software engineering/backend, `1` UI/UX/frontend, `2` data science/AI, `3` cybersecurity/QA, and `4` cloud/DevOps/systems/IoT.

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

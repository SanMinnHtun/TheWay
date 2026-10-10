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

The quiz card offers an English/Myanmar display toggle. Quiz selections are kept in their English UI form, then adapted at the API boundary to the current backend schema: individual zodiac signs are grouped into the backend's accepted zodiac groups, MBTI is sent as one of its accepted English enum strings, energy and personality selections are mapped to their currently accepted backend option strings, and the seven scenario answers remain zero-based integer indices. The submitted payload is:

```json
{
  "zodiac": "string",
  "mbti": "string",
  "energy": "string",
  "personality_type": "string",
  "role_choices": [0, 1, 2, 3, 4, 0, 1]
}
```

Submit this payload to `/quiz/submit` through the assessment service. In local development, leave `VITE_QUIZ_API_URL` empty to use the Vite proxy to `http://127.0.0.1:8000`. For production, set `VITE_QUIZ_API_URL` to the deployed backend's HTTPS origin at build time. The backend must allow the deployed frontend origin in its CORS policy (including the `POST` method and `Content-Type` header), or be exposed through a same-origin production reverse proxy. Do not use a localhost URL in production and do not calculate recommendations in the quiz component. Non-success responses are logged with status and parsed response detail in the browser console.

While the request is pending, show the Model 1 loading video from `src/assets/model1-loading.mp4`. The current FastAPI response contract is `primary_recommendation`, `runner_up`, and `all_role_percentages`, where each role match has a `role` and numeric `percentage`. Render the returned rankings with a donut and score bars, and expose all matches in a scrollable side sheet. Do not substitute locally generated assessment scores for the backend response.

The result's next-step action may start the matching static career-catalog roadmap through the learning-progress service; map only known result role names to catalog career IDs. This roadmap is the catalog learning path for the recommended role, not a generated backend roadmap.

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

The Model 2 assessment loads its ten Burmese questions and five option values per question from `GET /api/v1/career/questions` at runtime. It submits `{ "answers": [10 zero-based option values in Q1 to Q10 order] }` to `POST /api/v1/career/predict`; each value is an integer from 0 to 4. During local development and same-origin deployment, `/api/model2/questions` and `/api/model2/predict` proxy to the backend. Set `VITE_MODEL2_API_URL` to the backend origin to call it directly (and enable CORS there). For direct mobile testing, use `http://10.0.2.2:8001` from an Android emulator, `http://localhost:8001` from an iOS simulator, or `http://<computer-LAN-IP>:8001` from a physical device. The Vite development server binds to all interfaces for LAN access. The result response contains `predicted_role`, `confidence` (0 to 1), and `probabilities` (role-to-probability map); render the API role names and percentage values as supplied.

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

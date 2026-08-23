# Data Model Spec

## UserProfile

Stores identity and personalization data.

Fields:

- `id`
- `name`
- `dateOfBirth`
- `gender`
- `occupation`
- `track`
- `createdAt`
- `updatedAt`

## AssessmentResult

Stores a completed assessment and generated recommendation.

Fields:

- `id`
- `userId`
- `modelType`
- `answers`
- `fitScores`
- `recommendedPath`
- `reasoning`
- `createdAt`

Rules:

- A user can have many assessment results.
- Results are immutable after completion except for metadata corrections.
- Retakes create new results.

## Roadmap

Stores a generated learning plan.

Fields:

- `id`
- `userId`
- `assessmentResultId`
- `title`
- `targetRole`
- `stages`
- `saved`
- `createdAt`
- `updatedAt`

Rules:

- A roadmap must reference the assessment result that produced it.
- Roadmap stages should be ordered and measurable.

## LearningResource

Stores curated learning material mapped to roadmap stages.

Fields:

- `id`
- `roadmapStageId`
- `title`
- `provider`
- `format`
- `difficulty`
- `estimatedTime`
- `url`

Rules:

- Resources must attach to a stage, not only to a roadmap.
- Difficulty should match the user's current level and roadmap stage.

## ChatSession

Stores AI assistant history.

Fields:

- `id`
- `userId`
- `roadmapId`
- `messages`
- `createdAt`
- `updatedAt`

Rules:

- Chat responses should use the selected roadmap and latest assessment context by default.

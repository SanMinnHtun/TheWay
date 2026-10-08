# Data Model Spec

## UserProfile

Stores identity and personalization data.

Fields:

- `uid`
- `email`
- `displayName`
- `photoURL`
- `dateOfBirth`
- `gender`
- `currentStatus`
- `mode`
- `language`
- `onboardingCompleted`
- `createdAt`
- `updatedAt`

Rules:

- User profiles are stored at `users/{uid}` in Firestore.
- A user has exactly one main profile document.
- The profile document ID must match the Firebase Authentication UID.
- Profile creation must not overwrite an existing completed profile.
- `mode` is `EXPLORE` or `GOAL`.
- `language` is `en` or `my`.

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

## Personalized Model 2 Roadmap

Stores the user's editable top-match roadmap.

Fields:

- `roleTitle`
- `matchPercentage`
- `stages` (including editable skills and their statuses)
- `lastSaved`
- `updatedAt`

Rules:

- Store one personalized roadmap per user at `users/{uid}/saved_data/roadmap`.
- Generate its initial role from the highest Model 2 probability.
- Read Firestore before the local cache; keep a LocalStorage fallback for offline or unauthenticated use.
- Roadmap edits sync to the user's document and may be overwritten only by that same user's changes.

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

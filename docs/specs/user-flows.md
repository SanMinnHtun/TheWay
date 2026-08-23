# User Flows Spec

## Landing Flow

The landing page introduces The Way and presents two primary actions:

- `Start Exploring`: for users who are new to tech and need field discovery.
- `Build My Roadmap`: for users who already have a goal or IT study background.

The selected action should carry into onboarding as the user's default track.

## Profile Creation Flow

Users provide name, date of birth, gender, occupation, and track. The profile step should be short and should not block users with optional details during first-run onboarding.

Required outcome:

- User profile exists.
- Track is selected.
- User can continue directly into the correct assessment.

## Beginner Assessment Flow

Used for `I'm Still Exploring`.

1. Ask non-technical questions about motivation, work style, creativity, logic, communication, and comfort with ambiguity.
2. Calculate fit percentages across IT fields.
3. Explain the strongest matches in plain language.
4. Generate a beginner roadmap with first steps and resources.

## Experienced Learner Flow

Used for `I Know My Goal`.

1. Ask about programming background, tools, projects, strengths, weaknesses, and career goals.
2. Identify a target developer role.
3. Calculate confidence and skill gaps.
4. Generate a role-specific roadmap and resources.

## Dashboard Flow

The dashboard shows the latest recommendation first. It should include charts, roadmap stages, resource links, saved roadmap actions, assessment history, and AI assistant access.

## Return User Flow

Returning users should resume from the dashboard. They can review saved roadmaps, continue learning, retake an assessment, or ask the AI assistant follow-up questions.

# User Flows Spec

## Landing Flow

The landing page introduces The Way and presents two primary actions:

- `Start Exploring`: for users who are new to tech and need field discovery.
- `Build My Roadmap`: for users who already have a goal or IT study background.

The selected action should carry into onboarding as the user's default track.

## Profile Creation Flow

Users provide name, date of birth, gender, occupation, and track. The profile step should be short and should not block users with optional details during first-run onboarding.

Required outcome:

- User profile exists at `users/{firebaseAuthUid}`.
- Track is selected.
- User can continue directly into the correct assessment.
- Completed users should not be sent through profile setup again.

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
5. Keep probability-ranked tracks and the active role in app-wide state. `Open Your Roadmap` opens an interactive modal, while the sidebar route shows the same roadmap as a full page with a selector for other predicted roles.

## Dashboard Flow

The dashboard shows the latest recommendation first. It should include charts, roadmap stages, resource links, saved roadmap actions, assessment history, and AI assistant access.

## Authenticated App Shell Flow

This is the temporary post-profile destination while the full dashboard and assessment logic are still being built.

1. User completes profile setup.
2. User lands at `/app/explore`.
3. User sees the persistent app shell and a guided Explore Careers preview with search, recommendations, and next-step actions.
4. `Start Exploring` opens the 11-question exploration assessment. Each answer advances automatically; users can go back to revise answers, and the final answer is submitted to the configured `/quiz/submit` API. Show the loading animation until the API responds, then display the ranked career matches and a scrollable side sheet for all scores.
5. From the result page, the learner can start the local catalog roadmap corresponding to a recognized top career match.
6. `Build My Roadmap` opens the 10-question experienced learner assessment at `/app/assessment/goal`. Answers are 10 integers from 0 to 4; changing English/Myanmar labels never changes the submitted values. On success, show the predicted role, confidence, all nine sorted probabilities, a roadmap modal action, and a retake action.
7. User can navigate client-side between Explore Careers, My Roadmap, Learning Resources, Way Assistant, and Settings.
8. Way Assistant remains available at `/app/assistant` with its mock welcome message, suggested prompts, and message composer.
9. A Model 2 result opens the highest percentage role's editable roadmap. My Roadmap checks the user's Firestore roadmap first and displays it when present; otherwise it uses the current top-match roadmap, then falls back to the existing selected catalog roadmap. Roadmap edits sync to Firestore and keep a LocalStorage fallback.

## Return User Flow

Returning users should resume from the dashboard. They can review saved roadmaps, continue learning, retake an assessment, or ask the AI assistant follow-up questions.

For the current authenticated shell phase, returning users with restored Firebase sessions and complete Firestore profiles should be routed directly to `/app/explore`.

Returning users must not see the Google sign-in card or profile setup again unless they explicitly signed out, lost authentication, or deleted their profile.

# Feature Contracts Spec

## Assessment Contract

Inputs:

- User profile
- Selected track
- Assessment answers

Outputs:

- Fit scores
- Recommended field or role
- Reasoning
- Roadmap seed
- Resource tags

The assessment feature owns question flow, answer validation, scoring request, and result handoff to the dashboard.

## Roadmap Contract

Inputs:

- Assessment result
- User profile
- Resource tags

Outputs:

- Ordered roadmap stages
- Milestones
- Skill gaps
- Suggested projects
- Linked resources

Roadmap stages should be specific enough to guide weekly learning decisions.

## Resource Contract

Inputs:

- Roadmap stage
- User level
- Target role or field

Outputs:

- Resource title
- Provider
- Format
- Difficulty
- Estimated time
- URL

Resources must be relevant to the exact stage and avoid generic course dumps.

## Profile Contract

Inputs:

- Firebase Authentication UID
- Email
- Display name
- Date of birth
- Gender
- Current status
- Mode
- Language
- Preferences

Outputs:

- Personalized onboarding
- Assessment context
- Dashboard context

Profile changes should not rewrite previous assessment results.

Profile storage is one document per user at `users/{uid}`. The profile feature owns create, read, update, and profile deletion operations through the profile service boundary.

## AI Assistant Contract

Inputs:

- User profile
- Latest or selected assessment
- Current roadmap
- User message

Outputs:

- Context-aware answer
- Suggested next action
- Optional roadmap or resource reference

The assistant should explain roadmap steps, answer learning questions, and avoid unsupported claims about guaranteed jobs or outcomes.

## Authenticated App Shell Contract

Inputs:

- Authenticated user identity or frontend mock user.
- Current route.
- Local UI state for sidebar collapse, mobile drawer, prompt selection, and mock assistant messages.

Outputs:

- Persistent app navigation shell.
- Active route state with `aria-current="page"`.
- Fully designed Way Assistant frontend surface.
- Skeleton shells for resources, careers, roadmap, and settings.

The app shell must not require backend data for this phase. It should preserve future integration points without embedding roadmap, resource, or assistant inference logic inside layout components.

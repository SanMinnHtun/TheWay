# System Architecture Spec

## Current Application

The current codebase is a Vite + React + TypeScript frontend. It should remain modular enough to support future backend services for authentication, persistence, AI inference, and resource curation.

## Logical Layers

## Presentation Layer

React components render landing, onboarding, assessment, dashboard, roadmap, resource, and chat experiences. Components should receive typed data through props and keep visual state separate from domain scoring logic.

The authenticated app shell should be built from reusable presentation components such as app layout, sidebar navigation, assistant header, chat messages, prompt chips, composer, page header, and skeleton placeholders. The shared canvas star background should be reused rather than duplicating animation systems.

## Domain Layer

Assessment scoring, roadmap generation, role matching, and resource mapping should live outside page components. Use typed functions or service modules so the logic can later move behind an API without changing the UI contract.

## Data Access Layer

The frontend should eventually call backend endpoints for profiles, assessment results, roadmaps, resources, and chat sessions. Until a backend exists, use local mock data behind the same typed interfaces expected from the API.

## AI Integration Boundary

AI calls should be isolated behind service functions. UI components should never construct raw prompts directly. The service boundary should accept normalized user profile, answers, and latest roadmap context, then return structured output.

The current Way Assistant UI phase is mock-only. Local UI state may create temporary messages and prompt interactions, but any future networked assistant behavior must route through a chat service boundary.

## Expected Future Services

- Auth service: account creation, login, session refresh.
- Profile service: demographic details and preferences.
- Assessment service: answer submission, scoring, result storage.
- Roadmap service: roadmap generation and saved roadmap retrieval.
- Resource service: curated resources by roadmap stage.
- Chat service: assistant messages grounded in user context.

## Architecture Rules

- Keep domain types shared across UI and service boundaries.
- Validate assessment output before rendering charts or roadmaps.
- Treat AI responses as untrusted structured data until parsed and checked.
- Do not store secrets or AI provider keys in frontend environment variables.

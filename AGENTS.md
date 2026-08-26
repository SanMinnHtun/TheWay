# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React + TypeScript application. Source code lives in `src/`: `main.tsx` mounts React, `App.tsx` owns top-level routing and page composition, and reusable UI belongs in `src/components/`. Static images and similar assets live in `src/assets/`. Build and tool configuration stays at the repository root, including `vite.config.ts`, `tailwind.config.ts`, `postcss.config.cts`, and `tsconfig.json`.

Product and engineering specs live in `docs/specs/`. Read the relevant spec before changing behavior, data shape, AI assessment logic, onboarding, dashboard, or roadmap generation.

## Spec-First Development

Use the specs as the source of truth for product decisions:

- `docs/specs/product-requirements.md`: goals, audience, scope, and acceptance criteria.
- `docs/specs/system-architecture.md`: frontend boundaries, backend expectations, and integration shape.
- `docs/specs/user-flows.md`: landing, onboarding, assessment, dashboard, and return-user flows.
- `docs/specs/ai-assessment-engine.md`: beginner and experienced learner model behavior.
- `docs/specs/data-model.md`: domain entities, relationships, and persistence rules.
- `docs/specs/feature-contracts.md`: feature responsibilities and handoff contracts.
- `docs/specs/design.md`: authenticated app shell, assistant UI, theme, responsive behavior, motion, and accessibility.
- `docs/specs/firebase-profile-and-localization.md`: Firebase Spark profile CRUD, auth/profile routing, Firestore rules, profile UI, and English/Myanmar localization.

If implementation needs to diverge from a spec, update the spec in the same pull request and explain why.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite server on `127.0.0.1`.
- `npm run typecheck`: validate TypeScript without emitting files.
- `npm run build`: run TypeScript checks and build production assets into `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Component files use PascalCase, such as `ProfileSetup.tsx`; helpers and variables use camelCase. Prefer explicit types for profile data, assessment answers, fit scores, roadmaps, and resource metadata. Use Tailwind utilities for component styling and keep global CSS limited to `src/index.css`.

## Testing Guidelines

No automated test framework is configured yet. Before submitting changes, run `npm run typecheck` and `npm run build`. When tests are added, colocate them near the covered code using names like `ProfileSetup.test.tsx`; Vitest and Testing Library are the expected fit for this stack.

## Commit & Pull Request Guidelines

Follow the existing conventional commit style: `type: concise imperative summary`, for example `build: configure TypeScript compiler` or `refactor: migrate React source to TypeScript`.

Pull requests should include a short summary, linked issues when available, verification commands, screenshots for UI changes, and notes for spec, dependency, or configuration updates.

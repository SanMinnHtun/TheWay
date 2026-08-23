# Product Requirements Spec

## Product Summary

The Way is an AI-driven career guidance and roadmap platform for aspiring tech professionals. It evaluates a user's background, personality, skill level, and goals, then returns a practical learning direction with roadmap steps, resources, and AI guidance.

## Target Users

- Absolute beginners who want to enter tech but do not know which field fits them.
- Students or career switchers who need structured guidance before committing to a path.
- Learners with some IT background who need a precise developer role and skill-gap plan.

## Core Problem

New tech learners often waste time switching between fields, tools, and courses without understanding which path matches their strengths or what to study next. The product must convert uncertainty into a clear, staged plan.

## Goals

- Provide two assessment paths: beginner exploration and goal-oriented roadmap generation.
- Produce explainable field or role recommendations with confidence or fit percentages.
- Generate staged roadmaps with learning resources mapped to each stage.
- Persist profile details, assessment history, saved roadmaps, and user preferences.
- Provide an AI assistant that uses user context instead of generic career advice.

## Non-Goals For MVP

- Job placement, recruiting, or resume scoring.
- Paid course marketplace logic.
- Full social networking features.
- Certification issuance.

## MVP Acceptance Criteria

- Landing page clearly exposes `Start Exploring` and `Build My Roadmap`.
- Profile creation captures name, date of birth, gender, occupation, and selected track.
- Each track loads a different assessment strategy.
- Assessment output includes fit score, recommendation, reasoning, roadmap, and resources.
- Dashboard shows the latest result and lets users access saved roadmaps and AI chat.

## Product Risks

- Recommendations may feel arbitrary unless reasoning is visible.
- Beginner questions must avoid technical jargon.
- Experienced-learner scoring must reward honest self-assessment over inflated answers.

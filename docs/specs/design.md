# Design Spec

## Purpose

This spec defines the authenticated main application visual system for The Way. It is the source of truth for app-shell layout, navigation, assistant UI, responsive behavior, motion, and accessibility.

The current implementation phase covers only the authenticated application skeleton and a fully designed Way Assistant frontend. Learning Resources, Explore Careers, My Roadmap, and Settings should exist as polished shells with skeleton placeholders until their product logic is implemented.

## Visual Direction

The authenticated app should feel like the same product as the landing and onboarding experience: deep space, near-black navy, dark purple surfaces, lavender accents, subtle atmospheric light, and a calm animated star field.

The reference screenshot is the visual source of truth for:

- Persistent desktop sidebar proportions.
- Dark neutral-purple sidebar surface.
- Top assistant header height and composition.
- Open assistant workspace with generous empty space.
- Initial AI message placement and styling.
- Suggested prompt chip placement.
- Bottom composer shape and position.
- Purple atmospheric lighting and subtle star density.

Do not redesign the authenticated UI into a generic SaaS dashboard or centered chat clone. Improvements should focus on responsiveness, accessibility, component quality, and subtle interaction polish.

## Routes

Authenticated app routes should live under `/app`:

- `/app/resources`: Learning Resources.
- `/app/explore`: Explore Careers.
- `/app/roadmap`: My Roadmap.
- `/app/assistant`: Way Assistant.
- `/app/settings`: Settings.

For this phase, `/app/assistant` is the default authenticated destination after profile setup.

## App Shell

Desktop layout uses a fixed left sidebar and flexible main workspace.

Recommended dimensions:

- Expanded sidebar: about `268px`.
- Collapsed sidebar: about `76px`.
- Assistant header: `88px` to `102px`.
- Main workspace horizontal padding: `24px` to `34px` on desktop.
- Mobile workspace horizontal padding: `16px`.

The main app shell should preserve a large open conversation area. Avoid filling the workspace with dashboard widgets, cards, charts, or marketing-style hero content.

## Sidebar

Sidebar background should be a dark charcoal-purple surface, conceptually near `#303039`, visually distinct from the star background.

Sidebar structure:

- Brand header: `The Way` in bold lavender/violet.
- Collapse control on the right for desktop/tablet.
- User identity row with circular avatar and display name.
- Main navigation in this exact order:
  - Learning Resources.
  - Explore Careers.
  - My Roadmap.
  - Way Assistant.
- Bottom navigation:
  - Settings.
  - Sign Out.

Navigation behavior:

- Active item uses a subtle blue-purple tinted background, thin lavender border, lavender icon, and white text.
- Inactive items use transparent backgrounds, light text, and lavender icons.
- Hover state should slightly brighten the background and translate the item horizontally by about `2px`.
- Collapsed state should show icons only and expose accessible labels through tooltips or `aria-label`.
- Use `aria-current="page"` for the active route.

## Background

Reuse the existing canvas star background instead of creating a separate star system.

Recommended relative intensity:

- Landing: 100%.
- Way Assistant: 55% to 70%.
- Other authenticated skeleton pages: 20% to 30%.

The authenticated background should include:

- Deep navy / near-black base.
- Subtle moving far, mid, and near stars.
- Purple atmospheric illumination from the left.
- Purple illumination from the lower-right.
- Cursor-responsive parallax on desktop only.

Decorative background elements must be `aria-hidden`.

## Way Assistant Header

The assistant header uses a semi-transparent dark purple/navy surface with a subtle bottom border.

Content:

- Circular purple assistant avatar, about `44px` to `52px`.
- White sparkle/star icon inside the avatar.
- Small green online indicator at the avatar bottom-right.
- Title: `The Way`.
- Subtitle: `Your AI Career Guide · Online`.

The header should feel connected to the sidebar while slightly elevated from the main workspace.

## Conversation Area

The initial assistant view should contain:

- One mock assistant message near the upper-left.
- A large empty conversation region.
- Suggested prompt chips near the bottom.
- A bottom composer anchored inside the app workspace.

Initial assistant message copy:

```text
Hi [Name]! I'm The Way - your AI career guide.

I can help you understand your roadmap, explore career paths, find learning resources, review your progress, or explain what you should learn next.

What would you like to explore today?
```

Assistant message layout:

- Avatar on the left, about `36px` to `40px`.
- Bubble max width: `620px` to `720px`.
- Bubble padding: `14px` to `18px`.
- Border radius: about `16px`.
- Dark translucent surface.
- Thin lavender border.
- Small muted timestamp below.

Prepare a reusable `ChatMessage` component for both assistant and future user messages:

- Assistant messages align left and use a dark bordered surface.
- User messages align right and use a purple-tinted surface.

## Suggested Prompt Chips

Use horizontal pill chips with transparent/dark background, thin lavender border, and muted text.

Recommended prompts:

- `What should I learn next?`
- `Explore careers for me`
- `Review my roadmap progress`
- `Best resources for my next skill`
- Optional: `Explain my current milestone`

Behavior for this phase:

- Clicking a prompt may populate the composer or add a local mock user message.
- Do not implement real AI or persistence.

Interaction:

- Hover slightly brightens background and border.
- Hover text becomes white.
- Hover translates upward by about `1px`.
- Pressed state scales to about `0.98`.

## Message Composer

The composer should visually match the reference screenshot: a large dark rounded container nearly spanning the available workspace width.

Structure:

- Transparent text input with accessible label.
- Placeholder: `Ask The Way anything...`.
- Purple send button with paper-plane icon.
- Small centered footer text: `The Way · AI responses are for career guidance only`.

Composer rules:

- Keep it anchored to the bottom without overlapping conversation content.
- Use a dark elevated surface, slightly lighter than the page.
- Use subtle border treatment.
- Remove default browser outlines and provide a custom visible focus state.
- Send button should support hover, pressed, and disabled states.
- On mobile, account for `safe-area-inset-bottom`.

## Skeleton Pages

Learning Resources:

- Header: `Learning Resources`.
- Copy: `Curated resources for your roadmap.`
- Skeleton sections for search/filter, recommended resources, and continue learning.

Explore Careers:

- Header: `Explore Careers`.
- Copy: `Discover career paths that match your interests and strengths.`
- Skeleton sections for search, recommended careers, and career categories.

My Roadmap:

- Header: `My Roadmap`.
- Copy: `Your personalized path, one milestone at a time.`
- Skeleton sections for overall progress, current milestone, and roadmap timeline.

Settings:

- Header: `Settings`.
- Copy: `Manage your profile, preferences, account, and appearance.`
- Skeleton tabs or cards for Profile, Preferences, Account, and Appearance.

Do not use plain "Coming soon" pages as the primary placeholder pattern.

## Responsiveness

Desktop, about `1100px` and wider:

- Persistent expanded sidebar by default.
- Optional collapsed icon-only state.
- Main content keeps screenshot-like proportions.

Tablet, about `768px` to `1099px`:

- Use compact collapsible sidebar or drawer behavior so content is not crushed.

Mobile:

- Do not keep the desktop sidebar permanently visible.
- Use a top app header with a slide-in sidebar drawer.
- Keep assistant message nearly full width.
- Suggested prompts may horizontally scroll.
- Composer remains reachable with sticky bottom behavior.

Target QA widths:

- `320px`, `360px`, `375px`, `390px`, `414px`, `430px`.
- `768px`, `820px`, `1024px`.
- `1280px`, `1366px`, `1440px`, `1536px`, `1920px`.

## Motion

Motion should be subtle and complete quickly.

Recommended entrance animations:

- Sidebar: opacity `0` to `1`, translateX `-10px` to `0`.
- Header: opacity and translateY `-6px` to `0`.
- Welcome message: opacity `0` to `1`, translateY `12px` to `0`.
- Prompt chips: small stagger.
- Composer: opacity and translateY `10px` to `0`.

Page transitions between authenticated routes:

- Opacity `0` to `1`.
- translateY `6px` to `0`.
- Duration `180ms` to `260ms`.

Respect `prefers-reduced-motion: reduce` by disabling or reducing star motion, cursor parallax, translate animations, and sidebar sliding.

## Accessibility

Requirements:

- Use semantic `nav`, `header`, `main`, `button`, and form controls.
- Provide `aria-current="page"` for active navigation.
- Keep icon-only controls labeled with `aria-label`.
- Provide visible focus indicators.
- Keep contrast adequate on dark purple surfaces.
- Keep decorative stars and glows hidden from assistive technology.
- Avoid text overlap at all supported widths.
- Preserve keyboard navigation for sidebar, drawer, prompt chips, input, and send action.

## Component Guidance

Recommended reusable components:

- `AppShell`
- `Sidebar`
- `SidebarItem`
- `AssistantHeader`
- `ChatMessage`
- `PromptChip`
- `ChatComposer`
- `PageHeader`
- `Skeleton`
- `SkeletonCard`

Keep assistant data local and mock-only for this phase. Future AI integration should live behind a service boundary rather than inside UI components.

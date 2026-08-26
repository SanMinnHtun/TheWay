# Firebase Profile and Localization Spec

## Purpose

This spec defines the Firebase Spark compatible profile, returning-user routing, profile CRUD, and language preference behavior for The Way.

The core requirement is that a user signs in with Google once, creates one TheWay profile at `users/{uid}`, and then returns directly to the authenticated app while Firebase Authentication still restores their session.

## Firebase Products

Use Spark compatible Firebase products:

- Firebase Authentication with Google.
- Cloud Firestore client SDK.
- Firestore Security Rules.
- Firebase Hosting if the project is deployed through Firebase Hosting.
- Firebase CLI project configuration.

Do not introduce Cloud Functions, Admin SDK credentials, paid server infrastructure, or backend services for profile CRUD.

## Firestore Profile Document

Each authenticated user has exactly one profile document:

```text
users/{firebaseAuthUid}
```

Never create profile documents with random IDs.

Profile shape:

```ts
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  gender?: "male" | "female" | "other";
  dateOfBirth?: {
    day: number;
    month: number;
    year: number;
  };
  currentStatus?: string;
  mode: "EXPLORE" | "GOAL";
  language: "en" | "my";
  onboardingCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`mode` maps from the existing onboarding track:

- `exploring` maps to `EXPLORE`.
- `goal-focused` maps to `GOAL`.

## User State

The app must distinguish Firebase Authentication state from Firestore profile state:

```ts
type UserState =
  | "loading"
  | "unauthenticated"
  | "authenticated-no-profile"
  | "authenticated-profile-complete";
```

Firestore profile read failures are not the same as a missing profile. Permission, unavailable, and network failures should show a recoverable error state instead of routing users to profile setup.

## App Boot

On app load:

1. Subscribe to Firebase Auth.
2. If no user exists, expose unauthenticated state.
3. If a user exists, load `users/{uid}` once.
4. If the document is missing, route first-time or incomplete users to profile setup.
5. If the document exists and `onboardingCompleted === true`, route to the authenticated app.

Avoid unnecessary realtime listeners and repeated profile reads on every page mount. A normal profile fetch plus centralized in-memory state is sufficient for this phase.

## Route Guards

Use reusable guards:

- `RequireAuth`: no Firebase user redirects to `/auth`.
- `RequireProfile`: no Firebase user redirects to `/auth`; Firebase user without complete profile redirects to `/profile-setup`; complete profile renders the authenticated app.
- `PublicOnlyRoute`: returning users with complete profiles are redirected away from `/auth` and inappropriate `/profile-setup` visits.

Required routing:

- `/auth`: completed authenticated users redirect to `/app/assistant` without showing the Google sign-in card first.
- `/profile-setup`: completed authenticated users redirect to `/app/assistant`.
- `/app/*`: unauthenticated users redirect to `/auth`; authenticated users without complete profile redirect to `/profile-setup`.

## Landing CTA Routing

Landing actions still preserve the selected track for first-time onboarding. If Firebase already has an authenticated user with a completed profile, landing CTAs should route directly to `/app/assistant` and should not force Google sign-in again or overwrite the stored profile mode.

## Profile CRUD

Profile services should live behind a dedicated service boundary:

```ts
interface ProfileService {
  getProfile(uid: string): Promise<UserProfile | null>;
  createProfile(uid: string, data: CreateProfileInput): Promise<void>;
  updateProfile(uid: string, data: UpdateProfileInput): Promise<void>;
  deleteProfile(uid: string): Promise<void>;
}
```

Create:

- Use `setDoc(doc(db, "users", uid), data)`.
- Use server timestamps.
- Check whether the document exists before creating.
- Do not blindly overwrite a completed profile.

Read:

- Load centrally through auth/profile context.
- Reuse cached profile state across pages.

Update:

- Use `updateDoc`.
- Update only editable fields.
- Always update `updatedAt`.
- Do not allow editing `uid`, email, or `createdAt`.

Delete:

- Delete `users/{uid}` only.
- Sign the user out after deletion.
- Do not delete the Firebase Authentication account in this phase.

## Profile UI

Add:

- `/app/profile`: profile details page.
- `/app/profile/edit`: edit profile page.

The sidebar avatar/name row should navigate to `/app/profile`.

Profile details should display:

- Google photo or initials fallback.
- Display name.
- Email.
- Career path.
- Date of birth.
- Gender.
- Current status.
- Created and updated timestamps.

Edit profile should allow updating:

- Display name.
- Date of birth.
- Gender.
- Current status.

## Settings

Settings must include:

- Profile: links to view/edit profile.
- Language: English and Myanmar preference.
- Account: sign out and danger-zone profile deletion.

Profile deletion requires a confirmation modal where the user types `DELETE`.

## Localization

Supported language codes:

- `en`: English.
- `my`: Myanmar.

Language resolution order:

1. Firestore profile language.
2. `localStorage`.
3. English.

Language changes should:

1. Update the UI immediately.
2. Persist to `localStorage`.
3. Persist to `users/{uid}.language` when authenticated with a profile.

Do not scatter language ternaries through components. Use a centralized translation dictionary and hook/provider.

Translate at minimum:

- Sidebar labels.
- Way Assistant static UI.
- Skeleton page headers/copy.
- Profile view/edit.
- Settings sections.
- Language controls.
- Buttons.
- Loading states.
- Error messages.
- Confirmation modal text.
- Sign out.

User names, emails, technology names, and future course/career data do not need automatic translation.

Myanmar copy must use Unicode Myanmar text and flexible line heights. Avoid fixed-height text containers that break when Myanmar labels wrap.

## Security Rules

Firestore rules must enforce profile ownership. A user can only read, create, update, or delete `users/{uid}` where `request.auth.uid == uid`.

Rules should also validate that profile documents contain the authenticated UID and that updates cannot change immutable identity fields such as `uid`, `email`, and `createdAt`.

Never use `allow read, write: if true`.

## Firebase CLI Files

The repository should include:

- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`

Do not hardcode private credentials. Firebase client config must come from Vite environment variables.

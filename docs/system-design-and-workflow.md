# TheWay System Design and Workflow

This page summarizes the current application architecture and the main learner journey. The Mermaid diagrams can be viewed in VS Code with a Mermaid preview extension, or copied into a Notion code block set to Mermaid.

## System design

```mermaid
flowchart TB
    Learner["Learner"] --> Web["TheWay web app<br/>Vite · React · TypeScript"]

    subgraph Browser["Browser application"]
        Web --> UI["Pages and UI components"]
        UI --> Domain["Domain logic<br/>assessments · role matching · roadmap selection"]
        UI --> Services["Typed service modules"]
        Services --> AuthState["Auth and profile context"]
    end

    AuthState <--> FirebaseAuth["Firebase Authentication<br/>Google sign-in"]
    Services <--> Firestore["Cloud Firestore<br/>profiles · results · roadmaps"]
    Firestore -. "Security Rules: user owns own data" .-> FirebaseAuth

    Services -->|"HTTPS chat request + Firebase ID token"| AssistantFunction["assistantChat HTTPS function<br/>verify token · validate context"]
    AssistantFunction -->|"server-side secret"| OpenRouter["OpenRouter<br/>Gemini 2.5 Flash"]
    OpenRouter --> AssistantFunction
    AssistantFunction --> Services

    Services -. "Assessment API when configured" .-> AssessmentAPI["/quiz/submit API"]
    Services -. "Roadmap fallback" .-> LocalStorage["Browser LocalStorage"]
    UI -. "Planned: authenticated user identity + onboarding events" .-> Userflow["Userflow.io<br/>in-app tours and guides"]
```

### Main boundaries

- React pages render the experience and call typed services.
- Assessment and roadmap logic stays behind domain/service boundaries rather than being mixed into UI components.
- Firebase Authentication provides Google sign-in. Firestore stores the user's profile and learning data, protected by ownership rules.
- Assistant requests pass through a server function. The model provider key stays server-side and is never put in Vite client environment variables.
- Assessment submission calls `/quiz/submit`; roadmap data can use Firestore with a LocalStorage fallback.
- Userflow.io is shown as a planned integration for guided onboarding. It requires a Userflow environment token and should identify users only after Firebase authentication.

## Learner workflow

```mermaid
flowchart TD
    Landing["Landing page"] --> Choose{"Choose a path"}
    Choose -->|"Start Exploring"| ExploreTrack["Exploration track"]
    Choose -->|"Build My Roadmap"| GoalTrack["Goal-based track"]
    ExploreTrack --> Auth["Google sign-in via Firebase"]
    GoalTrack --> Auth
    Auth --> ProfileCheck{"Profile complete?"}
    ProfileCheck -->|"No"| Setup["Create profile and save track"]
    ProfileCheck -->|"Yes"| App["Open authenticated app"]
    Setup --> App
    App --> Explore["Explore Careers"]
    App --> Roadmap["My Roadmap"]
    App --> Resources["Learning Resources"]
    App --> Assistant["Way Assistant"]
    App --> Settings["Settings"]

    Explore --> StartExplore["Answer 11 exploration questions"]
    StartExplore --> SubmitExplore["Submit answers to /quiz/submit"]
    SubmitExplore --> Matches["Review ranked career matches"]
    Matches --> Roadmap

    App --> StartGoal["Answer 10 goal-based questions"]
    StartGoal --> GoalResult["Review predicted role and probabilities"]
    GoalResult --> Roadmap
    Roadmap --> Save["Save or edit roadmap"]
    Save --> Persist["Firestore, with LocalStorage fallback"]
    Assistant --> Chat["Send authenticated chat turn"]
    Chat --> Function["Server function validates request"]
    Function --> Model["OpenRouter model response"]
    Model --> Chat
```

## Return-user workflow

```mermaid
flowchart LR
    Visit["Return to TheWay"] --> Session{"Firebase session restored?"}
    Session -->|"No"| SignIn["Sign in with Google"]
    SignIn --> Profile["Load profile"]
    Session -->|"Yes"| Profile["Load profile from Firestore"]
    Profile --> Complete{"Onboarding complete?"}
    Complete -->|"No"| Setup["Profile setup"]
    Complete -->|"Yes"| Explore["/app/explore"]
```

## Notes for keeping the diagram current

This is a view of the implemented flow, including the assessment API integration and server-side assistant function. Update this page alongside `docs/specs/system-architecture.md` or `docs/specs/user-flows.md` when those contracts change.

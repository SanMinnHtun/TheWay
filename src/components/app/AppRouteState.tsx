import StarField from "../effects/StarField";

export function AppBootLoading({ message = "Loading TheWay..." }: { message?: string }) {
  return (
    <main className="app-boot-state">
      <StarField density={0.42} intensity={0.32} speed={0.2} interactive={false} />
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-bottom" aria-hidden="true" />
      <div className="app-boot-card" role="status" aria-live="polite">
        <span className="app-boot-spinner" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </main>
  );
}

export function AppRouteError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <main className="app-boot-state">
      <StarField density={0.42} intensity={0.32} speed={0.2} interactive={false} />
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-bottom" aria-hidden="true" />
      <div className="app-boot-card app-boot-card--error" role="alert">
        <h1>We couldn't load your profile.</h1>
        <p>{message}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    </main>
  );
}

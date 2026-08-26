import StarField from "../effects/StarField";
import { useI18n } from "../../i18n/I18nContext";

export function AppBootLoading({ message = "Loading TheWay..." }: { message?: string }) {
  const { t } = useI18n();

  return (
    <main className="app-boot-state">
      <StarField density={0.42} intensity={0.32} speed={0.2} interactive={false} />
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-bottom" aria-hidden="true" />
      <div className="app-boot-card" role="status" aria-live="polite">
        <span className="app-boot-spinner" aria-hidden="true" />
        <p>{message === "Loading TheWay..." ? t("common.loading") : message}</p>
      </div>
    </main>
  );
}

export function AppRouteError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useI18n();

  return (
    <main className="app-boot-state">
      <StarField density={0.42} intensity={0.32} speed={0.2} interactive={false} />
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-bottom" aria-hidden="true" />
      <div className="app-boot-card app-boot-card--error" role="alert">
        <h1>{t("errors.profileLoad")}</h1>
        <p>{message}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            {t("common.tryAgain")}
          </button>
        ) : null}
      </div>
    </main>
  );
}

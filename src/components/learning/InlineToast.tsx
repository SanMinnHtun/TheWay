import { useEffect } from "react";
import { useI18n } from "../../i18n/I18nContext";

export default function InlineToast({
  message,
  tone = "success",
  onDismiss
}: {
  message: string;
  tone?: "success" | "error";
  onDismiss: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className={`learning-toast learning-toast--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span aria-hidden="true">{tone === "error" ? "!" : "✓"}</span>
      <p>{message}</p>
      <button type="button" onClick={onDismiss} aria-label={t("common.dismissNotification")}>
        ×
      </button>
    </div>
  );
}

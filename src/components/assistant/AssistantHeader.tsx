import AssistantAvatar from "./AssistantAvatar";
import { useI18n } from "../../i18n/I18nContext";

export default function AssistantHeader() {
  const { t } = useI18n();

  return (
    <header className="assistant-header">
      <AssistantAvatar />
      <div>
        <h1>The Way</h1>
        <p>{t("assistant.subtitle")}</p>
      </div>
    </header>
  );
}

import { type FormEvent } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { SendIcon } from "../app/AppIcons";

export default function ChatComposer({
  value,
  onChange,
  onSubmit
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <footer className="chat-composer-wrap">
      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="way-assistant-input">
          {t("assistant.inputLabel")}
        </label>
        <input
          id="way-assistant-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("assistant.placeholder")}
          autoComplete="off"
        />
        <button type="submit" disabled={!value.trim()} aria-label={t("assistant.send")}>
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
      <p>{t("assistant.footer")}</p>
    </footer>
  );
}

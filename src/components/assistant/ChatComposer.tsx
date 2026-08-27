import { type FormEvent, type KeyboardEvent } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { SendIcon } from "../app/AppIcons";

export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  isSending = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSending?: boolean;
}) {
  const { t } = useI18n();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending || !value.trim()) {
      return;
    }

    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    if (!isSending && value.trim()) {
      onSubmit();
    }
  }

  return (
    <footer className="chat-composer-wrap">
      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="way-assistant-input">
          {t("assistant.inputLabel")}
        </label>
        <textarea
          id="way-assistant-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("assistant.placeholder")}
          autoComplete="off"
          rows={1}
          disabled={isSending}
        />
        <button type="submit" disabled={!value.trim() || isSending} aria-label={t("assistant.send")} aria-busy={isSending}>
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
      <p>{t("assistant.footer")}</p>
    </footer>
  );
}

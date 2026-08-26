import { type FormEvent } from "react";
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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <footer className="chat-composer-wrap">
      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="way-assistant-input">
          Ask The Way anything
        </label>
        <input
          id="way-assistant-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask The Way anything..."
          autoComplete="off"
        />
        <button type="submit" disabled={!value.trim()} aria-label="Send message">
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
      <p>The Way · AI responses are for career guidance only</p>
    </footer>
  );
}

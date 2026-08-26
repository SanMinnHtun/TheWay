import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { CurrentUser } from "../data/mockUser";
import { useI18n } from "../i18n/I18nContext";
import AssistantHeader from "../components/assistant/AssistantHeader";
import ChatComposer from "../components/assistant/ChatComposer";
import ChatMessage, { type ChatMessageModel } from "../components/assistant/ChatMessage";
import PromptChip from "../components/assistant/PromptChip";

const promptSuggestionKeys = [
  "assistant.prompt.next",
  "assistant.prompt.careers",
  "assistant.prompt.progress",
  "assistant.prompt.resources",
  "assistant.prompt.milestone"
] as const;

function getMockTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

export default function WayAssistant() {
  const { currentUser } = useOutletContext<{ currentUser: CurrentUser }>();
  const { t, language } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageModel[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      timestamp: "9:00 AM",
      content: `${t("assistant.welcomeIntro", { name: currentUser.name })}\n\n${t("assistant.welcomeBody")}\n\n${t("assistant.welcomeQuestion")}`
    }
  ]);

  const visiblePrompts = useMemo(() => promptSuggestionKeys.map((key) => t(key)), [language, t]);

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
  }

  function handleSubmit() {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        timestamp: getMockTime(),
        content: trimmed
      }
    ]);
    setInputValue("");
  }

  return (
    <section className="assistant-page" aria-label="Way Assistant">
      <AssistantHeader />

      <div className="assistant-workspace">
        <div className="chat-thread" aria-live="polite">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        <div className="prompt-chip-row" aria-label="Suggested prompts">
          {visiblePrompts.map((prompt) => (
            <PromptChip key={prompt} label={prompt} onClick={handlePromptClick} />
          ))}
        </div>
      </div>

      <ChatComposer value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
    </section>
  );
}

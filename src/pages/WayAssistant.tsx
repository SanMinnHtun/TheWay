import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { CurrentUser } from "../data/mockUser";
import { useI18n } from "../i18n/I18nContext";
import type { UserProfile } from "../types/profile";
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
  const { currentUser, profile } = useOutletContext<{ currentUser: CurrentUser; profile: UserProfile | null }>();
  const { t, language } = useI18n();
  const replyTimer = useRef<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessageModel[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      timestamp: "9:00 AM",
      content: `${t("assistant.welcomeIntro", { name: currentUser.name })}\n\n${t("assistant.welcomeBody")}\n\n${t("assistant.welcomeQuestion")}`
    }
  ]);

  const visiblePrompts = useMemo(() => promptSuggestionKeys.map((key) => t(key)), [language, t]);

  useEffect(() => {
    setMessages((current) =>
      current.map((message) =>
        message.id === "welcome"
          ? {
              ...message,
              content: `${t("assistant.welcomeIntro", { name: currentUser.name })}\n\n${t("assistant.welcomeBody")}\n\n${t("assistant.welcomeQuestion")}`
            }
          : message
      )
    );
  }, [currentUser.name, language, t]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) {
        window.clearTimeout(replyTimer.current);
      }
    };
  }, []);

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
  }

  function handleSubmit() {
    const trimmed = inputValue.trim();

    if (!trimmed || isThinking) {
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
    setIsThinking(true);

    replyTimer.current = window.setTimeout(() => {
      const mode = profile?.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore");
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          timestamp: getMockTime(),
          content: t("assistant.mockReply", { mode })
        }
      ]);
      setIsThinking(false);
    }, 620);
  }

  return (
    <section className="assistant-page" aria-label="Way Assistant">
      <AssistantHeader />

      <div className="assistant-workspace">
        <div className="chat-thread" aria-live="polite">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isThinking ? (
            <div className="assistant-thinking" role="status" aria-live="polite">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <p>{t("assistant.thinking")}</p>
            </div>
          ) : null}
        </div>

        <aside className="assistant-context-strip" aria-label={t("assistant.contextLabel")}>
          <span>{t("assistant.contextMode", { mode: profile?.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore") })}</span>
          <span>{t("assistant.contextFocus")}</span>
        </aside>

        <div className="prompt-chip-row" aria-label="Suggested prompts">
          {visiblePrompts.map((prompt) => (
            <PromptChip key={prompt} label={prompt} onClick={handlePromptClick} />
          ))}
        </div>
      </div>

      <ChatComposer value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} isSending={isThinking} />
    </section>
  );
}

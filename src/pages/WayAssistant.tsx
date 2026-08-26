import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { CurrentUser } from "../data/mockUser";
import AssistantHeader from "../components/assistant/AssistantHeader";
import ChatComposer from "../components/assistant/ChatComposer";
import ChatMessage, { type ChatMessageModel } from "../components/assistant/ChatMessage";
import PromptChip from "../components/assistant/PromptChip";

const promptSuggestions = [
  "What should I learn next?",
  "Explore careers for me",
  "Review my roadmap progress",
  "Best resources for my next skill",
  "Explain my current milestone"
];

function getMockTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

export default function WayAssistant() {
  const { currentUser } = useOutletContext<{ currentUser: CurrentUser }>();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageModel[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      timestamp: "9:00 AM",
      content: `Hi ${currentUser.name}! I'm The Way - your AI career guide.\n\nI can help you understand your roadmap, explore career paths, find learning resources, review your progress, or explain what you should learn next.\n\nWhat would you like to explore today?`
    }
  ]);

  const visiblePrompts = useMemo(() => promptSuggestions, []);

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

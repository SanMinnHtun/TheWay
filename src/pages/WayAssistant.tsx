import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import type { CurrentUser } from "../data/mockUser";
import { useI18n } from "../i18n/I18nContext";
import type { UserProfile } from "../types/profile";
import { useLearningExperience } from "../context/LearningExperienceContext";
import { useCareerRoadmap } from "../context/CareerRoadmapContext";
import { getCareerById, getRoadmapById } from "../data/learningCatalog";
import { sendAssistantMessage, type AssistantChatMessage, type AssistantContext } from "../services/assistantChat";
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

function getCurrentTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

export default function WayAssistant() {
  const { currentUser, profile } = useOutletContext<{ currentUser: CurrentUser; profile: UserProfile | null }>();
  const { t, language } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const learning = useLearningExperience();
  const careerRoadmap = useCareerRoadmap();
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [messages, setMessages] = useState<ChatMessageModel[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      timestamp: "9:00 AM",
      content: `${t("assistant.welcomeIntro", { name: currentUser.name })}\n\n${t("assistant.welcomeBody")}\n\n${t("assistant.welcomeQuestion")}`
    }
  ]);

  const focusRole = careerRoadmap.savedRoadmap?.roleTitle
    ?? careerRoadmap.roadmap?.roleTitle
    ?? getCareerById(learning.state?.selectedCareerId)?.name[language]
    ?? t("assistant.noRoadmapFocus");
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
    const prompt = searchParams.get("prompt")?.trim();

    if (!prompt) {
      return;
    }

    setInputValue(prompt);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("prompt");
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
  }

  async function handleSubmit() {
    const trimmed = inputValue.trim();

    if (!trimmed || isThinking) {
      return;
    }

    const nextUserMessage: ChatMessageModel = {
      id: `user-${Date.now()}`,
      role: "user",
      timestamp: getCurrentTime(),
      content: trimmed
    };
    const conversation: AssistantChatMessage[] = [
      ...messages
        .filter((message) => message.id !== "welcome")
        .slice(-11)
        .map(({ role, content }) => ({ role, content })),
      { role: "user", content: trimmed }
    ];
    setMessages((current) => [...current, nextUserMessage]);
    setInputValue("");
    setIsThinking(true);
    setSubmitError("");

    const learningState = learning.state;
    const selectedCareer = getCareerById(learningState?.selectedCareerId);
    const selectedCatalogRoadmap = getRoadmapById(learningState?.roadmapId);
    const personalizedRoadmap = careerRoadmap.savedRoadmap ?? careerRoadmap.roadmap;
    const editableStages = personalizedRoadmap?.stages.map((stage) => ({
      title: stage.title,
      status: stage.status,
      skills: stage.skills.map((skill) => ({ name: skill.name, status: skill.status }))
    }));
    const catalogStages = selectedCatalogRoadmap?.stages.map((stage) => ({
      title: stage.title.en,
      status: stage.skills.every((skill) => learningState?.completedSkillIds.includes(skill.id)) ? "completed" : "in-progress",
      skills: stage.skills.map((skill) => ({
        name: skill.name.en,
        status: learningState?.completedSkillIds.includes(skill.id) ? "completed" : "pending"
      }))
    }));
    const stages = editableStages ?? catalogStages ?? [];
    const allSkills = stages.flatMap((stage) => stage.skills);
    const context: AssistantContext = {
      language,
      mode: profile?.mode ?? "EXPLORE",
      currentStatus: profile?.currentStatus,
      topRole: personalizedRoadmap?.roleTitle ?? selectedCareer?.name.en,
      completedSkills: allSkills.filter((skill) => skill.status === "completed").length,
      totalSkills: allSkills.length,
      stages
    };

    try {
      const reply = await sendAssistantMessage(conversation, context);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          timestamp: getCurrentTime(),
          content: reply
        }
      ]);
    } catch (error) {
      console.error("Way Assistant could not send the message", error);
      const code = error instanceof Error ? error.message : "";
      const messageKey = code === "assistant-secret-missing"
        ? "assistant.secretMissing"
        : code === "assistant-provider-auth-error"
          ? "assistant.providerAuthError"
          : code === "assistant-provider-billing-error"
            ? "assistant.providerBillingError"
            : code === "assistant-provider-rate-limit"
              ? "assistant.providerRateLimit"
              : code === "assistant-provider-model-error"
                ? "assistant.providerModelError"
                : code.startsWith("assistant-request-failed:500")
                  ? "assistant.serverUnavailable"
                  : "assistant.error";
      setSubmitError(t(messageKey));
    } finally {
      setIsThinking(false);
    }
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
          {submitError ? <p className="assistant-error" role="alert">{submitError}</p> : null}
        </div>

        <aside className="assistant-context-strip" aria-label={t("assistant.contextLabel")}>
          <span>{t("assistant.contextMode", { mode: profile?.mode === "GOAL" ? t("profile.modeGoal") : t("profile.modeExplore") })}</span>
          <span>{t("assistant.contextFocus", { focus: focusRole })}</span>
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

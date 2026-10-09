import { getFirebaseAuth } from "../lib/firebase";

export type AssistantChatRole = "user" | "assistant";

export interface AssistantChatMessage {
  role: AssistantChatRole;
  content: string;
}

export interface AssistantContext {
  language: "en" | "my";
  mode: string;
  currentStatus?: string;
  topRole?: string;
  completedSkills?: number;
  totalSkills?: number;
  stages?: Array<{
    title: string;
    status: string;
    skills: Array<{ name: string; status: string }>;
  }>;
}

const endpoint = import.meta.env.VITE_ASSISTANT_API_URL || "/api/assistant/chat";

export async function sendAssistantMessage(messages: AssistantChatMessage[], context: AssistantContext) {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("assistant-auth-required");

  const idToken = await user.getIdToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({ messages, context })
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    console.error("Way Assistant request failed", { status: response.status, body });
    const errorCode = body && typeof body === "object" && "error" in body && typeof body.error === "string"
      ? body.error
      : `assistant-request-failed:${response.status}`;
    throw new Error(errorCode);
  }

  if (!body || typeof body !== "object" || !("reply" in body) || typeof body.reply !== "string") {
    throw new Error("assistant-invalid-response");
  }

  return body.reply;
}

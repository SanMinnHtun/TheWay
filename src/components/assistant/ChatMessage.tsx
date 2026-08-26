import AssistantAvatar from "./AssistantAvatar";

export interface ChatMessageModel {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export default function ChatMessage({ message }: { message: ChatMessageModel }) {
  const isAssistant = message.role === "assistant";

  return (
    <article className={`chat-message ${isAssistant ? "chat-message--assistant" : "chat-message--user"}`}>
      {isAssistant ? <AssistantAvatar size="sm" /> : null}
      <div className="chat-message-stack">
        <div className="chat-message-bubble">
          {message.content.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <time className="chat-message-time">{message.timestamp}</time>
      </div>
    </article>
  );
}

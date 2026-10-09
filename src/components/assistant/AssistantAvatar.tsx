import rocket from "../../assets/the-way-rocket.svg";

export default function AssistantAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-10 w-10" : "h-12 w-12";

  return (
    <span className={`${sizeClass} assistant-avatar`} aria-hidden="true">
      <img className="assistant-avatar-rocket" src={rocket} alt="" />
      {size === "md" ? <span className="assistant-online-dot" /> : null}
    </span>
  );
}

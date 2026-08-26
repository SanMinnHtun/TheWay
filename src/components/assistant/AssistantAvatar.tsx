import { SparkleIcon } from "../app/AppIcons";

export default function AssistantAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const iconClass = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <span className={`${sizeClass} assistant-avatar`} aria-hidden="true">
      <SparkleIcon className={iconClass} />
      {size === "md" ? <span className="assistant-online-dot" /> : null}
    </span>
  );
}

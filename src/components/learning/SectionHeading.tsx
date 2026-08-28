import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  id
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("learning-section-heading", className)}>
      <div>
        {eyebrow ? <p className="experience-eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="learning-section-action">{action}</div> : null}
    </div>
  );
}

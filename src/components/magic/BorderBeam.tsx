import type * as React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
}

export function BorderBeam({ className, duration = 9 }: BorderBeamProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
      style={{ "--beam-duration": `${duration}s` } as React.CSSProperties}
    >
      <span className="theway-border-beam" />
    </span>
  );
}

import type { ReactNode } from "react";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`app-skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonCard({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <section className={`app-skeleton-card ${className}`} aria-hidden={children ? undefined : "true"}>
      {children ?? (
        <>
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="mt-4 h-3 w-full" />
          <SkeletonBlock className="mt-3 h-3 w-5/6" />
          <SkeletonBlock className="mt-8 h-9 w-32 rounded-full" />
        </>
      )}
    </section>
  );
}

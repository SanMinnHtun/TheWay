import { Skeleton } from "../ui/skeleton";
import { useI18n } from "../../i18n/I18nContext";

export default function LearningPageSkeleton({ cards = 3 }: { cards?: number }) {
  const { t } = useI18n();

  return (
    <div className="learning-page-skeleton" aria-label={t("common.loading")} aria-busy="true">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

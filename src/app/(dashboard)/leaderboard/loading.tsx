import { PageHeader } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Leaderboard" description="Top contributors ranked by total earnings" />

      <Skeleton className="h-10 w-80" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-3 gap-4 items-end justify-center max-w-4xl mx-auto">
          <Skeleton className="h-40" />
          <Skeleton className="h-48" />
          <Skeleton className="h-36" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="border rounded-lg overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 m-0 rounded-none" />
          ))}
        </div>
      </div>
    </div>
  );
}

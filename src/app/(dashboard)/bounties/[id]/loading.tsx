import { Skeleton } from "@/components/ui/skeleton";

export default function BountyDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <nav className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </nav>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-32" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

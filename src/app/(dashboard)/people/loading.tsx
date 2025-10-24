import { LoadingGrid } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

export default function PeopleLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-10 flex-1" />
      <LoadingGrid count={6} columns={3} />
    </div>
  );
}

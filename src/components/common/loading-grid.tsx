import { CardSkeleton } from "@/components/loading/card-skeleton";
import { CardGrid } from "./card-grid";

interface LoadingGridProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

export function LoadingGrid({ count = 6, columns = 3 }: LoadingGridProps) {
  return (
    <CardGrid columns={columns}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </CardGrid>
  );
}

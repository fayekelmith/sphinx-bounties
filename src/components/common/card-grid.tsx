import { cn } from "@/lib/utils";

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const COLUMN_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  return <div className={cn("grid gap-4", COLUMN_CLASSES[columns], className)}>{children}</div>;
}

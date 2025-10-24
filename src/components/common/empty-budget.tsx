import { Wallet } from "lucide-react";
import { EmptyState } from "./empty-state";

export function EmptyBudget() {
  return (
    <EmptyState
      icon={<Wallet className="size-6 text-muted-foreground" />}
      title="No budget transactions"
      description="Budget allocations and transactions will appear here once bounties are funded."
    />
  );
}

import { EmptyState } from "./empty-state";
import { Trophy } from "lucide-react";

export function EmptyLeaderboard() {
  return (
    <EmptyState
      icon={<Trophy className="size-6 text-muted-foreground" />}
      title="No Contributors Yet"
      description="The leaderboard will display top earners once bounties are completed."
    />
  );
}

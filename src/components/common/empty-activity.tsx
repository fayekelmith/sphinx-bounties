import { Activity } from "lucide-react";
import { EmptyState } from "./empty-state";

export function EmptyActivity() {
  return (
    <EmptyState
      icon={<Activity className="size-6 text-muted-foreground" />}
      title="No activity yet"
      description="Activity history will appear here once actions are taken."
    />
  );
}

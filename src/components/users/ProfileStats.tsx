import { StatCard } from "@/components/common";
import { Wallet, Target, CheckCircle, TrendingUp } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    totalEarned: number | string;
    bountiesCompleted: number;
    bountiesCreated: number;
    successRate: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const totalEarned =
    typeof stats.totalEarned === "string" ? Number(stats.totalEarned) : stats.totalEarned;

  const successRate = stats.successRate || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Earned"
        value={totalEarned.toLocaleString()}
        icon={Wallet}
        description="sats earned"
      />

      <StatCard
        label="Completed"
        value={stats.bountiesCompleted.toString()}
        icon={CheckCircle}
        description="bounties finished"
      />

      <StatCard
        label="Created"
        value={stats.bountiesCreated.toString()}
        icon={Target}
        description="bounties posted"
      />

      <StatCard
        label="Success Rate"
        value={`${successRate.toFixed(0)}%`}
        icon={TrendingUp}
        description="completion rate"
        trend={successRate > 0 ? { value: successRate, isPositive: successRate >= 75 } : undefined}
      />
    </div>
  );
}

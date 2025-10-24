import { StatCard } from "@/components/common";
import { Wallet, Target, Users, TrendingUp } from "lucide-react";

interface WorkspaceStatsProps {
  budget: {
    totalBudget: number | string;
    availableBudget: number | string;
    reservedBudget: number | string;
    paidBudget: number | string;
  } | null;
  bountyCount: number;
  memberCount: number;
}

export function WorkspaceStats({ budget, bountyCount, memberCount }: WorkspaceStatsProps) {
  const totalBudget = budget ? Number(budget.totalBudget) : 0;
  const availableBudget = budget ? Number(budget.availableBudget) : 0;
  const paidBudget = budget ? Number(budget.paidBudget) : 0;
  const spentPercentage = totalBudget > 0 ? (paidBudget / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Budget"
        value={totalBudget.toLocaleString()}
        icon={Wallet}
        description="sats allocated"
      />

      <StatCard
        label="Available"
        value={availableBudget.toLocaleString()}
        icon={TrendingUp}
        description="sats remaining"
        trend={spentPercentage > 0 ? { value: spentPercentage, isPositive: false } : undefined}
      />

      <StatCard
        label="Active Bounties"
        value={bountyCount.toString()}
        icon={Target}
        description="open opportunities"
      />

      <StatCard
        label="Team Members"
        value={memberCount.toString()}
        icon={Users}
        description="contributors"
      />
    </div>
  );
}

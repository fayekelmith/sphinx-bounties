"use client";

import { useState } from "react";
import { PageHeader, EmptyLeaderboard } from "@/components/common";
import { SectionHeader } from "@/components/common/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardPodium, LeaderboardTable } from "@/components/leaderboard";
import { useGetLeaderboard } from "@/hooks/queries";

type TimePeriod = "all" | "month" | "week";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<TimePeriod>("all");

  const { data, isLoading, error } = useGetLeaderboard({
    page: 1,
    pageSize: 50,
  });

  if (error) throw error;

  const topThree = data?.data.slice(0, 3) || [];
  const remaining = data?.data.slice(3) || [];
  const isEmpty = !isLoading && data?.data.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Leaderboard" description="Top contributors ranked by total earnings" />

      <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
        <TabsList>
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>
      </Tabs>

      {isEmpty ? (
        <EmptyLeaderboard />
      ) : (
        <>
          {topThree.length > 0 && (
            <div className="space-y-4">
              <SectionHeader title="Top 3" />
              <LeaderboardPodium topThree={topThree} />
            </div>
          )}

          {remaining.length > 0 && (
            <div className="space-y-4">
              <SectionHeader title="Rankings" />
              <LeaderboardTable entries={remaining} startRank={4} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

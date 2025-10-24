import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types";

interface LeaderboardEntry {
  pubkey: string;
  username: string;
  alias: string | null;
  avatarUrl: string | null;
  totalEarned: string;
  bountiesCompleted: number;
  lastCompletedAt: string | null;
}

interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: (pagination?: PaginationParams) => [...leaderboardKeys.all, { pagination }] as const,
};

async function fetchLeaderboard(pagination?: PaginationParams): Promise<LeaderboardResponse> {
  const params = new URLSearchParams();
  if (pagination?.page) params.set("page", pagination.page.toString());
  if (pagination?.pageSize) params.set("limit", pagination.pageSize.toString());

  const response = await fetch(`/api/leaderboard?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return response.json();
}

export function useGetLeaderboard(pagination?: PaginationParams) {
  return useQuery({
    queryKey: leaderboardKeys.list(pagination),
    queryFn: () => fetchLeaderboard(pagination),
  });
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap } from "lucide-react";

interface LeaderboardEntry {
  pubkey: string;
  username: string;
  alias: string | null;
  avatarUrl: string | null;
  totalEarned: string;
  bountiesCompleted: number;
}

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[];
}

const MEDAL_COLORS = {
  1: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-600" },
  2: { bg: "bg-gray-100", text: "text-gray-700", icon: "text-gray-500" },
  3: { bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-600" },
};

const PODIUM_HEIGHTS = {
  1: "h-48",
  2: "h-40",
  3: "h-36",
};

function getInitials(username: string, alias?: string | null): string {
  const name = alias || username;
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  const orderedPodium = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="grid grid-cols-3 gap-4 items-end justify-center max-w-4xl mx-auto">
      {orderedPodium.map((entry, displayIndex) => {
        const actualRank = displayIndex === 0 ? 2 : displayIndex === 1 ? 1 : 3;
        const colors = MEDAL_COLORS[actualRank as keyof typeof MEDAL_COLORS];
        const height = PODIUM_HEIGHTS[actualRank as keyof typeof PODIUM_HEIGHTS];
        const displayName = entry.alias || entry.username;

        return (
          <Link
            key={entry.pubkey}
            href={`/people/${entry.pubkey}`}
            className={`${height} flex flex-col justify-end`}
          >
            <Card className="transition-all hover:shadow-lg hover:border-primary-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <Avatar
                      className={`h-20 w-20 ring-4 ring-offset-2 ${actualRank === 1 ? "ring-yellow-400" : actualRank === 2 ? "ring-gray-400" : "ring-orange-400"}`}
                    >
                      <AvatarImage src={entry.avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className={`${colors.bg} ${colors.text} text-lg`}>
                        {getInitials(entry.username, entry.alias)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge
                      className={`absolute -top-1 -right-1 ${colors.bg} ${colors.text} h-7 w-7 rounded-full p-0 flex items-center justify-center`}
                    >
                      {actualRank === 1 ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <span className="font-bold">{actualRank}</span>
                      )}
                    </Badge>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="font-semibold line-clamp-1">{displayName}</h3>
                    <p className="text-xs text-muted-foreground">@{entry.username}</p>
                  </div>

                  <div className="flex items-center gap-1 text-primary-600">
                    <Zap className="h-4 w-4 fill-current" />
                    <span className="font-bold">{Number(entry.totalEarned).toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {entry.bountiesCompleted} completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface LeaderboardEntry {
  pubkey: string;
  username: string;
  alias: string | null;
  avatarUrl: string | null;
  totalEarned: string;
  bountiesCompleted: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  startRank: number;
}

function getInitials(username: string, alias?: string | null): string {
  const name = alias || username;
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function LeaderboardTable({ entries, startRank }: LeaderboardTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-semibold text-sm">Rank</th>
            <th className="text-left p-4 font-semibold text-sm">Contributor</th>
            <th className="text-right p-4 font-semibold text-sm">Earned</th>
            <th className="text-right p-4 font-semibold text-sm">Completed</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {entries.map((entry, index) => {
            const rank = startRank + index;
            const displayName = entry.alias || entry.username;

            return (
              <tr key={entry.pubkey} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <Badge variant="outline" className="w-12 justify-center">
                    #{rank}
                  </Badge>
                </td>
                <td className="p-4">
                  <Link
                    href={`/people/${entry.pubkey}`}
                    className="flex items-center gap-3 hover:text-primary-600 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {getInitials(entry.username, entry.alias)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-muted-foreground">@{entry.username}</p>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-primary-600 font-semibold">
                    <Zap className="h-4 w-4 fill-current" />
                    <span>{Number(entry.totalEarned).toLocaleString()}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="font-medium">{entry.bountiesCompleted}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

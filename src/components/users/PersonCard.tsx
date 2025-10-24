import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, TrendingUp } from "lucide-react";

interface Person {
  pubkey: string;
  username: string;
  alias: string | null;
  avatarUrl: string | null;
  description: string | null;
  githubUsername: string | null;
  twitterUsername: string | null;
  _count?: {
    bountiesCreated: number;
    bountiesCompleted: number;
  };
  stats?: {
    totalEarned: number;
    completedBounties: number;
    completionRate: number;
  };
}

interface PersonCardProps {
  person: Person;
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

export function PersonCard({ person }: PersonCardProps) {
  const displayName = person.alias || person.username;
  const totalEarned = person.stats?.totalEarned ?? 0;
  const completedCount = person.stats?.completedBounties ?? person._count?.bountiesCompleted ?? 0;
  const completionRate = person.stats?.completionRate ?? 0;

  return (
    <Link href={`/people/${person.pubkey}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary-300 cursor-pointer">
        <CardHeader>
          <div className="flex flex-col items-center text-center space-y-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={person.avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                {getInitials(person.username, person.alias)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-1">{displayName}</h3>
              <p className="text-sm text-muted-foreground">@{person.username}</p>
            </div>
          </div>
        </CardHeader>

        {person.description && (
          <CardContent>
            <p className="text-sm text-neutral-600 text-center line-clamp-2">
              {person.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-3 border-t pt-4">
          <div className="grid grid-cols-3 gap-2 w-full text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-primary-600">
                <Zap className="h-3 w-3 fill-current" />
                <span className="text-sm font-semibold">{totalEarned.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                <span className="text-sm font-semibold">{completedCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-secondary-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm font-semibold">{completionRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
          </div>

          {(person.githubUsername || person.twitterUsername) && (
            <div className="flex flex-wrap justify-center gap-1">
              {person.githubUsername && (
                <Badge variant="outline" className="text-xs">
                  GitHub
                </Badge>
              )}
              {person.twitterUsername && (
                <Badge variant="outline" className="text-xs">
                  Twitter
                </Badge>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

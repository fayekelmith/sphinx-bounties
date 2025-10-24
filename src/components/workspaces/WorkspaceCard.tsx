import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Clock } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  logoUrl?: string | null;
  owner?: {
    pubkey: string;
    username: string;
    alias: string | null;
    avatarUrl: string | null;
  };
  _count?: {
    members: number;
    bounties: number;
  };
  createdAt: string | Date;
}

interface WorkspaceCardProps {
  workspace: Workspace;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const memberCount = workspace._count?.members ?? 0;
  const bountyCount = workspace._count?.bounties ?? 0;

  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary-300 cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={workspace.logoUrl || undefined} alt={workspace.name} />
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(workspace.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">{workspace.name}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {workspace.description && (
            <p className="text-sm text-neutral-600 line-clamp-2">{workspace.description}</p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm text-neutral-600 border-t pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>
                {bountyCount} {bountyCount === 1 ? "bounty" : "bounties"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

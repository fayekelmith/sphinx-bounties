import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserMinus, Shield } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";

interface Member {
  id: string;
  role: string;
  joinedAt: string | Date;
  user: {
    pubkey: string;
    username: string;
    alias: string | null;
    avatarUrl: string | null;
  };
}

interface WorkspaceMembersListProps {
  workspaceId: string;
  members: Member[];
  onUpdateRole?: (memberId: string, newRole: string) => void;
  onRemoveMember?: (memberId: string) => void;
}

const ROLE_COLORS = {
  OWNER: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
  MEMBER: "bg-blue-100 text-blue-800 border-blue-200",
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

export function WorkspaceMembersList({
  workspaceId,
  members,
  onUpdateRole,
  onRemoveMember,
}: WorkspaceMembersListProps) {
  return (
    <div className="border rounded-lg divide-y">
      {members.map((member) => {
        const displayName = member.user.alias || member.user.username;
        const roleColor =
          ROLE_COLORS[member.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.MEMBER;
        const joinedDate = new Date(member.joinedAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        return (
          <div key={member.id} className="p-4 flex items-center justify-between gap-4">
            <Link
              href={`/people/${member.user.pubkey}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.user.avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getInitials(member.user.username, member.user.alias)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-muted-foreground">@{member.user.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className={roleColor}>
                {member.role}
              </Badge>

              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Joined {joinedDate}
              </span>

              <PermissionGate workspaceId={workspaceId} requiresAny={["OWNER", "ADMIN"]}>
                {member.role !== "OWNER" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role !== "ADMIN" && onUpdateRole && (
                        <DropdownMenuItem onClick={() => onUpdateRole(member.id, "ADMIN")}>
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {member.role === "ADMIN" && onUpdateRole && (
                        <DropdownMenuItem onClick={() => onUpdateRole(member.id, "MEMBER")}>
                          <Shield className="h-4 w-4 mr-2" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                      {onRemoveMember && (
                        <DropdownMenuItem
                          onClick={() => onRemoveMember(member.id)}
                          className="text-accent-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </PermissionGate>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Github } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";

interface WorkspaceHeaderProps {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    mission: string | null;
    avatarUrl: string | null;
    websiteUrl: string | null;
    githubUrl: string | null;
    owner: {
      pubkey: string;
      username: string;
      alias: string | null;
      avatarUrl: string | null;
    };
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={workspace.avatarUrl || undefined} alt={workspace.name} />
            <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
              {getInitials(workspace.name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{workspace.name}</h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Owned by</span>
              <Link
                href={`/people/${workspace.owner.pubkey}`}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                @{workspace.owner.username}
              </Link>
            </div>

            {workspace.description && (
              <p className="text-muted-foreground max-w-2xl">{workspace.description}</p>
            )}

            <div className="flex items-center gap-3">
              {workspace.websiteUrl && (
                <a
                  href={workspace.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}

              {workspace.githubUrl && (
                <a
                  href={workspace.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <PermissionGate workspaceId={workspace.id} requiresAny={["OWNER", "ADMIN"]}>
          <Link href={`/workspaces/${workspace.id}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </PermissionGate>
      </div>

      {workspace.mission && (
        <div className="border-l-4 border-primary-300 bg-primary-50 p-4 rounded">
          <h3 className="font-semibold text-primary-900 mb-1">Mission</h3>
          <p className="text-primary-800">{workspace.mission}</p>
        </div>
      )}
    </div>
  );
}

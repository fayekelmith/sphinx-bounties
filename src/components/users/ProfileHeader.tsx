import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Github,
  Twitter,
  MapPin,
  Link as LinkIcon,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface ProfileHeaderProps {
  user: {
    pubkey: string;
    username: string;
    alias: string | null;
    description: string | null;
    avatarUrl: string | null;
    location?: string | null;
    websiteUrl?: string | null;
    githubUsername: string | null;
    githubVerified: boolean;
    twitterUsername: string | null;
    twitterVerified: boolean;
    createdAt: string | Date;
  };
  isOwnProfile?: boolean;
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

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const displayName = user.alias || user.username;
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary-100 text-primary-700 text-3xl">
              {getInitials(user.username, user.alias)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <p className="text-lg text-muted-foreground">@{user.username}</p>
            </div>

            {user.description && (
              <p className="text-muted-foreground max-w-2xl">{user.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.websiteUrl && (
                <a
                  href={user.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>{user.websiteUrl.replace(/^https?:\/\//, "")}</span>
                </a>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.githubUsername && (
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary-600 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>{user.githubUsername}</span>
                  {user.githubVerified && <CheckCircle2 className="h-4 w-4 text-secondary-600" />}
                </a>
              )}

              {user.twitterUsername && (
                <a
                  href={`https://twitter.com/${user.twitterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary-600 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span>@{user.twitterUsername}</span>
                  {user.twitterVerified && <CheckCircle2 className="h-4 w-4 text-secondary-600" />}
                </a>
              )}
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <Link href="/settings/profile">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Clock, Building2, Calendar, ExternalLink } from "lucide-react";

interface BountyDetailProps {
  bounty: {
    id: string;
    title: string;
    description: string;
    deliverables: string | null;
    amount: string | number;
    status: string;
    estimatedHours: number | null;
    codingLanguages: string[];
    tags: string[];
    githubIssueUrl: string | null;
    loomVideoUrl: string | null;
    createdAt: string | Date;
    workspace: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    creator: {
      pubkey: string;
      username: string;
      alias: string | null;
      avatarUrl: string | null;
    };
    assignee?: {
      pubkey: string;
      username: string;
      alias: string | null;
      avatarUrl: string | null;
    } | null;
  };
  showActions?: boolean;
  onClaim?: () => void;
  onSubmit?: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-neutral-100", text: "text-neutral-700", label: "Draft" },
  OPEN: { bg: "bg-secondary-100", text: "text-secondary-700", label: "Open" },
  ASSIGNED: { bg: "bg-primary-100", text: "text-primary-700", label: "Assigned" },
  IN_REVIEW: { bg: "bg-tertiary-100", text: "text-tertiary-700", label: "In Review" },
  COMPLETED: { bg: "bg-secondary-100", text: "text-secondary-700", label: "Completed" },
  PAID: { bg: "bg-secondary-200", text: "text-secondary-800", label: "Paid" },
  CANCELLED: { bg: "bg-neutral-100", text: "text-neutral-500", label: "Cancelled" },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
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

export function BountyDetail({ bounty, showActions = true, onClaim, onSubmit }: BountyDetailProps) {
  const statusStyle = STATUS_STYLES[bounty.status] || STATUS_STYLES.OPEN;
  const creatorName = bounty.creator.alias || bounty.creator.username;
  const assigneeName = bounty.assignee ? bounty.assignee.alias || bounty.assignee.username : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold flex-1">{bounty.title}</h1>
        <Badge className={`${statusStyle.bg} ${statusStyle.text} shrink-0`}>
          {statusStyle.label}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-primary-700 font-semibold text-lg">
          <Zap className="h-5 w-5 fill-current" />
          <span>{Number(bounty.amount).toLocaleString()} sats</span>
        </div>

        {bounty.estimatedHours && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{bounty.estimatedHours}h estimated</span>
          </div>
        )}

        <Link
          href={`/workspaces/${bounty.workspace.id}`}
          className="flex items-center gap-1 text-muted-foreground hover:text-primary-600 transition-colors"
        >
          <Building2 className="h-4 w-4" />
          <span>{bounty.workspace.name}</span>
        </Link>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatTimeAgo(new Date(bounty.createdAt))}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-3">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {bounty.description}
          </p>
        </div>

        {bounty.deliverables && (
          <div>
            <h2 className="font-semibold text-lg mb-3">Deliverables</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {bounty.deliverables}
            </p>
          </div>
        )}
      </div>

      {(bounty.codingLanguages.length > 0 || bounty.tags.length > 0) && (
        <>
          <Separator />
          <div className="space-y-4">
            {bounty.codingLanguages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.codingLanguages.map((lang: string) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {bounty.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Created by</p>
          <Link
            href={`/people/${bounty.creator.pubkey}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={bounty.creator.avatarUrl || undefined} alt={creatorName} />
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(bounty.creator.username, bounty.creator.alias)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{creatorName}</p>
              <p className="text-sm text-muted-foreground">@{bounty.creator.username}</p>
            </div>
          </Link>
        </div>

        {bounty.assignee && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Assigned to</p>
            <Link
              href={`/people/${bounty.assignee.pubkey}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={bounty.assignee.avatarUrl || undefined}
                  alt={assigneeName || "Assignee"}
                />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getInitials(bounty.assignee.username, bounty.assignee.alias)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{assigneeName}</p>
                <p className="text-sm text-muted-foreground">@{bounty.assignee.username}</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {(bounty.githubIssueUrl || bounty.loomVideoUrl) && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-2">Resources</h3>
            {bounty.githubIssueUrl && (
              <a
                href={bounty.githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View GitHub Issue
              </a>
            )}
            {bounty.loomVideoUrl && (
              <a
                href={bounty.loomVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Loom Video
              </a>
            )}
          </div>
        </>
      )}

      {showActions && (
        <>
          <Separator />
          <div className="flex gap-3">
            {bounty.status === "OPEN" && onClaim && (
              <Button onClick={onClaim} className="flex-1">
                Claim Bounty
              </Button>
            )}
            {bounty.status === "ASSIGNED" && onSubmit && (
              <Button onClick={onSubmit} className="flex-1">
                Submit Work
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

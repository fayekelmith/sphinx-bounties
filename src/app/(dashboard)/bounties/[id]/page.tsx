"use client";

import { use } from "react";
import Link from "next/link";
import { useGetBounty } from "@/hooks/queries/use-bounty-queries";
import { BountyDetail } from "@/components/bounties/BountyDetail";
import { ChevronRight } from "lucide-react";

export default function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useGetBounty(id);

  if (error) throw error;
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/bounties" className="hover:text-foreground transition-colors">
          Bounties
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/workspaces/${data.workspace.id}`}
          className="hover:text-foreground transition-colors"
        >
          {data.workspace.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate max-w-md">{data.title}</span>
      </nav>

      <BountyDetail bounty={data} />
    </div>
  );
}

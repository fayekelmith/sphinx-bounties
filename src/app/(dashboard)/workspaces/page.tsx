"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkspaceCard } from "@/components/workspaces/WorkspaceCard";
import { useGetWorkspaces } from "@/hooks/queries";
import { PageHeader, FilterBar, CardGrid, LoadingGrid, EmptyWorkspaces } from "@/components/common";
import { QueryError } from "@/components/errors";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function WorkspacesPage() {
  const [search, setSearch] = useState("");

  const filters = {
    search: search || undefined,
  };

  const { data, isLoading, error, refetch } = useGetWorkspaces(filters);

  const workspaces = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Workspaces" description="Manage your workspaces and teams">
        <Link href="/workspaces/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workspace
          </Button>
        </Link>
      </PageHeader>

      <FilterBar
        searchPlaceholder="Search workspaces..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {error && (
        <QueryError title="Failed to load workspaces" error={error} onRetry={() => refetch()} />
      )}

      {isLoading && <LoadingGrid count={6} columns={3} />}

      {data && !isLoading && (
        <>
          {workspaces.length > 0 ? (
            <CardGrid columns={3}>
              {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </CardGrid>
          ) : (
            <EmptyWorkspaces />
          )}
        </>
      )}
    </div>
  );
}

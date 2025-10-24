"use client";

import { useState } from "react";
import { PersonCard } from "@/components/users/PersonCard";
import { useGetUsers } from "@/hooks/queries";
import { PageHeader, FilterBar, CardGrid, LoadingGrid, EmptyUsers } from "@/components/common";
import { QueryError } from "@/components/errors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = "all" | "top-earners" | "active";

export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filters = {
    search: search || undefined,
  };

  const sortParams =
    activeTab === "top-earners"
      ? { sortBy: "createdAt" as const, sortOrder: "desc" as const }
      : activeTab === "active"
        ? { sortBy: "lastLogin" as const, sortOrder: "desc" as const }
        : undefined;

  const { data, isLoading, error, refetch } = useGetUsers(filters, undefined, sortParams);

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader title="People" description="Discover developers and contributors" />

      <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabValue)}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Contributors</TabsTrigger>
            <TabsTrigger value="top-earners">Top Earners</TabsTrigger>
            <TabsTrigger value="active">Recently Active</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4">
          <FilterBar
            searchPlaceholder="Search people..."
            searchValue={search}
            onSearchChange={setSearch}
          />
        </div>

        {error && (
          <QueryError title="Failed to load people" error={error} onRetry={() => refetch()} />
        )}

        <TabsContent value="all" className="mt-6">
          {isLoading && <LoadingGrid count={6} columns={3} />}

          {!isLoading && users.length > 0 && (
            <CardGrid columns={3}>
              {users.map((person) => (
                <PersonCard key={person.pubkey} person={person} />
              ))}
            </CardGrid>
          )}

          {!isLoading && users.length === 0 && <EmptyUsers />}
        </TabsContent>

        <TabsContent value="top-earners" className="mt-6">
          {isLoading && <LoadingGrid count={6} columns={3} />}

          {!isLoading && users.length > 0 && (
            <CardGrid columns={3}>
              {users.map((person) => (
                <PersonCard key={person.pubkey} person={person} />
              ))}
            </CardGrid>
          )}

          {!isLoading && users.length === 0 && <EmptyUsers />}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {isLoading && <LoadingGrid count={6} columns={3} />}

          {!isLoading && users.length > 0 && (
            <CardGrid columns={3}>
              {users.map((person) => (
                <PersonCard key={person.pubkey} person={person} />
              ))}
            </CardGrid>
          )}

          {!isLoading && users.length === 0 && <EmptyUsers />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

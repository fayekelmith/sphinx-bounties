"use client";

import { use, useState } from "react";
import Link from "next/link";
import { WorkspaceHeader, WorkspaceStats, WorkspaceMembersList } from "@/components/workspaces";
import { SectionHeader, EmptyBounties, EmptyMembers } from "@/components/common";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGetWorkspace, useUpdateMemberRole, useRemoveMember } from "@/hooks/queries";
import { Plus } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";

export default function WorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("bounties");

  const { data: workspace, isLoading, error } = useGetWorkspace(id);
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  if (error) throw error;
  if (isLoading || !workspace) {
    return <div>Loading...</div>;
  }

  const handleUpdateRole = (memberId: string, newRole: string) => {
    const formData = new FormData();
    formData.set("role", newRole);
    updateRoleMutation.mutate({ workspaceId: id, memberId, formData });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberMutation.mutate({ workspaceId: id, memberId });
  };

  const memberCount = workspace.members?.length || 0;

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />

      <WorkspaceStats
        budget={workspace.budget}
        bountyCount={workspace._count?.bounties || 0}
        memberCount={memberCount}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="bounties" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <SectionHeader title="Bounties" />
            <PermissionGate workspaceId={id} requiresAuth>
              <Link href={`/bounties/new?workspace=${id}`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bounty
                </Button>
              </Link>
            </PermissionGate>
          </div>

          <EmptyBounties />
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <SectionHeader title={`Members (${memberCount})`} />
            <PermissionGate workspaceId={id} requiresAny={["OWNER", "ADMIN"]}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </PermissionGate>
          </div>

          {workspace.members && workspace.members.length > 0 ? (
            <WorkspaceMembersList
              workspaceId={id}
              members={workspace.members}
              onUpdateRole={handleUpdateRole}
              onRemoveMember={handleRemoveMember}
            />
          ) : (
            <EmptyMembers />
          )}
        </TabsContent>

        <TabsContent value="budget" className="space-y-4 mt-6">
          <SectionHeader title="Budget Management" />
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <p>Budget details and transactions will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <SectionHeader title="Recent Activity" />
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <p>Activity feed will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

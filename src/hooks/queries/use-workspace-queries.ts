import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginationParams, WorkspaceRole } from "@/types";
import {
  createWorkspaceAction,
  updateWorkspaceAction,
  deleteWorkspaceAction,
  addMemberAction,
  updateMemberRoleAction,
  removeMemberAction,
} from "@/actions";
import { showSuccess, showError } from "@/lib/toast";

export type WorkspaceFilters = {
  search?: string;
  ownerPubkey?: string;
  memberPubkey?: string;
  isPublic?: boolean;
};

export type WorkspaceSortParams = {
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  list: (filters?: WorkspaceFilters, pagination?: PaginationParams, sort?: WorkspaceSortParams) =>
    [...workspaceKeys.lists(), { filters, pagination, sort }] as const,
  details: () => [...workspaceKeys.all, "detail"] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  members: (workspaceId: string) => [...workspaceKeys.all, "members", workspaceId] as const,
  budget: (workspaceId: string) => [...workspaceKeys.all, "budget", workspaceId] as const,
  owner: (ownerPubkey: string) => [...workspaceKeys.all, "owner", ownerPubkey] as const,
  member: (memberPubkey: string) => [...workspaceKeys.all, "member", memberPubkey] as const,
  userRole: (workspaceId: string, userPubkey: string) =>
    [...workspaceKeys.all, "role", workspaceId, userPubkey] as const,
};

async function fetchWorkspaces(
  filters?: WorkspaceFilters,
  pagination?: PaginationParams,
  sort?: WorkspaceSortParams
) {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.ownerPubkey) params.append("ownerPubkey", filters.ownerPubkey);
  if (filters?.memberPubkey) params.append("memberPubkey", filters.memberPubkey);
  if (filters?.isPublic !== undefined) params.append("isPublic", filters.isPublic.toString());
  if (pagination?.page) params.append("page", pagination.page.toString());
  if (pagination?.pageSize) params.append("pageSize", pagination.pageSize.toString());
  if (sort?.sortBy) params.append("sortBy", sort.sortBy);
  if (sort?.sortOrder) params.append("sortOrder", sort.sortOrder);

  const response = await fetch(`/api/workspaces?${params}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch workspaces");

  return response.json();
}

async function fetchWorkspace(id: string) {
  const response = await fetch(`/api/workspaces/${id}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch workspace");

  return response.json();
}

async function fetchWorkspaceMembers(workspaceId: string) {
  const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch members");

  return response.json();
}

async function fetchWorkspaceBudget(workspaceId: string) {
  const response = await fetch(`/api/workspaces/${workspaceId}/budget`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch budget");

  return response.json();
}

export function useGetWorkspaces(
  filters?: WorkspaceFilters,
  pagination?: PaginationParams,
  sort?: WorkspaceSortParams
) {
  return useQuery({
    queryKey: workspaceKeys.list(filters, pagination, sort),
    queryFn: () => fetchWorkspaces(filters, pagination, sort),
  });
}

export function useGetWorkspace(id: string, enabled = true) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => fetchWorkspace(id),
    enabled: enabled && !!id,
  });
}

export function useGetWorkspacesByOwner(ownerPubkey: string) {
  return useQuery({
    queryKey: workspaceKeys.owner(ownerPubkey),
    queryFn: () => fetchWorkspaces({ ownerPubkey }),
    enabled: !!ownerPubkey,
  });
}

export function useGetWorkspacesByMember(memberPubkey: string) {
  return useQuery({
    queryKey: workspaceKeys.member(memberPubkey),
    queryFn: () => fetchWorkspaces({ memberPubkey }),
    enabled: !!memberPubkey,
  });
}

export function useGetWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId),
    queryFn: () => fetchWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useGetWorkspaceBudget(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.budget(workspaceId),
    queryFn: () => fetchWorkspaceBudget(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createWorkspaceAction(formData);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      showSuccess("Workspace created successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to create workspace");
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateWorkspaceAction(id, formData);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      showSuccess("Workspace updated successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update workspace");
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteWorkspaceAction(id);
      return result.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(id) });
      showSuccess("Workspace deleted successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to delete workspace");
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, formData }: { workspaceId: string; formData: FormData }) => {
      const result = await addMemberAction(workspaceId, formData);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.workspaceId) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.workspaceId) });
      showSuccess("Member added successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to add member");
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userPubkey,
      role,
    }: {
      workspaceId: string;
      userPubkey: string;
      role: WorkspaceRole;
    }) => {
      const result = await updateMemberRoleAction(workspaceId, userPubkey, role);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.workspaceId) });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.userRole(variables.workspaceId, variables.userPubkey),
      });
      showSuccess("Member role updated successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update member role");
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userPubkey,
    }: {
      workspaceId: string;
      userPubkey: string;
    }) => {
      const result = await removeMemberAction(workspaceId, userPubkey);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.workspaceId) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.workspaceId) });
      showSuccess("Member removed successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to remove member");
    },
  });
}

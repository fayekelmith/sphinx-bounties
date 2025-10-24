import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginationParams } from "@/types";
import {
  createUserAction,
  updateProfileAction,
  updateSocialLinksAction,
  updateNotificationSettingsAction,
  deleteUserAction,
  verifyGithubAction,
  verifyTwitterAction,
} from "@/actions";
import { showSuccess, showError } from "@/lib/toast";

export type UserFilters = {
  search?: string;
  role?: string;
  isVerified?: boolean;
  hasGithub?: boolean;
  hasTwitter?: boolean;
};

export type UserSortParams = {
  sortBy?: "createdAt" | "lastLogin" | "username";
  sortOrder?: "asc" | "desc";
};

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: UserFilters, pagination?: PaginationParams, sort?: UserSortParams) =>
    [...userKeys.lists(), { filters, pagination, sort }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (pubkey: string) => [...userKeys.details(), pubkey] as const,
  detailByUsername: (username: string) => [...userKeys.details(), "username", username] as const,
  profile: (pubkey: string) => [...userKeys.all, "profile", pubkey] as const,
  githubVerified: () => [...userKeys.all, "github-verified"] as const,
  twitterVerified: () => [...userKeys.all, "twitter-verified"] as const,
};

async function fetchUsers(
  filters?: UserFilters,
  pagination?: PaginationParams,
  sort?: UserSortParams
) {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.role) params.append("role", filters.role);
  if (filters?.isVerified !== undefined) params.append("isVerified", filters.isVerified.toString());
  if (filters?.hasGithub !== undefined) params.append("hasGithub", filters.hasGithub.toString());
  if (filters?.hasTwitter !== undefined) params.append("hasTwitter", filters.hasTwitter.toString());
  if (pagination?.page) params.append("page", pagination.page.toString());
  if (pagination?.pageSize) params.append("pageSize", pagination.pageSize.toString());
  if (sort?.sortBy) params.append("sortBy", sort.sortBy);
  if (sort?.sortOrder) params.append("sortOrder", sort.sortOrder);

  const response = await fetch(`/api/users?${params}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
}

async function fetchUser(pubkey: string) {
  const response = await fetch(`/api/users/${pubkey}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch user");

  return response.json();
}

export function useGetUsers(
  filters?: UserFilters,
  pagination?: PaginationParams,
  sort?: UserSortParams
) {
  return useQuery({
    queryKey: userKeys.list(filters, pagination, sort),
    queryFn: () => fetchUsers(filters, pagination, sort),
  });
}

export function useGetUser(pubkey: string, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(pubkey),
    queryFn: () => fetchUser(pubkey),
    enabled: enabled && !!pubkey,
  });
}

export function useGetUserByUsername(username: string, enabled = true) {
  return useQuery({
    queryKey: userKeys.detailByUsername(username),
    queryFn: () => fetchUsers({ search: username }),
    enabled: enabled && !!username,
  });
}

export function useGetGithubVerifiedUsers() {
  return useQuery({
    queryKey: userKeys.githubVerified(),
    queryFn: () => fetchUsers({ hasGithub: true }),
  });
}

export function useGetTwitterVerifiedUsers() {
  return useQuery({
    queryKey: userKeys.twitterVerified(),
    queryFn: () => fetchUsers({ hasTwitter: true }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createUserAction(formData);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showSuccess("User created successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to create user");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateProfileAction(formData);
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.pubkey) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.pubkey) });
        queryClient.invalidateQueries({ queryKey: userKeys.profile(data.pubkey) });
      }
      showSuccess("Profile updated successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update profile");
    },
  });
}

export function useUpdateSocialLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateSocialLinksAction(formData);
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.pubkey) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.pubkey) });
      }
      showSuccess("Social links updated successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update social links");
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateNotificationSettingsAction(formData);
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.pubkey) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.pubkey) });
      }
      showSuccess("Notification settings updated successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update notification settings");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pubkey: string) => {
      const result = await deleteUserAction(pubkey);
      return result.data;
    },
    onSuccess: (data, pubkey) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(pubkey) });
      showSuccess("User deleted successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to delete user");
    },
  });
}

export function useVerifyGithub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyGithubAction(code);
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.pubkey) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.pubkey) });
      }
      showSuccess("GitHub account verified successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to verify GitHub account");
    },
  });
}

export function useVerifyTwitter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyTwitterAction(code);
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.pubkey) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.pubkey) });
      }
      showSuccess("Twitter account verified successfully");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to verify Twitter account");
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { District, Donation, Donor, Paginated, Upazila, UserProfile } from "@/lib/types";

export interface DonorFilters {
  blood_group?: string;
  district_id?: string;
  upazila_id?: string;
  page?: number;
}

/** Access token from the NextAuth session (undefined while loading/anonymous). */
export function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.accessToken;
}

export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: () => api<District[]>("/area/district/"),
    staleTime: Infinity, // static geographic data
  });
}

export function useUpazilas(districtId?: number | string) {
  return useQuery({
    queryKey: ["upazilas", String(districtId)],
    queryFn: () => api<Upazila[]>(`/area/upazila/?district_id=${districtId}`),
    enabled: Boolean(districtId),
    staleTime: Infinity,
  });
}

export function useDonors(filters: DonorFilters) {
  const token = useAccessToken();
  const params = new URLSearchParams();
  if (filters.blood_group) params.set("blood_group", filters.blood_group);
  if (filters.district_id) params.set("district_id", filters.district_id);
  if (filters.upazila_id) params.set("upazila_id", filters.upazila_id);
  params.set("page", String(filters.page ?? 1));

  return useQuery({
    queryKey: ["donors", params.toString()],
    queryFn: () => api<Paginated<Donor>>(`/users/?${params}`, { token }),
    enabled: Boolean(token),
    placeholderData: (previous) => previous, // keep the grid while paging
  });
}

export function useProfile() {
  const token = useAccessToken();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api<UserProfile>("/users/profile/", { token }),
    enabled: Boolean(token),
  });
}

export function useUpdateProfile() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api<UserProfile>("/users/profile/", { method: "PUT", body, token }),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useDonations() {
  const token = useAccessToken();
  return useQuery({
    queryKey: ["donations"],
    queryFn: () => api<Donation[]>("/users/donate/", { token }),
    enabled: Boolean(token),
  });
}

export function useAddDonation() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { date: string; amount: number; note?: string }) =>
      api<{ success: boolean; message: string }>("/users/donate/", { method: "POST", body, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useDeleteDonation() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (donationId: number) =>
      api<{ success: boolean; message: string }>("/users/donate/", {
        method: "DELETE",
        body: { donation_id: donationId },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

/** Donor availability toggle (backend field: is_donate, endpoint: is_active). */
export function useToggleAvailability() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      api<{ success: boolean; message: string }>("/users/is_active/", {
        method: "POST",
        body: { is_active: isAvailable },
        token,
      }),
    onMutate: async (isAvailable) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      const previous = queryClient.getQueryData<UserProfile>(["profile"]);
      if (previous) {
        queryClient.setQueryData<UserProfile>(["profile"], { ...previous, is_donate: isAvailable });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(["profile"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

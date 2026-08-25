import { supabase } from "@/lib/supabase";
import type { ProfileRow } from "@/types/database";

export type ProfileFilters = {
  role?: string;
  status?: string;
  search?: string;
};

export async function listProfiles(filters: ProfileFilters = {}) {
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.role && filters.role !== "all") query = query.eq("role", filters.role);
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,university.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ProfileRow;
}

export async function updateProfile(id: string, updates: Partial<ProfileRow>) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteProfile(id: string) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

export async function countProfiles() {
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

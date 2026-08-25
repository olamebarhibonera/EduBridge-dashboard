import { supabase } from "@/lib/supabase";
import type { ServiceRow } from "@/types/database";

export async function listServices(filters: { category?: string; search?: string } = {}) {
  let query = supabase.from("services").select("*").order("created_at", { ascending: false });

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

export async function createService(
  row: Pick<
    ServiceRow,
    "name" | "category" | "description" | "address" | "phone" | "email" | "website" | "is_active"
  >
) {
  const { error } = await supabase.from("services").insert(row);
  if (error) throw error;
}

export async function updateService(id: string, updates: Partial<ServiceRow>) {
  const { error } = await supabase.from("services").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function countServices() {
  const { count, error } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

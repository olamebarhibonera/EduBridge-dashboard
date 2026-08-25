import { supabase } from "@/lib/supabase";
import type { TranslationRow } from "@/types/database";

export async function listTranslations(filters: { category?: string; search?: string } = {}) {
  let query = supabase
    .from("translations")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.search) {
    query = query.or(
      `source_text.ilike.%${filters.search}%,translated_text.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TranslationRow[];
}

export async function createTranslation(
  row: Pick<
    TranslationRow,
    | "source_text"
    | "translated_text"
    | "source_language"
    | "target_language"
    | "category"
    | "is_verified"
  >
) {
  const { error } = await supabase.from("translations").insert(row);
  if (error) throw error;
}

export async function updateTranslation(id: string, updates: Partial<TranslationRow>) {
  const { error } = await supabase.from("translations").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteTranslation(id: string) {
  const { error } = await supabase.from("translations").delete().eq("id", id);
  if (error) throw error;
}

export async function countTranslations() {
  const { count, error } = await supabase
    .from("translations")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

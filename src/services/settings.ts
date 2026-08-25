import { supabase } from "@/lib/supabase";
import type { AppSettingRow } from "@/types/database";

export async function listSettings() {
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) throw error;
  return (data ?? []) as Pick<AppSettingRow, "key" | "value">[];
}

export async function upsertSettings(
  entries: Array<{ key: string; value: unknown; updated_by?: string | null }>
) {
  for (const entry of entries) {
    const { error } = await supabase.from("app_settings").upsert(entry, { onConflict: "key" });
    if (error) throw error;
  }
}

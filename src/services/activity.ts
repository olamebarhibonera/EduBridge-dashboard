import { supabase } from "@/lib/supabase";
import type { ActivityLogRow } from "@/types/database";

export async function listRecentActivity(limit = 10) {
  const { data, error } = await supabase
    .from("activity_log")
    .select("action, entity_type, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Pick<
    ActivityLogRow,
    "action" | "entity_type" | "created_at" | "user_id"
  >[];
}

export async function logActivity(entry: {
  action: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabase.from("activity_log").insert(entry);
  if (error) throw error;
}

import { supabase } from "@/lib/supabase";
import type { AnnouncementRow } from "@/types/database";

export async function listAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnnouncementRow[];
}

export async function createAnnouncement(
  row: Pick<
    AnnouncementRow,
    "title" | "content" | "priority" | "target_audience" | "is_active" | "expires_at"
  >
) {
  const { error } = await supabase.from("announcements").insert(row);
  if (error) throw error;
}

export async function updateAnnouncement(id: string, updates: Partial<AnnouncementRow>) {
  const { error } = await supabase.from("announcements").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

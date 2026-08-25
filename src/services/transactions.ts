import { supabase } from "@/lib/supabase";
import type { TransactionRow } from "@/types/database";

export async function listTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TransactionRow[];
}

export async function countTransactions() {
  const { count, error } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

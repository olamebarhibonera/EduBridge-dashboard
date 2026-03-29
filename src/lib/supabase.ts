import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://xhitkkmtytcakjqytlnm.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaXRra210eXRjYWtqcXl0bG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTU2MTEsImV4cCI6MjA4NzA5MTYxMX0.ngCbkwn_f2f8nYiKzS1qCx0rSgbYFsQ4-pqBdsy7kOo";

const locks = new Map<string, Promise<unknown>>();

/**
 * In-memory lock that replaces the browser Navigator Lock API.
 * Prevents the "Lock not released within 5000ms" errors caused
 * by concurrent auth requests.
 */
async function inMemoryLock<R>(
  name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> {
  const existing = locks.get(name);
  if (existing) {
    await existing.catch(() => {});
  }

  const promise = fn();
  locks.set(name, promise);

  try {
    return await promise;
  } finally {
    if (locks.get(name) === promise) {
      locks.delete(name);
    }
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: "edubridge-admin-auth",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    lock: inMemoryLock,
  },
});

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env."
  );
}

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

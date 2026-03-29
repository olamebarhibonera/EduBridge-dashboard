import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://xhitkkmtytcakjqytlnm.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaXRra210eXRjYWtqcXl0bG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTU2MTEsImV4cCI6MjA4NzA5MTYxMX0.ngCbkwn_f2f8nYiKzS1qCx0rSgbYFsQ4-pqBdsy7kOo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: "edubridge-admin-auth",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

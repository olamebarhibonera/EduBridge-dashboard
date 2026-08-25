import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/profiles";
import type { ProfileRow } from "@/types/database";

interface AuthContextType {
  user: ProfileRow | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileRow | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const handleSession = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      setSession(currentSession);
      try {
        const profile = await getProfile(currentSession.user.id);
        setUser(profile);
      } catch {
        setUser(null);
      }
    } else {
      setSession(null);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      await handleSession(currentSession);
    } catch (error) {
      console.error("Session refresh error:", error);
      setSession(null);
      setUser(null);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      await handleSession(currentSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        handleSession(currentSession).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAdmin, signOut, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type UserRole = 'cliente' | 'operador' | 'admin' | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error obteniendo sesión:', error.message);
      }

      if (!mounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchUserRole = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setRole(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (cancelled) return;

      if (error) {
        console.error('Error obteniendo el rol del perfil:', error.message);
        setRole(null);
      } else {
        setRole((data?.role as UserRole) ?? null);
      }

      setProfileLoading(false);
    };

    fetchUserRole();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error cerrando sesión:', error.message);
      return;
    }

    setSession(null);
    setUser(null);
    setRole(null);
    setProfileLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      role,
      loading,
      profileLoading,
      signOut,
    }),
    [user, session, role, loading, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
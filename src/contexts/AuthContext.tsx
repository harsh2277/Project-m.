import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  AuthContextType,
  Profile,
  ProfileUpdate,
  SignUpInput,
  UserSettings,
  UserSettingsUpdate,
} from '../types/auth';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/* ─── Context ───────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Helper: load profile row ─────────────────────────────── */
async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, avatar_url, job_title, company_name, bio, terms_accepted_at, onboarding_completed, created_at, updated_at')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('[AuthContext] fetchProfile error:', error.code, error.message);
      return null;
    }
    return data as Profile;
  } catch (e) {
    console.warn('[AuthContext] fetchProfile threw:', e);
    return null;
  }
}

async function fetchSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      console.warn('[AuthContext] fetchSettings error:', error.message);
      return null;
    }
    return data as UserSettings;
  } catch (e) {
    console.warn('[AuthContext] fetchSettings threw:', e);
    return null;
  }
}

/* ─── Provider ──────────────────────────────────────────────── */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    /**
     * onAuthStateChange fires INITIAL_SESSION on mount by reading localStorage
     * directly — no network needed when the token is still valid.
     * If the token is expired, Supabase refreshes it in the background and
     * fires TOKEN_REFRESHED once done. We never clear the session on timeout.
     */
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;

        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          const [p, userSettings] = await Promise.all([
            fetchProfile(s.user.id),
            fetchSettings(s.user.id),
          ]);
          if (mounted) setProfile(p);
          if (mounted) setSettings(userSettings);
        } else {
          // Clear profile only on explicit sign-out
          if (event === 'SIGNED_OUT') {
            setProfile(null);
            setSettings(null);
          }
        }

        // End the spinner once we have any auth answer
        if (mounted) setLoading(false);
      },
    );

    /**
     * getSession() is called here only to TRIGGER the INITIAL_SESSION event
     * on the listener above (required by Supabase JS v2).
     * We don't use its return value for session state — onAuthStateChange owns that.
     * Errors here are non-fatal; the 10-sec fallback below will end loading if needed.
     */
    supabase.auth.getSession().catch((err) => {
      console.error('[AuthContext] getSession error:', err);
    });

    // Last-resort fallback: if onAuthStateChange never fires (e.g. network is
    // completely down), stop the spinner after 10 s so the user sees the login page.
    // We do NOT clear session here — if Supabase comes back online it will fire
    // TOKEN_REFRESHED and restore the session automatically.
    const fallback = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 10_000);

    return () => {
      mounted = false;
      clearTimeout(fallback);
      listener.subscription.unsubscribe();
    };
  }, []);

  /* signIn */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  /* signUp */
  const signUp = useCallback(async (input: SignUpInput) => {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          terms_accepted: input.termsAccepted,
        },
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  /* signOut — clears local state immediately so PublicRoute sees session=null
     before the Supabase network round-trip completes */
  const signOut = useCallback(async () => {
    // 1. Wipe local state right away (synchronous) so the UI reacts instantly
    setSession(null);
    setUser(null);
    setProfile(null);
    setSettings(null);
    // 2. Tell Supabase to invalidate the server-side token (async, non-blocking)
    const { error } = await supabase.auth.signOut();
    if (error) console.error('[AuthContext] signOut error:', error.message);
  }, []);

  /* resetPassword */
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw new Error(error.message);
  }, []);

  /* updateProfile — always UPDATE (row is guaranteed by the signup trigger) */
  const updateProfile = useCallback(
    async (data: ProfileUpdate) => {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('[AuthContext] updateProfile error:', error.code, error.message, error.details);
        throw new Error(error.message);
      }

      // Re-fetch so local state matches the DB
      const p = await fetchProfile(user.id);
      if (p) setProfile(p);
    },
    [user],
  );

  /* updateSettings — upsert because settings row may not exist on older accounts */
  const updateSettings = useCallback(
    async (data: UserSettingsUpdate) => {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, ...data }, { onConflict: 'user_id' });

      if (error) {
        console.error('[AuthContext] updateSettings error:', error.code, error.message, error.details);
        throw new Error(error.message);
      }

      const userSettings = await fetchSettings(user.id);
      if (userSettings) setSettings(userSettings);
    },
    [user],
  );

  const value: AuthContextType = {
    session,
    user,
    profile,
    settings,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ─── Hook ──────────────────────────────────────────────────── */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

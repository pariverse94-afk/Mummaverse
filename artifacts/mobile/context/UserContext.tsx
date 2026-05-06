import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  familyName: string;
  email?: string;
}

interface UserContextValue {
  session: Session | null;
  profile: UserProfile | null;
  isLoaded: boolean;
  saveProfile: (name: string, familyName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Per-user cache so profile survives sign-out → sign-in for the same account.
// Changing the prefix version forces a fresh load if the schema ever changes.
const PROFILE_CACHE_PREFIX = "parivaar_profile_v5_";
const UserContext = createContext<UserContextValue | null>(null);

function profileCacheKey(userId: string) {
  return `${PROFILE_CACHE_PREFIX}${userId}`;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Prevent concurrent loadProfile calls (getSession + onAuthStateChange can both fire)
  const loadingRef = useRef(false);

  async function loadProfile(authId: string, email?: string) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      // 1. Try Supabase DB (only works after migration_auth.sql is run)
      try {
        const { data, error } = await (supabase.from("parivaar_users") as any)
          .select("id, name, family_name, email")
          .eq("auth_id", authId)
          .maybeSingle();

        if (data && !error) {
          const p: UserProfile = {
            id: data.id,
            name: data.name,
            familyName: data.family_name,
            email: data.email ?? email,
          };
          setProfile(p);
          // Refresh the per-user cache with the latest DB data
          await AsyncStorage.setItem(profileCacheKey(authId), JSON.stringify(p));
          return;
        }
      } catch {
        // DB query failed (e.g. auth_id column missing) — fall through to cache
      }

      // 2. Fall back to the per-user AsyncStorage cache.
      //    This cache survives sign-out so returning users don't re-enter their name.
      const cached = await AsyncStorage.getItem(profileCacheKey(authId));
      if (cached) {
        setProfile(JSON.parse(cached));
        return;
      }

      // 3. New user — needs onboarding
      setProfile(null);
    } finally {
      setIsLoaded(true);
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        loadProfile(s.user.id, s.user.email ?? undefined);
      } else {
        setIsLoaded(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        loadingRef.current = false;
        await loadProfile(s.user.id, s.user.email ?? undefined);
      } else {
        setProfile(null);
        setIsLoaded(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Saves the user's profile locally and best-effort to Supabase.
   * NEVER throws — callers can always await without try/catch.
   */
  const saveProfile = useCallback(async (name: string, familyName: string) => {
    // Resolve the current auth user
    let authUser = session?.user ?? null;
    if (!authUser) {
      try {
        const { data } = await supabase.auth.getUser();
        authUser = data.user;
      } catch {
        // Network error — will save locally only
      }
    }

    const userId = authUser?.id ?? `anon_${Date.now()}`;
    const cacheKey = profileCacheKey(userId);

    // Best-effort Supabase upsert (fails gracefully if migration_auth.sql not yet run)
    let dbId: string | null = null;
    if (authUser) {
      try {
        const { data, error } = await (supabase.from("parivaar_users") as any)
          .upsert(
            { auth_id: authUser.id, email: authUser.email, name, family_name: familyName },
            { onConflict: "auth_id" },
          )
          .select("id")
          .single();
        if (!error && data?.id) dbId = data.id;
      } catch {
        // DB save failed — local only is fine
      }
    }

    const id = dbId ?? `auth_${userId}`;
    const p: UserProfile = { id, name, familyName, email: authUser?.email ?? undefined };

    // Always persist to per-user cache — this is the source of truth until DB is set up
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(p));
    } catch {
      // AsyncStorage failure is very unlikely; profile is still set in memory
    }

    setProfile(p);
    // saveProfile intentionally does NOT throw — NavigationGuard will react to setProfile
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Clear family/meal data but NOT the per-user profile cache.
    // The cache is keyed by user ID, so it won't bleed across different accounts,
    // and keeping it means returning users skip onboarding on next sign-in.
    await AsyncStorage.multiRemove([
      "parivaar_members_v2",
      "parivaar_chores_v2",
      "parivaar_meals_v2",
    ]);
    setProfile(null);
    setSession(null);
  }, []);

  return (
    <UserContext.Provider value={{ session, profile, isLoaded, saveProfile, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

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

const PROFILE_CACHE_KEY = "parivaar_user_profile_v3";
const UserContext = createContext<UserContextValue | null>(null);

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
        await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(p));
      } else {
        // No DB row yet (auth_id column missing, or new user) — try cache
        const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          // Accept any cached profile; it was cleared on sign-out so it belongs
          // to the current auth session
          setProfile(JSON.parse(cached));
        } else {
          setProfile(null);
        }
      }
    } catch {
      // Network failure — try cache so the app works offline
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) setProfile(JSON.parse(cached));
      else setProfile(null);
    } finally {
      setIsLoaded(true);
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    let mounted = true;

    // getSession() reads persisted tokens; onAuthStateChange fires for URL-based
    // PKCE code exchange. We guard with loadingRef so only one loadProfile runs.
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
        // Reset loadingRef so this auth state change always triggers a load
        loadingRef.current = false;
        await loadProfile(s.user.id, s.user.email ?? undefined);
      } else {
        setProfile(null);
        await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
        setIsLoaded(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const saveProfile = useCallback(async (name: string, familyName: string) => {
    // Prefer React state; fall back to a live Supabase getUser call
    let authUser = session?.user ?? null;
    if (!authUser) {
      const { data } = await supabase.auth.getUser();
      authUser = data.user;
    }
    if (!authUser) throw new Error("Not authenticated. Please sign in again.");

    const { data, error } = await (supabase.from("parivaar_users") as any)
      .upsert(
        { auth_id: authUser.id, email: authUser.email, name, family_name: familyName },
        { onConflict: "auth_id" }
      )
      .select("id")
      .single();

    // If DB fails (e.g. migration_auth.sql not run yet), use a synthetic local id
    const id = (!error && data?.id) ? data.id : `auth_${authUser.id}`;
    const p: UserProfile = { id, name, familyName, email: authUser.email ?? undefined };
    await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(p));
    setProfile(p);
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await AsyncStorage.multiRemove([
      PROFILE_CACHE_KEY,
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

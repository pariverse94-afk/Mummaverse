import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
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

  async function loadProfile(authId: string, email?: string) {
    try {
      const { data } = await (supabase.from("parivaar_users") as any)
        .select("id, name, family_name, email")
        .eq("auth_id", authId)
        .maybeSingle();

      if (data) {
        const p: UserProfile = {
          id: data.id,
          name: data.name,
          familyName: data.family_name,
          email: data.email ?? email,
        };
        setProfile(p);
        await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(p));
      } else {
        // No row yet — check cache for offline
        const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          const p = JSON.parse(cached) as UserProfile;
          if (p.id.startsWith("auth_")) setProfile(p);
          else setProfile(null);
        } else {
          setProfile(null);
        }
      }
    } catch {
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) setProfile(JSON.parse(cached));
      else setProfile(null);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        loadProfile(s.user.id, s.user.email);
      } else {
        setIsLoaded(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
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
    const authUser = session?.user ?? (await supabase.auth.getUser()).data.user;
    if (!authUser) return;

    const { data, error } = await (supabase.from("parivaar_users") as any)
      .upsert(
        { auth_id: authUser.id, email: authUser.email, name, family_name: familyName },
        { onConflict: "auth_id" }
      )
      .select("id")
      .single();

    const id = (!error && data) ? data.id : `auth_${authUser.id}`;
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

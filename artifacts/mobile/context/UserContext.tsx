import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  familyName: string;
}

interface UserContextValue {
  profile: UserProfile | null;
  isLoaded: boolean;
  saveProfile: (name: string, familyName: string) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const STORAGE_KEY = "parivaar_user_profile_v2";
const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => { if (data) setProfile(JSON.parse(data)); })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const saveProfile = useCallback(async (name: string, familyName: string) => {
    let id: string | null = profile?.id ?? null;

    // Upsert to Supabase
    try {
      if (id) {
        await (supabase.from("parivaar_users") as any).update({ name, family_name: familyName }).eq("id", id);
      } else {
        const { data, error } = await (supabase.from("parivaar_users") as any)
          .insert({ name, family_name: familyName })
          .select("id")
          .single();
        if (!error && data) id = (data as any).id;
      }
    } catch {}

    // Fallback: generate local ID if Supabase unavailable
    if (!id) id = `local_${Date.now()}`;

    const p: UserProfile = { id, name, familyName };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }, [profile]);

  const clearProfile = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return (
    <UserContext.Provider value={{ profile, isLoaded, saveProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

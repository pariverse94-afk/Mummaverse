import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface FamilyMember {
  id: string;
  name: string;
  role: "parent" | "child";
  color: string;
  invitedEmail?: string;
  isOnApp?: boolean;
}

export interface Chore {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  category: "cleaning" | "cooking" | "shopping" | "childcare" | "other";
  recurring: "daily" | "weekly" | null;
  createdAt: string;
}

interface FamilyContextValue {
  members: FamilyMember[];
  chores: Chore[];
  userId: string | null;
  setUserId: (id: string) => void;
  addMember: (name: string, role: FamilyMember["role"], invitedEmail?: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMemberEmail: (memberId: string, email: string) => Promise<void>;
  addChore: (chore: Omit<Chore, "id" | "createdAt" | "completed">) => Promise<void>;
  toggleChore: (id: string) => Promise<void>;
  deleteChore: (id: string) => Promise<void>;
}

const MEMBER_COLORS = [
  "#E07B39", "#2D6A4F", "#C44B2B", "#7B5EA7", "#2E86AB",
  "#E8A838", "#D45087", "#3B82F6", "#10B981", "#F59E0B",
];

const STORAGE_KEYS = {
  members: "parivaar_members_v2",
  chores: "parivaar_chores_v2",
};

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "m1", name: "Priya", role: "parent", color: "#E07B39" },
  { id: "m2", name: "Rahul", role: "parent", color: "#2D6A4F" },
  { id: "m3", name: "Aryan", role: "child", color: "#7B5EA7" },
];

const DEFAULT_CHORES: Chore[] = [
  { id: "c1", title: "Make breakfast", assignedTo: "m1", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c2", title: "School drop-off", assignedTo: "m2", completed: false, category: "childcare", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c3", title: "Tidy bedroom", assignedTo: "m3", completed: true, category: "cleaning", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c4", title: "Grocery run", assignedTo: "m1", completed: false, category: "shopping", recurring: "weekly", createdAt: new Date().toISOString() },
  { id: "c5", title: "Dishes after dinner", assignedTo: "m2", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
];

function generateId() {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_MEMBERS);
  const [chores, setChores] = useState<Chore[]>(DEFAULT_CHORES);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [storedMembers, storedChores] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.members),
          AsyncStorage.getItem(STORAGE_KEYS.chores),
        ]);
        if (storedMembers) setMembers(JSON.parse(storedMembers));
        if (storedChores) setChores(JSON.parse(storedChores));
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!userId) return;
    syncFromSupabase(userId);
  }, [userId]);

  async function syncFromSupabase(uid: string) {
    try {
      const [{ data: membersData }, { data: choresData }] = await Promise.all([
        supabase.from("family_members").select("*").eq("user_id", uid).order("created_at"),
        supabase.from("chores").select("*").eq("user_id", uid).order("created_at"),
      ]);

      if (membersData && membersData.length > 0) {
        // Batch-check which invited emails are registered on the app
        const invitedEmails = (membersData as any[])
          .map((m) => m.invited_email)
          .filter(Boolean) as string[];

        const onAppEmails = new Set<string>();
        if (invitedEmails.length > 0) {
          const { data: users } = await (supabase.from("parivaar_users") as any)
            .select("email")
            .in("email", invitedEmails);
          if (users) {
            (users as any[]).forEach((u) => { if (u.email) onAppEmails.add(u.email); });
          }
        }

        const mapped: FamilyMember[] = (membersData as any[]).map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role as FamilyMember["role"],
          color: m.color,
          invitedEmail: m.invited_email ?? undefined,
          isOnApp: m.invited_email ? onAppEmails.has(m.invited_email) : undefined,
        }));
        setMembers(mapped);
        AsyncStorage.setItem(STORAGE_KEYS.members, JSON.stringify(mapped));
      } else if (membersData && membersData.length === 0) {
        await pushDefaultsToSupabase(uid);
      }

      if (choresData && choresData.length > 0) {
        const mapped: Chore[] = (choresData as any[]).map((c) => ({
          id: c.id,
          title: c.title,
          assignedTo: c.assigned_to,
          completed: c.completed,
          category: c.category as Chore["category"],
          recurring: c.recurring as Chore["recurring"],
          createdAt: c.created_at,
        }));
        setChores(mapped);
        AsyncStorage.setItem(STORAGE_KEYS.chores, JSON.stringify(mapped));
      }
    } catch {}
  }

  async function pushDefaultsToSupabase(uid: string) {
    try {
      const memberInserts = DEFAULT_MEMBERS.map((m) => ({
        user_id: uid,
        name: m.name,
        role: m.role,
        color: m.color,
      }));
      const { data: inserted } = await supabase
        .from("family_members")
        .insert(memberInserts)
        .select("id,name");

      const idMap: Record<string, string> = {};
      if (inserted) {
        DEFAULT_MEMBERS.forEach((dm, i) => {
          if ((inserted as any[])[i]) idMap[dm.id] = (inserted as any[])[i].id;
        });
      }

      const choreInserts = DEFAULT_CHORES.map((c) => ({
        user_id: uid,
        title: c.title,
        assigned_to: idMap[c.assignedTo] ?? c.assignedTo,
        completed: c.completed,
        category: c.category,
        recurring: c.recurring,
      }));
      await supabase.from("chores").insert(choreInserts);
      await syncFromSupabase(uid);
    } catch {}
  }

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  }, [members, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.chores, JSON.stringify(chores));
  }, [chores, loaded]);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
  }, []);

  const addMember = useCallback(async (name: string, role: FamilyMember["role"], invitedEmail?: string) => {
    const color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    const localId = generateId();

    setMembers((prev) => [
      ...prev,
      { id: localId, name, role, color, invitedEmail, isOnApp: undefined },
    ]);

    if (userId) {
      const { data } = await supabase
        .from("family_members")
        .insert({ user_id: userId, name, role, color, invited_email: invitedEmail ?? null })
        .select("id")
        .single();
      if (data) {
        setMembers((prev) =>
          prev.map((m) => (m.id === localId ? { ...m, id: (data as any).id } : m))
        );
      }
    }
  }, [userId]);

  const deleteMember = useCallback(async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setChores((prev) => prev.filter((c) => c.assignedTo !== id));
    if (userId) {
      await supabase.from("family_members").delete().eq("id", id).eq("user_id", userId);
    }
  }, [userId]);

  const updateMemberEmail = useCallback(async (memberId: string, email: string) => {
    const trimmed = email.trim().toLowerCase();

    // Check if this email is registered on the app
    let isOnApp = false;
    try {
      const { data } = await (supabase.from("parivaar_users") as any)
        .select("id")
        .eq("email", trimmed)
        .maybeSingle();
      isOnApp = data !== null;
    } catch {}

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, invitedEmail: trimmed, isOnApp } : m
      )
    );

    if (userId) {
      await supabase
        .from("family_members")
        .update({ invited_email: trimmed })
        .eq("id", memberId)
        .eq("user_id", userId);
    }
  }, [userId]);

  const addChore = useCallback(async (chore: Omit<Chore, "id" | "createdAt" | "completed">) => {
    const localId = generateId();
    const now = new Date().toISOString();
    setChores((prev) => [...prev, { ...chore, id: localId, completed: false, createdAt: now }]);

    if (userId) {
      const { data } = await supabase
        .from("chores")
        .insert({
          user_id: userId,
          title: chore.title,
          assigned_to: chore.assignedTo,
          completed: false,
          category: chore.category,
          recurring: chore.recurring,
        })
        .select("id")
        .single();
      if (data) {
        setChores((prev) =>
          prev.map((c) => (c.id === localId ? { ...c, id: (data as any).id } : c))
        );
      }
    }
  }, [userId]);

  const toggleChore = useCallback(async (id: string) => {
    let newCompleted = false;
    setChores((prev) =>
      prev.map((c) => {
        if (c.id === id) { newCompleted = !c.completed; return { ...c, completed: newCompleted }; }
        return c;
      })
    );
    if (userId) {
      await supabase.from("chores").update({ completed: newCompleted }).eq("id", id).eq("user_id", userId);
    }
  }, [userId]);

  const deleteChore = useCallback(async (id: string) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
    if (userId) {
      await supabase.from("chores").delete().eq("id", id).eq("user_id", userId);
    }
  }, [userId]);

  return (
    <FamilyContext.Provider value={{
      members, chores, userId, setUserId,
      addMember, deleteMember, updateMemberEmail,
      addChore, toggleChore, deleteChore,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}

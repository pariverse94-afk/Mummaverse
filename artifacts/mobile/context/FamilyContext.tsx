import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface FamilyMember {
  id: string;
  name: string;
  role: "parent" | "child";
  color: string;
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
  addMember: (name: string, role: FamilyMember["role"]) => void;
  deleteMember: (id: string) => void;
  addChore: (chore: Omit<Chore, "id" | "createdAt" | "completed">) => void;
  toggleChore: (id: string) => void;
  deleteChore: (id: string) => void;
}

const MEMBER_COLORS = [
  "#E07B39", "#2D6A4F", "#C44B2B", "#7B5EA7", "#2E86AB",
  "#E8A838", "#D45087", "#3B82F6", "#10B981", "#F59E0B",
];

const STORAGE_KEYS = {
  members: "parivaar_members",
  chores: "parivaar_chores",
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "1", name: "Priya", role: "parent", color: "#E07B39" },
  { id: "2", name: "Rahul", role: "parent", color: "#2D6A4F" },
  { id: "3", name: "Aryan", role: "child", color: "#7B5EA7" },
];

const DEFAULT_CHORES: Chore[] = [
  { id: "c1", title: "Make breakfast", assignedTo: "1", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c2", title: "School drop-off", assignedTo: "2", completed: false, category: "childcare", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c3", title: "Tidy bedroom", assignedTo: "3", completed: true, category: "cleaning", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c4", title: "Grocery run", assignedTo: "1", completed: false, category: "shopping", recurring: "weekly", createdAt: new Date().toISOString() },
  { id: "c5", title: "Dishes after dinner", assignedTo: "2", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
];

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_MEMBERS);
  const [chores, setChores] = useState<Chore[]>(DEFAULT_CHORES);
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
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  }, [members, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.chores, JSON.stringify(chores));
  }, [chores, loaded]);

  const addMember = useCallback((name: string, role: FamilyMember["role"]) => {
    const color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    setMembers((prev) => [...prev, { id: generateId(), name, role, color }]);
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setChores((prev) => prev.filter((c) => c.assignedTo !== id));
  }, []);

  const addChore = useCallback((chore: Omit<Chore, "id" | "createdAt" | "completed">) => {
    setChores((prev) => [
      ...prev,
      { ...chore, id: generateId(), completed: false, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const toggleChore = useCallback((id: string) => {
    setChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  }, []);

  const deleteChore = useCallback((id: string) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <FamilyContext.Provider value={{ members, chores, addMember, deleteMember, addChore, toggleChore, deleteChore }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface MealEntry {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  ingredients: string[];
  prepTime: string;
  nutritionHighlights?: string;
}

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type MealSlot = "breakfast" | "lunch" | "dinner";

export type WeeklyPlan = {
  [day in DayKey]: { breakfast?: MealEntry; lunch?: MealEntry; dinner?: MealEntry };
};

interface MealContextValue {
  weeklyPlan: WeeklyPlan;
  inventory: string[];
  preferences: string[];
  nutritionalGoals: string[];
  userId: string | null;
  setUserId: (id: string) => void;
  setMeal: (day: DayKey, slot: MealSlot, meal: MealEntry | undefined) => void;
  addInventoryItem: (item: string) => void;
  removeInventoryItem: (item: string) => void;
  setPreferences: (prefs: string[]) => void;
  setNutritionalGoals: (goals: string[]) => void;
}

const EMPTY_PLAN: WeeklyPlan = {
  Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {},
};

const DEFAULT_INVENTORY = [
  "Rice", "Dal (lentils)", "Onions", "Tomatoes", "Potatoes",
  "Garlic", "Ginger", "Cumin", "Turmeric", "Mustard seeds",
  "Coriander", "Paneer", "Yogurt", "Ghee", "Wheat flour",
];

const DEFAULT_PREFERENCES = ["Vegetarian", "No MSG"];
const DEFAULT_GOALS = ["High protein", "Low oil"];

const STORAGE_KEY = "parivaar_meals_v2";
const MealContext = createContext<MealContextValue | null>(null);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({ ...EMPTY_PLAN });
  const [inventory, setInventory] = useState<string[]>(DEFAULT_INVENTORY);
  const [preferences, setPreferences] = useState<string[]>(DEFAULT_PREFERENCES);
  const [nutritionalGoals, setNutritionalGoals] = useState<string[]>(DEFAULT_GOALS);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.weeklyPlan) setWeeklyPlan(data.weeklyPlan);
          if (data.inventory) setInventory(data.inventory);
          if (data.preferences) setPreferences(data.preferences);
          if (data.nutritionalGoals) setNutritionalGoals(data.nutritionalGoals);
        }
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
      const [{ data: mealData }, { data: inventoryData }] = await Promise.all([
        supabase.from("meal_plans").select("*").eq("user_id", uid),
        supabase.from("inventory_items").select("name").eq("user_id", uid),
      ]);

      if (mealData && mealData.length > 0) {
        const plan: WeeklyPlan = { ...EMPTY_PLAN };
        for (const row of mealData) {
          const day = row.day_key as DayKey;
          const slot = row.slot as MealSlot;
          if (plan[day]) {
            plan[day][slot] = {
              id: row.id,
              name: row.meal_name,
              nameHindi: row.meal_name_hindi ?? undefined,
              description: row.description,
              ingredients: row.ingredients ?? [],
              prepTime: row.prep_time,
              nutritionHighlights: row.nutrition_highlights ?? undefined,
            };
          }
        }
        setWeeklyPlan(plan);
      }

      if (inventoryData && inventoryData.length > 0) {
        setInventory(inventoryData.map((i) => i.name));
      } else if (inventoryData && inventoryData.length === 0 && uid) {
        // Seed default inventory
        await (supabase.from("inventory_items") as any).insert(
          DEFAULT_INVENTORY.map((name) => ({ user_id: uid, name }))
        );
      }
    } catch {}
  }

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ weeklyPlan, inventory, preferences, nutritionalGoals }));
  }, [weeklyPlan, inventory, preferences, nutritionalGoals, loaded]);

  const setUserId = useCallback((id: string) => setUserIdState(id), []);

  const setMeal = useCallback((day: DayKey, slot: MealSlot, meal: MealEntry | undefined) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: meal },
    }));

    if (userId) {
      if (meal) {
        (supabase.from("meal_plans") as any).upsert({
          user_id: userId,
          day_key: day,
          slot,
          meal_name: meal.name,
          meal_name_hindi: meal.nameHindi ?? null,
          description: meal.description,
          ingredients: meal.ingredients,
          prep_time: meal.prepTime,
          nutrition_highlights: meal.nutritionHighlights ?? null,
        }, { onConflict: "user_id,day_key,slot" }).then(() => {});
      } else {
        supabase.from("meal_plans").delete()
          .eq("user_id", userId).eq("day_key", day).eq("slot", slot).then(() => {});
      }
    }
  }, [userId]);

  const addInventoryItem = useCallback((item: string) => {
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]));
    if (userId) {
      supabase.from("inventory_items").insert({ user_id: userId, name: item }).then(() => {});
    }
  }, [userId]);

  const removeInventoryItem = useCallback((item: string) => {
    setInventory((prev) => prev.filter((i) => i !== item));
    if (userId) {
      supabase.from("inventory_items").delete().eq("user_id", userId).eq("name", item).then(() => {});
    }
  }, [userId]);

  return (
    <MealContext.Provider value={{ weeklyPlan, inventory, preferences, nutritionalGoals, userId, setUserId, setMeal, addInventoryItem, removeInventoryItem, setPreferences, setNutritionalGoals }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error("useMeals must be used within MealProvider");
  return ctx;
}

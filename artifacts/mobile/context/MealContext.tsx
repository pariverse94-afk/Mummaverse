import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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

const STORAGE_KEY = "parivaar_meals";

const MealContext = createContext<MealContextValue | null>(null);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({ ...EMPTY_PLAN });
  const [inventory, setInventory] = useState<string[]>(DEFAULT_INVENTORY);
  const [preferences, setPreferences] = useState<string[]>(DEFAULT_PREFERENCES);
  const [nutritionalGoals, setNutritionalGoals] = useState<string[]>(DEFAULT_GOALS);
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
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ weeklyPlan, inventory, preferences, nutritionalGoals }));
  }, [weeklyPlan, inventory, preferences, nutritionalGoals, loaded]);

  const setMeal = useCallback((day: DayKey, slot: MealSlot, meal: MealEntry | undefined) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: meal },
    }));
  }, []);

  const addInventoryItem = useCallback((item: string) => {
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);

  const removeInventoryItem = useCallback((item: string) => {
    setInventory((prev) => prev.filter((i) => i !== item));
  }, []);

  return (
    <MealContext.Provider
      value={{ weeklyPlan, inventory, preferences, nutritionalGoals, setMeal, addInventoryItem, removeInventoryItem, setPreferences, setNutritionalGoals }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error("useMeals must be used within MealProvider");
  return ctx;
}

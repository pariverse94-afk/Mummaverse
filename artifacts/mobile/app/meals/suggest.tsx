import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useMeals, type DayKey, type MealSlot, type MealEntry } from "@/context/MealContext";
import { useGenerateMealPlan } from "@workspace/api-client-react";

const MEAL_TYPES = [
  { key: "breakfast" as const, label: "Breakfast" },
  { key: "lunch" as const, label: "Lunch" },
  { key: "dinner" as const, label: "Dinner" },
  { key: "weekly" as const, label: "Full Week" },
];

const DIET_OPTIONS = [
  "Vegetarian", "Vegan", "Non-Vegetarian", "No Onion-Garlic",
  "Jain", "Gluten-Free", "Low Oil", "High Protein",
];

const NUTRITION_OPTIONS = [
  "High Protein", "Low Oil", "High Fibre", "Low Carb", "Iron Rich",
  "Calcium Rich", "Vitamin C", "Omega 3",
];

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function MealSuggestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { inventory, preferences, nutritionalGoals, setPreferences, setNutritionalGoals, setMeal, weeklyPlan } = useMeals();
  const [selectedType, setSelectedType] = useState<"breakfast" | "lunch" | "dinner" | "weekly">("lunch");
  const [localPrefs, setLocalPrefs] = useState<string[]>(preferences);
  const [localGoals, setLocalGoals] = useState<string[]>(nutritionalGoals);
  const [familySize, setFamilySize] = useState("4");
  const [newInventoryItem, setNewInventoryItem] = useState("");
  const [localInventory, setLocalInventory] = useState<string[]>(inventory);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState("");
  const [tips, setTips] = useState("");

  const { mutate: generatePlan, isPending } = useGenerateMealPlan({
    mutation: {
      onSuccess: (data) => {
        setSuggestions(data.meals ?? []);
        setNutritionSummary(data.nutritionSummary ?? "");
        setTips(data.tips ?? "");
      },
      onError: (err) => {
        Alert.alert("AI Error", "Could not generate meal suggestions. Please try again.");
      },
    },
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const togglePref = (pref: string) => {
    setLocalPrefs((prev) => prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]);
  };

  const toggleGoal = (goal: string) => {
    setLocalGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);
  };

  const handleGenerate = () => {
    setPreferences(localPrefs);
    setNutritionalGoals(localGoals);
    setSuggestions([]);
    generatePlan({
      data: {
        preferences: localPrefs,
        inventory: localInventory,
        familySize: parseInt(familySize) || 4,
        nutritionalGoals: localGoals,
        mealType: selectedType,
      },
    });
  };

  const handleAddToPlanner = (meal: any, slot: MealSlot) => {
    const entry: MealEntry = {
      id: generateId(),
      name: meal.name,
      nameHindi: meal.nameHindi,
      description: meal.description,
      ingredients: meal.ingredients ?? [],
      prepTime: meal.prepTime ?? "30 min",
      nutritionHighlights: meal.nutritionHighlights,
    };
    const targetDay: DayKey = DAYS.find((d) => !weeklyPlan[d][slot]) ?? "Mon";
    setMeal(targetDay, slot, entry);
    Alert.alert("Added!", `${meal.name} added to ${targetDay} ${slot}`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>AI Meal Planner</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Meal type */}
        <Text style={[styles.label, { color: colors.foreground }]}>Plan for</Text>
        <View style={styles.typeRow}>
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeBtn,
                { backgroundColor: selectedType === type.key ? colors.primary : colors.muted },
              ]}
              onPress={() => setSelectedType(type.key)}
              testID={`meal-type-${type.key}`}
            >
              <Text style={[styles.typeBtnText, { color: selectedType === type.key ? "#fff" : colors.mutedForeground }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Family size */}
        <Text style={[styles.label, { color: colors.foreground }]}>Family size</Text>
        <View style={styles.countRow}>
          {["2", "3", "4", "5", "6+"].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.countBtn, { backgroundColor: familySize === n ? colors.secondary : colors.muted }]}
              onPress={() => setFamilySize(n)}
            >
              <Text style={[styles.countBtnText, { color: familySize === n ? "#fff" : colors.mutedForeground }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dietary preferences */}
        <Text style={[styles.label, { color: colors.foreground }]}>Dietary preferences</Text>
        <View style={styles.tagsRow}>
          {DIET_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.tag, { backgroundColor: localPrefs.includes(opt) ? colors.secondary : colors.muted }]}
              onPress={() => togglePref(opt)}
            >
              <Text style={[styles.tagText, { color: localPrefs.includes(opt) ? "#fff" : colors.mutedForeground }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nutritional goals */}
        <Text style={[styles.label, { color: colors.foreground }]}>Nutritional goals</Text>
        <View style={styles.tagsRow}>
          {NUTRITION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.tag, { backgroundColor: localGoals.includes(opt) ? colors.accent : colors.muted }]}
              onPress={() => toggleGoal(opt)}
            >
              <Text style={[styles.tagText, { color: localGoals.includes(opt) ? "#fff" : colors.mutedForeground }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inventory preview */}
        <Text style={[styles.label, { color: colors.foreground }]}>Using from pantry</Text>
        <Text style={[styles.inventoryCount, { color: colors.mutedForeground }]}>
          {localInventory.length} items available
        </Text>
        <View style={styles.inventoryChips}>
          {localInventory.slice(0, 10).map((item) => (
            <View key={item} style={[styles.inventoryChip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.inventoryChipText, { color: colors.foreground }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Generate button */}
        <TouchableOpacity
          style={[styles.generateBtn, { backgroundColor: colors.primary }]}
          onPress={handleGenerate}
          disabled={isPending}
          testID="generate-btn"
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.generateBtnText}>Generate Suggestions</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Results */}
        {suggestions.length > 0 && (
          <View style={styles.results}>
            <Text style={[styles.resultsTitle, { color: colors.foreground }]}>Suggested Meals</Text>

            {nutritionSummary ? (
              <View style={[styles.nutritionBox, { backgroundColor: colors.secondary + "15", borderColor: colors.secondary + "30" }]}>
                <Text style={[styles.nutritionText, { color: colors.secondary }]}>{nutritionSummary}</Text>
              </View>
            ) : null}

            {suggestions.map((meal, idx) => (
              <View key={idx} style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.suggestionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.suggestionName, { color: colors.foreground }]}>{meal.name}</Text>
                    {meal.nameHindi && (
                      <Text style={[styles.suggestionHindi, { color: colors.mutedForeground }]}>{meal.nameHindi}</Text>
                    )}
                  </View>
                  <View style={[styles.prepTimeBadge, { backgroundColor: colors.muted }]}>
                    <Feather name="clock" size={11} color={colors.mutedForeground} />
                    <Text style={[styles.prepTimeText, { color: colors.mutedForeground }]}>{meal.prepTime}</Text>
                  </View>
                </View>
                <Text style={[styles.suggestionDesc, { color: colors.mutedForeground }]}>{meal.description}</Text>
                {meal.nutritionHighlights && (
                  <View style={[styles.nutritionHighlight, { backgroundColor: colors.secondary + "15" }]}>
                    <Text style={[styles.nutritionHighlightText, { color: colors.secondary }]}>{meal.nutritionHighlights}</Text>
                  </View>
                )}
                <View style={styles.addBtns}>
                  {(["breakfast", "lunch", "dinner"] as MealSlot[]).map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.addSlotBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
                      onPress={() => handleAddToPlanner(meal, slot)}
                    >
                      <Feather name="plus" size={12} color={colors.primary} />
                      <Text style={[styles.addSlotText, { color: colors.primary }]}>
                        {slot.charAt(0).toUpperCase() + slot.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {tips && (
              <View style={[styles.tipsBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Tips</Text>
                <Text style={[styles.tipsText, { color: colors.mutedForeground }]}>{tips}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  scrollContent: { padding: 20 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  typeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  typeBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  countRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  countBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  countBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  inventoryCount: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8 },
  inventoryChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 24 },
  inventoryChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  inventoryChipText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  generateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 15, borderRadius: 14 },
  generateBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  results: { marginTop: 28 },
  resultsTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 14 },
  nutritionBox: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16 },
  nutritionText: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
  suggestionCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  suggestionHeader: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  suggestionName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  suggestionHindi: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  prepTimeBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  prepTimeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  suggestionDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, marginBottom: 8 },
  nutritionHighlight: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginBottom: 10, alignSelf: "flex-start" },
  nutritionHighlightText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  addBtns: { flexDirection: "row", gap: 8 },
  addSlotBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  addSlotText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  tipsBox: { padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  tipsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  tipsText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
});

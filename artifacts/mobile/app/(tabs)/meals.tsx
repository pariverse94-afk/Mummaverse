import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useMeals, type DayKey, type MealSlot } from "@/context/MealContext";
import { MealCard } from "@/components/MealCard";
import { ProfileButton } from "@/components/ProfileButton";

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const SLOT_ICONS: Record<MealSlot, any> = {
  breakfast: "sunny-outline",
  lunch: "partly-sunny-outline",
  dinner: "moon-outline",
};

export default function MealsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { weeklyPlan, setMeal, inventory, preferences } = useMeals();
  const [selectedDay, setSelectedDay] = useState<DayKey>("Mon");

  const dayMeals = weeklyPlan[selectedDay];
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const totalMeals = DAYS.reduce((acc, day) => {
    const plan = weeklyPlan[day];
    return acc + SLOTS.filter((s) => !!plan[s]).length;
  }, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 16 }]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Meal Planner</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {totalMeals} meals planned this week
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.suggestBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/meals/suggest")}
              testID="ai-suggest-btn"
            >
              <Ionicons name="sparkles" size={14} color="#fff" />
              <Text style={styles.suggestBtnText}>AI Plan</Text>
            </TouchableOpacity>
            <ProfileButton />
          </View>
        </View>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {DAYS.map((day) => {
            const count = SLOTS.filter((s) => !!weeklyPlan[day][s]).length;
            const isSelected = day === selectedDay;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayTab,
                  { backgroundColor: isSelected ? colors.primary : colors.muted },
                ]}
                onPress={() => setSelectedDay(day)}
                testID={`day-${day}`}
              >
                <Text style={[styles.dayLabel, { color: isSelected ? "#fff" : colors.mutedForeground }]}>
                  {day}
                </Text>
                {count > 0 && (
                  <View style={[styles.dayDot, { backgroundColor: isSelected ? "rgba(255,255,255,0.5)" : colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Meal slots */}
        <View style={styles.mealSlots}>
          {SLOTS.map((slot) => {
            const meal = dayMeals[slot];
            if (meal) {
              return (
                <MealCard
                  key={slot}
                  meal={meal}
                  slot={slot}
                  onRemove={() => setMeal(selectedDay, slot, undefined)}
                />
              );
            }
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.emptySlot, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => router.push("/meals/suggest")}
              >
                <Ionicons name={SLOT_ICONS[slot]} size={18} color={colors.mutedForeground} />
                <Text style={[styles.emptySlotLabel, { color: colors.mutedForeground }]}>
                  {SLOT_LABELS[slot]}
                </Text>
                <Feather name="plus" size={16} color={colors.mutedForeground} style={{ marginLeft: "auto" }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Dietary Preferences</Text>
          <View style={styles.tagsRow}>
            {preferences.map((pref) => (
              <View key={pref} style={[styles.tag, { backgroundColor: colors.secondary + "20" }]}>
                <Text style={[styles.tagText, { color: colors.secondary }]}>{pref}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.tag, { backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed" }]}
              onPress={() => router.push("/meals/suggest")}
            >
              <Feather name="settings" size={12} color={colors.mutedForeground} />
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pantry Inventory</Text>
          <Text style={[styles.inventoryCount, { color: colors.mutedForeground }]}>
            {inventory.length} items available
          </Text>
          <View style={styles.inventoryGrid}>
            {inventory.slice(0, 12).map((item) => (
              <View key={item} style={[styles.inventoryItem, { backgroundColor: colors.muted }]}>
                <Text style={[styles.inventoryItemText, { color: colors.foreground }]} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            ))}
            {inventory.length > 12 && (
              <TouchableOpacity
                style={[styles.inventoryItem, { backgroundColor: colors.primary + "20" }]}
                onPress={() => router.push("/meals/suggest")}
              >
                <Text style={[styles.inventoryItemText, { color: colors.primary }]}>
                  +{inventory.length - 12} more
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  suggestBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  daySelector: { marginBottom: 20 },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignItems: "center",
    gap: 4,
  },
  dayLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dayDot: { width: 5, height: 5, borderRadius: 2.5 },
  mealSlots: { marginBottom: 24 },
  emptySlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 8,
  },
  emptySlotLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  inventoryCount: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 10 },
  inventoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  inventoryItem: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  inventoryItemText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

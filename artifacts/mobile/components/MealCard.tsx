import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { MealEntry } from "@/context/MealContext";

interface Props {
  meal: MealEntry;
  slot: "breakfast" | "lunch" | "dinner";
  onRemove?: () => void;
  compact?: boolean;
}

const SLOT_ICONS: Record<string, string> = {
  breakfast: "sunrise",
  lunch: "sun",
  dinner: "moon",
};

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export function MealCard({ meal, slot, onRemove, compact = false }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.slotIndicator, { backgroundColor: colors.primary + "20" }]}>
        <Feather name={SLOT_ICONS[slot] as any} size={14} color={colors.primary} />
        <Text style={[styles.slotLabel, { color: colors.primary }]}>{SLOT_LABELS[slot]}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {meal.name}
            </Text>
            {meal.nameHindi && (
              <Text style={[styles.nameHindi, { color: colors.mutedForeground }]}>
                {meal.nameHindi}
              </Text>
            )}
          </View>
          {onRemove && (
            <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {!compact && (
          <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
            {meal.description}
          </Text>
        )}

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{meal.prepTime}</Text>
          </View>
          {meal.nutritionHighlights && (
            <View style={[styles.nutritionBadge, { backgroundColor: colors.secondary + "20" }]}>
              <Text style={[styles.nutritionText, { color: colors.secondary }]}>
                {meal.nutritionHighlights}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  slotIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  slotLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: 12,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  nameRow: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  nameHindi: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  removeBtn: {
    padding: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  nutritionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  nutritionText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});

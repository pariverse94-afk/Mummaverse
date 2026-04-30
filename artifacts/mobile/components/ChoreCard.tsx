import * as Haptics from "expo-haptics";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Chore, FamilyMember } from "@/context/FamilyContext";

interface Props {
  chore: Chore;
  member?: FamilyMember;
  onToggle: () => void;
  onDelete?: () => void;
}

const CATEGORY_ICONS: Record<Chore["category"], string> = {
  cleaning: "broom",
  cooking: "chef-hat",
  shopping: "cart-outline",
  childcare: "baby-face-outline",
  other: "dots-horizontal",
};

export function ChoreCard({ chore, member, onToggle, onDelete }: Props) {
  const colors = useColors();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          {
            borderColor: chore.completed ? colors.secondary : colors.border,
            backgroundColor: chore.completed ? colors.secondary : "transparent",
          },
        ]}
        onPress={handleToggle}
        testID={`chore-toggle-${chore.id}`}
      >
        {chore.completed && <Feather name="check" size={14} color="#fff" />}
      </TouchableOpacity>

      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[chore.category] as any}
          size={18}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: chore.completed ? colors.mutedForeground : colors.foreground },
            chore.completed && styles.completed,
          ]}
          numberOfLines={1}
        >
          {chore.title}
        </Text>
        {member && (
          <View style={styles.assignee}>
            <View style={[styles.avatarDot, { backgroundColor: member.color }]} />
            <Text style={[styles.memberName, { color: colors.mutedForeground }]}>{member.name}</Text>
            {chore.recurring && (
              <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                  {chore.recurring}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} testID={`chore-delete-${chore.id}`}>
          <Feather name="trash-2" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  assignee: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberName: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  deleteBtn: {
    padding: 6,
  },
});

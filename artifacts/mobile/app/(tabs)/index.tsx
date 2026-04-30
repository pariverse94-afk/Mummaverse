import * as Haptics from "expo-haptics";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useFamily, type Chore } from "@/context/FamilyContext";
import { useUser } from "@/context/UserContext";
import { ChoreCard } from "@/components/ChoreCard";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel(): string {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { members, chores, addChore, toggleChore, deleteChore } = useFamily();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newChoreTitle, setNewChoreTitle] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? "");
  const [selectedCategory, setSelectedCategory] = useState<Chore["category"]>("other");

  const todayChores = useMemo(() => chores, [chores]);
  const completedCount = useMemo(() => chores.filter((c) => c.completed).length, [chores]);
  const progress = chores.length > 0 ? completedCount / chores.length : 0;

  const handleAddChore = () => {
    if (!newChoreTitle.trim()) return;
    addChore({
      title: newChoreTitle.trim(),
      assignedTo: selectedMemberId,
      category: selectedCategory,
      recurring: "daily",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewChoreTitle("");
    setAddModalVisible(false);
  };

  const handleDeleteChore = (id: string) => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Remove this chore?")) {
        deleteChore(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } else {
      Alert.alert("Delete Chore", "Remove this chore?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => { deleteChore(id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } },
      ]);
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {getGreeting()}{profile?.name ? `, ${profile.name}` : ""}
            </Text>
            <Text style={[styles.dateLabel, { color: colors.foreground }]}>{getTodayLabel()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => setAddModalVisible(true)}
            testID="add-chore-btn"
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Family Members */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Family</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersRow}>
          {members.map((m) => {
            const memberChores = chores.filter((c) => c.assignedTo === m.id);
            const done = memberChores.filter((c) => c.completed).length;
            return (
              <View key={m.id} style={styles.memberCard}>
                <View style={[styles.memberAvatar, { backgroundColor: m.color }]}>
                  <Text style={styles.memberInitial}>{m.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={[styles.memberName, { color: colors.foreground }]} numberOfLines={1}>
                  {m.name}
                </Text>
                <Text style={[styles.memberRole, { color: colors.mutedForeground }]}>{m.role}</Text>
                {memberChores.length > 0 && (
                  <View style={[styles.chorePill, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.chorePillText, { color: colors.mutedForeground }]}>
                      {done}/{memberChores.length}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Chores</Text>
            <Text style={[styles.progressCount, { color: colors.mutedForeground }]}>
              {completedCount} of {chores.length} done
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.secondary, width: `${progress * 100}%` as any },
              ]}
            />
          </View>
        </View>

        {/* Chore List */}
        {todayChores.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="check-all" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No chores yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.mutedForeground }]}>Tap + to add one</Text>
          </View>
        ) : (
          todayChores.map((chore) => {
            const member = members.find((m) => m.id === chore.assignedTo);
            return (
              <ChoreCard
                key={chore.id}
                chore={chore}
                member={member}
                onToggle={() => toggleChore(chore.id)}
                onDelete={() => handleDeleteChore(chore.id)}
              />
            );
          })
        )}
        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 90 }} />
      </ScrollView>

      {/* Add Chore Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setAddModalVisible(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>New Chore</Text>

            <TextInput
              style={[styles.textInput, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.mutedForeground}
              value={newChoreTitle}
              onChangeText={setNewChoreTitle}
              autoFocus
              testID="chore-title-input"
            />

            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Assign to</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberPicker}>
              {members.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.memberPickerItem,
                    { backgroundColor: selectedMemberId === m.id ? m.color : colors.muted },
                  ]}
                  onPress={() => setSelectedMemberId(m.id)}
                  testID={`assign-${m.id}`}
                >
                  <Text style={[styles.memberPickerText, { color: selectedMemberId === m.id ? "#fff" : colors.mutedForeground }]}>
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: newChoreTitle.trim() ? 1 : 0.5 }]}
              onPress={handleAddChore}
              disabled={!newChoreTitle.trim()}
              testID="submit-chore-btn"
            >
              <Text style={styles.submitBtnText}>Add Chore</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dateLabel: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 2 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  membersRow: { flexDirection: "row", marginBottom: 24 },
  memberCard: { alignItems: "center", marginRight: 16, width: 64 },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  memberInitial: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  memberName: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  memberRole: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 1 },
  chorePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  chorePillText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  progressSection: { marginBottom: 20 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progressCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { flex: 1 },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 16 },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  inputLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  memberPicker: { marginBottom: 20 },
  memberPickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  memberPickerText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  submitBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

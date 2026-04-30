import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface Condition {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconSet: "Ionicons" | "MaterialCommunityIcons" | "Feather";
  color: string;
  urgency: "high" | "medium" | "low";
}

const CONDITIONS: Condition[] = [
  { id: "fever", title: "High Fever", description: "Temperature above 38°C", icon: "thermometer", iconSet: "Feather", color: "#DC2626", urgency: "high" },
  { id: "choking", title: "Choking", description: "Blocked airway emergency", icon: "alert-circle", iconSet: "Feather", color: "#B91C1C", urgency: "high" },
  { id: "burns", title: "Burns & Scalds", description: "Heat or chemical burns", icon: "flame-outline", iconSet: "Ionicons", color: "#EA580C", urgency: "high" },
  { id: "cuts", title: "Cuts & Wounds", description: "Bleeding injuries", icon: "bandage", iconSet: "MaterialCommunityIcons", color: "#E07B39", urgency: "medium" },
  { id: "allergy", title: "Allergic Reaction", description: "Rashes, swelling, hives", icon: "warning-outline", iconSet: "Ionicons", color: "#CA8A04", urgency: "high" },
  { id: "diarrhea", title: "Diarrhea & Dehydration", description: "Stomach issues in children", icon: "water-outline", iconSet: "Ionicons", color: "#2D6A4F", urgency: "medium" },
  { id: "cold", title: "Cold & Flu", description: "Cough, congestion, runny nose", icon: "cloud-outline", iconSet: "Ionicons", color: "#2E86AB", urgency: "low" },
  { id: "falls", title: "Falls & Head Injury", description: "Bumps, bruises, concussion", icon: "person-outline", iconSet: "Ionicons", color: "#7B5EA7", urgency: "high" },
  { id: "seizure", title: "Febrile Seizures", description: "Convulsions with fever", icon: "flash-outline", iconSet: "Ionicons", color: "#D45087", urgency: "high" },
  { id: "rash", title: "Skin Rashes", description: "Eczema, heat rash, infection", icon: "medical-bag", iconSet: "MaterialCommunityIcons", color: "#059669", urgency: "low" },
];

function ConditionIcon({ condition }: { condition: Condition }) {
  if (condition.iconSet === "Ionicons") {
    return <Ionicons name={condition.icon as any} size={24} color={condition.color} />;
  }
  if (condition.iconSet === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={condition.icon as any} size={24} color={condition.color} />;
  }
  return <Feather name={condition.icon as any} size={24} color={condition.color} />;
}

export default function FirstAidScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const urgentConditions = CONDITIONS.filter((c) => c.urgency === "high");
  const otherConditions = CONDITIONS.filter((c) => c.urgency !== "high");

  const handleCondition = (condition: Condition) => {
    router.push({
      pathname: "/firstaid/chat",
      params: { conditionId: condition.id, conditionTitle: condition.title },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 16 }]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>First Aid</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>AI guidance for children</Text>
          </View>
          <TouchableOpacity
            style={[styles.aiBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push({ pathname: "/firstaid/chat", params: { conditionId: "general", conditionTitle: "General Query" } })}
            testID="ai-chat-btn"
          >
            <Ionicons name="sparkles" size={14} color="#fff" />
            <Text style={styles.aiBtnText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency banner */}
        <View style={[styles.emergencyBanner, { backgroundColor: "#DC2626" + "15", borderColor: "#DC2626" + "30" }]}>
          <Feather name="phone-call" size={18} color="#DC2626" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.emergencyTitle, { color: "#DC2626" }]}>Life-threatening emergency?</Text>
            <Text style={[styles.emergencyText, { color: colors.mutedForeground }]}>
              Call 108 (Ambulance) or 1800-180-1104 (Child Helpline) immediately
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
            AI guidance is for reference only. Always consult a doctor for medical decisions.
          </Text>
        </View>

        {/* Urgent conditions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Urgent Conditions</Text>
        <View style={styles.conditionsGrid}>
          {urgentConditions.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={[styles.conditionCard, { backgroundColor: colors.card, borderColor: condition.color + "30", borderWidth: 1.5 }]}
              onPress={() => handleCondition(condition)}
              testID={`condition-${condition.id}`}
            >
              <View style={[styles.conditionIconBox, { backgroundColor: condition.color + "15" }]}>
                <ConditionIcon condition={condition} />
              </View>
              <Text style={[styles.conditionTitle, { color: colors.foreground }]} numberOfLines={2}>
                {condition.title}
              </Text>
              <Text style={[styles.conditionDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {condition.description}
              </Text>
              <View style={[styles.urgencyDot, { backgroundColor: "#DC2626" }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other conditions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Common Conditions</Text>
        <View style={styles.conditionsGrid}>
          {otherConditions.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={[styles.conditionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => handleCondition(condition)}
              testID={`condition-${condition.id}`}
            >
              <View style={[styles.conditionIconBox, { backgroundColor: condition.color + "15" }]}>
                <ConditionIcon condition={condition} />
              </View>
              <Text style={[styles.conditionTitle, { color: colors.foreground }]} numberOfLines={2}>
                {condition.title}
              </Text>
              <Text style={[styles.conditionDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {condition.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  aiBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  aiBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emergencyBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  emergencyTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  emergencyText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  disclaimer: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 14 },
  conditionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  conditionCard: {
    width: "47%",
    padding: 14,
    borderRadius: 14,
    position: "relative",
  },
  conditionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  conditionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  conditionDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  urgencyDot: { position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
});

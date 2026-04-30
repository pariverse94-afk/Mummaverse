import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
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
import { useUser } from "@/context/UserContext";

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveProfile } = useUser();
  const [step, setStep] = useState<"welcome" | "profile">("welcome");
  const [yourName, setYourName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!yourName.trim()) return;
    setLoading(true);
    await saveProfile({
      name: yourName.trim(),
      familyName: familyName.trim() || `${yourName.trim()}'s Family`,
    });
    setLoading(false);
    router.replace("/(tabs)");
  };

  if (step === "welcome") {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.welcomeContainer, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
          {/* Logo area */}
          <View style={styles.logoArea}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoEmoji}>🏠</Text>
            </View>
            <View style={styles.logoTextArea}>
              <Text style={[styles.appName, { color: colors.foreground }]}>Parivaar</Text>
              <Text style={[styles.appNameHindi, { color: colors.primary }]}>परिवार</Text>
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={[styles.tagline, { color: colors.foreground }]}>
              Your family, organised.
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Manage chores, plan Indian meals, connect with other moms, and get AI first aid guidance — all in one place.
            </Text>
          </View>

          {/* Feature pills */}
          <View style={styles.features}>
            {[
              { icon: "check-square", label: "Chore Planner" },
              { icon: "shopping-bag", label: "AI Meal Planning" },
              { icon: "users", label: "Mom's Community" },
              { icon: "heart", label: "First Aid Guide" },
            ].map((f) => (
              <View key={f.label} style={[styles.featurePill, { backgroundColor: colors.muted }]}>
                <Feather name={f.icon as any} size={14} color={colors.primary} />
                <Text style={[styles.featurePillText, { color: colors.foreground }]}>{f.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: colors.primary }]}
            onPress={() => setStep("profile")}
            testID="welcome-continue-btn"
          >
            <Text style={styles.continueBtnText}>Get Started</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.profileContainer, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep("welcome")}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.profileIconBox, { backgroundColor: colors.primary + "20" }]}>
          <Feather name="user" size={32} color={colors.primary} />
        </View>

        <Text style={[styles.profileTitle, { color: colors.foreground }]}>Tell us about yourself</Text>
        <Text style={[styles.profileSubtitle, { color: colors.mutedForeground }]}>
          We'll personalise your Parivaar experience
        </Text>

        <Text style={[styles.inputLabel, { color: colors.foreground }]}>Your name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
          placeholder="e.g. Priya"
          placeholderTextColor={colors.mutedForeground}
          value={yourName}
          onChangeText={setYourName}
          autoFocus
          returnKeyType="next"
          testID="your-name-input"
        />

        <Text style={[styles.inputLabel, { color: colors.foreground }]}>Family name <Text style={[styles.optional, { color: colors.mutedForeground }]}>(optional)</Text></Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
          placeholder="e.g. The Sharma Family"
          placeholderTextColor={colors.mutedForeground}
          value={familyName}
          onChangeText={setFamilyName}
          returnKeyType="done"
          onSubmitEditing={handleGetStarted}
          testID="family-name-input"
        />

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.primary, opacity: yourName.trim() ? 1 : 0.4 }]}
          onPress={handleGetStarted}
          disabled={!yourName.trim() || loading}
          testID="profile-continue-btn"
        >
          <Text style={styles.continueBtnText}>Enter Parivaar</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.privacyNote, { color: colors.mutedForeground }]}>
          Your data is stored locally on your device
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  welcomeContainer: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoCircle: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  logoEmoji: { fontSize: 28 },
  logoTextArea: {},
  appName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  appNameHindi: { fontSize: 16, fontFamily: "Inter_500Medium", marginTop: 1 },
  heroContent: { gap: 12 },
  tagline: { fontSize: 30, fontFamily: "Inter_700Bold", lineHeight: 38 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  featurePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  featurePillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  continueBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14 },
  continueBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  profileContainer: { paddingHorizontal: 28, flexGrow: 1 },
  backBtn: { marginBottom: 32 },
  profileIconBox: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  profileTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 8 },
  profileSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21, marginBottom: 32 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  optional: { fontFamily: "Inter_400Regular", fontSize: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, fontFamily: "Inter_400Regular", marginBottom: 20 },
  privacyNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 20 },
});

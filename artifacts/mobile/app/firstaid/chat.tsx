import { Feather, Ionicons } from "@expo/vector-icons";
import { fetch } from "expo/fetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
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

type Severity = "mild" | "moderate" | "severe";

const SEVERITY_OPTIONS: { key: Severity; label: string; color: string }[] = [
  { key: "mild", label: "Mild", color: "#2D6A4F" },
  { key: "moderate", label: "Moderate", color: "#E07B39" },
  { key: "severe", label: "Severe", color: "#DC2626" },
];

export default function FirstAidChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conditionTitle, conditionId } = useLocalSearchParams<{ conditionTitle: string; conditionId: string }>();
  const [childAge, setChildAge] = useState("");
  const [severity, setSeverity] = useState<Severity>("moderate");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [guidance, setGuidance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleGetGuidance = async () => {
    if (!childAge.trim()) return;
    setLoading(true);
    setError("");
    setGuidance("");
    setSubmitted(true);

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = domain
        ? `https://${domain}/api/ai/firstaid`
        : "/api/ai/firstaid";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: conditionTitle ?? conditionId ?? "General",
          childAge: childAge.trim(),
          severity,
          additionalInfo: additionalInfo.trim() || undefined,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data) continue;
            try {
              const event = JSON.parse(data);
              if (event.content) {
                setGuidance((prev) => prev + event.content);
                scrollRef.current?.scrollToEnd({ animated: true });
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGuidance("");
    setSubmitted(false);
    setError("");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Custom header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            {conditionTitle ?? "First Aid"}
          </Text>
          <View style={styles.aiLabel}>
            <Ionicons name="sparkles" size={10} color={colors.primary} />
            <Text style={[styles.aiLabelText, { color: colors.primary }]}>AI Powered</Text>
          </View>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
            For emergencies, call 108. This is informational only — always consult a doctor.
          </Text>
        </View>

        {!submitted ? (
          <>
            {/* Child Age */}
            <Text style={[styles.label, { color: colors.foreground }]}>Child's Age</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              placeholder="e.g. 6 months, 2 years, 5 years"
              placeholderTextColor={colors.mutedForeground}
              value={childAge}
              onChangeText={setChildAge}
              testID="child-age-input"
            />

            {/* Severity */}
            <Text style={[styles.label, { color: colors.foreground }]}>How severe does it seem?</Text>
            <View style={styles.severityRow}>
              {SEVERITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.severityBtn,
                    { borderColor: opt.color, backgroundColor: severity === opt.key ? opt.color : "transparent" },
                  ]}
                  onPress={() => setSeverity(opt.key)}
                  testID={`severity-${opt.key}`}
                >
                  <Text style={[styles.severityLabel, { color: severity === opt.key ? "#fff" : opt.color }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Additional info */}
            <Text style={[styles.label, { color: colors.foreground }]}>Additional details (optional)</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              placeholder="Any other symptoms or context..."
              placeholderTextColor={colors.mutedForeground}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: childAge.trim() ? 1 : 0.5 }]}
              onPress={handleGetGuidance}
              disabled={!childAge.trim() || loading}
              testID="get-guidance-btn"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text style={styles.submitBtnText}>Get AI Guidance</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Context summary */}
            <View style={[styles.contextSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contextLabel, { color: colors.mutedForeground }]}>
                {conditionTitle} • {childAge} • {SEVERITY_OPTIONS.find((s) => s.key === severity)?.label}
              </Text>
            </View>

            {/* Streaming guidance */}
            {loading && !guidance && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Getting guidance...</Text>
              </View>
            )}

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "40" }]}>
                <Feather name="alert-circle" size={16} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
              </View>
            ) : (
              guidance ? (
                <View style={[styles.guidanceBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.guidanceText, { color: colors.foreground }]}>{guidance}</Text>
                  {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />}
                </View>
              ) : null
            )}

            <TouchableOpacity
              style={[styles.resetBtn, { borderColor: colors.border }]}
              onPress={handleReset}
            >
              <Feather name="refresh-cw" size={16} color={colors.mutedForeground} />
              <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>Ask Again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  aiLabel: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  aiLabelText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 24,
  },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 20 },
  severityRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  severityBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 2, alignItems: "center" },
  severityLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 80, marginBottom: 24 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 15, borderRadius: 12 },
  submitBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  contextSummary: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16 },
  contextLabel: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  errorBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  errorText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  guidanceBox: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  guidanceText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  resetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  resetBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});

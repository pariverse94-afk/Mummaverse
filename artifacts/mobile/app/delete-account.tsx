import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const CONTACT_EMAIL = "pariverse94@gmail.com";

export default function DeleteAccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleEmail = () => {
    const subject = encodeURIComponent("Account Deletion Request");
    const body = encodeURIComponent(
      "Hello,\n\nI would like to request the deletion of my Pariverse account and all associated data.\n\nEmail address registered: [Your email here]\n\nThank you."
    );
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Delete Account</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning icon */}
        <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
          <Feather name="trash-2" size={32} color="#C44B2B" />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Request Account Deletion
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          You can request deletion of your Pariverse account and all associated data. We will process your request within{" "}
          <Text style={{ fontFamily: "Inter_700Bold" }}>30 days</Text>.
        </Text>

        {/* What gets deleted */}
        <View style={[styles.card, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>What will be deleted:</Text>
          {[
            "Your profile (name, family name, email)",
            "Family members and chore data",
            "Mom's Corner posts and saved content",
            "All meal plans associated with your account",
            "Authentication records",
          ].map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Feather name="x-circle" size={14} color="#C44B2B" style={{ marginTop: 2 }} />
              <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Request button */}
        <TouchableOpacity
          style={styles.requestBtn}
          onPress={handleEmail}
          activeOpacity={0.85}
        >
          <Feather name="mail" size={18} color="#fff" />
          <Text style={styles.requestBtnText}>Send Deletion Request Email</Text>
        </TouchableOpacity>

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          This will open your email app with a pre-filled message to{" "}
          <Text style={{ color: colors.primary }}>{CONTACT_EMAIL}</Text>
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          After submitting your request, you will receive a confirmation email. Your account and data will be permanently deleted within 30 days. This action cannot be undone.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  scroll: { paddingHorizontal: 24, paddingTop: 32, alignItems: "center" },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24, textAlign: "center", marginBottom: 24 },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 28,
  },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 12 },
  bulletRow: { flexDirection: "row", gap: 10, marginBottom: 8, alignItems: "flex-start" },
  bulletText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#C44B2B",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    marginBottom: 12,
  },
  requestBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  note: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 24 },
  divider: { height: 1, width: "100%", marginBottom: 20 },
  disclaimer: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, textAlign: "center" },
});

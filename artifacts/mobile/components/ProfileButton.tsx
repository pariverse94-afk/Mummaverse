import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";

const AVATAR_COLORS = [
  "#E07B39", "#2D6A4F", "#7B5EA7", "#2E86AB",
  "#D45087", "#059669", "#CA8A04", "#DC2626",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function ProfileButton() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, signOut } = useUser();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editFamily, setEditFamily] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (sheetVisible && profile) {
      setEditName(profile.name ?? "");
      setEditFamily(profile.familyName ?? "");
    }
  }, [sheetVisible, profile]);

  const initials = profile?.name
    ? profile.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const bgColor = profile?.name ? avatarColor(profile.name) : colors.primary;

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await saveProfile(editName.trim(), editFamily.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSheetVisible(false);
    } catch {
      // saveProfile failed — sheet stays open so user can retry
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSheetVisible(false);
    router.replace("/login");
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setSheetVisible(true)}
        testID="profile-button"
        style={[styles.avatar, { backgroundColor: bgColor }]}
        accessibilityLabel="Open profile"
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </TouchableOpacity>

      <Modal
        visible={sheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kvWrapper}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                paddingBottom: insets.bottom + 24,
              },
            ]}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            {/* Avatar + name */}
            <View style={styles.profileRow}>
              <View style={[styles.sheetAvatar, { backgroundColor: bgColor }]}>
                <Text style={styles.sheetAvatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.profileName, { color: colors.foreground }]}>
                  {profile?.name ?? "Set your name"}
                </Text>
                {!!profile?.email && (
                  <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
                    {profile.email}
                  </Text>
                )}
                {!!profile?.familyName && (
                  <Text style={[styles.profileFamily, { color: colors.mutedForeground }]}>
                    {profile.familyName} family
                  </Text>
                )}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Edit fields */}
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              EDIT PROFILE
            </Text>

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Your name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Priya Sharma"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Family name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              value={editFamily}
              onChangeText={setEditFamily}
              placeholder="e.g. Sharma"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: colors.primary, opacity: editName.trim() ? 1 : 0.4 },
              ]}
              onPress={handleSave}
              disabled={!editName.trim() || saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="check" size={16} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Legal */}
            <TouchableOpacity
              style={[styles.legalBtn, { borderColor: colors.border }]}
              onPress={() => { setSheetVisible(false); router.push("/legal"); }}
            >
              <Feather name="file-text" size={16} color={colors.mutedForeground} />
              <Text style={[styles.legalText, { color: colors.mutedForeground }]}>Privacy Policy &amp; Terms</Text>
              <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Sign out */}
            <TouchableOpacity
              style={[styles.signOutBtn, { borderColor: "#DC2626" }]}
              onPress={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator color="#DC2626" size="small" />
              ) : (
                <>
                  <Feather name="log-out" size={16} color="#DC2626" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  kvWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetAvatarText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  profileName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 2 },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 2 },
  profileFamily: { fontSize: 12, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginVertical: 16 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 13,
    marginBottom: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  legalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
  },
  legalText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 13,
    borderWidth: 1.5,
  },
  signOutText: { color: "#DC2626", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

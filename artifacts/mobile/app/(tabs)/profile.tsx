import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import { useFamily, type FamilyMember } from "@/context/FamilyContext";

function Avatar({
  name,
  color,
  size = 48,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: size * 0.4,
          fontFamily: "Inter_700Bold",
        }}
      >
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

function StatusBadge({
  member,
  onInvitePress,
}: {
  member: FamilyMember;
  onInvitePress: () => void;
}) {
  const colors = useColors();

  if (member.invitedEmail && member.isOnApp) {
    return (
      <View style={[styles.badge, { backgroundColor: "#D1FAE5" }]}>
        <View style={[styles.badgeDot, { backgroundColor: "#10B981" }]} />
        <Text style={[styles.badgeText, { color: "#059669" }]}>On Pariverse</Text>
      </View>
    );
  }

  if (member.invitedEmail && !member.isOnApp) {
    return (
      <TouchableOpacity
        style={[styles.badge, { backgroundColor: "#FEF3C7" }]}
        onPress={onInvitePress}
      >
        <View style={[styles.badgeDot, { backgroundColor: "#F59E0B" }]} />
        <Text style={[styles.badgeText, { color: "#92400E" }]}>Invited</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.inviteBtn, { borderColor: colors.border }]}
      onPress={onInvitePress}
    >
      <Feather name="mail" size={12} color={colors.primary} />
      <Text style={[styles.inviteBtnText, { color: colors.primary }]}>Invite</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { session, profile, saveProfile, signOut } = useUser();
  const { members, addMember, deleteMember, updateMemberEmail } = useFamily();

  // Edit profile modal
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(profile?.name ?? "");
  const [editFamilyName, setEditFamilyName] = useState(profile?.familyName ?? "");
  const [editSaving, setEditSaving] = useState(false);

  // Add member modal
  const [addVisible, setAddVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<FamilyMember["role"]>("parent");
  const [addSaving, setAddSaving] = useState(false);

  // Invite modal
  const [inviteVisible, setInviteVisible] = useState(false);
  const [inviteMember, setInviteMember] = useState<FamilyMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteChecking, setInviteChecking] = useState(false);
  const [inviteSaved, setInviteSaved] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteEmailSent, setInviteEmailSent] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setEditSaving(true);
    await saveProfile(editName.trim(), editFamilyName.trim() || `${editName.trim()}'s Family`);
    setEditSaving(false);
    setEditVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    setAddSaving(true);
    await addMember(newMemberName.trim(), newMemberRole);
    setAddSaving(false);
    setNewMemberName("");
    setNewMemberRole("parent");
    setAddVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const openInvite = (member: FamilyMember) => {
    setInviteMember(member);
    setInviteEmail(member.invitedEmail ?? "");
    setInviteSaved(false);
    setInviteSending(false);
    setInviteEmailSent(false);
    setInviteVisible(true);
  };

  const handleSaveInvite = async () => {
    if (!inviteMember || !inviteEmail.trim()) return;
    setInviteChecking(true);
    await updateMemberEmail(inviteMember.id, inviteEmail.trim());
    setInviteChecking(false);
    setInviteSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // If already on app, close after a moment — otherwise stay open to send invite email
  };

  const handleSendInviteEmail = async () => {
    if (!inviteMember || !inviteEmail.trim()) return;
    setInviteSending(true);
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = domain ? `https://${domain}/api/invite` : "/api/invite";
      const redirectTo = domain ? `https://${domain}/` : undefined;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          memberName: inviteMember.name,
          inviterName: profile?.name ?? "Your family",
          redirectTo,
        }),
      });
      const json = await res.json() as { success?: boolean; alreadyOnApp?: boolean; error?: string };

      if (json.success) {
        setInviteEmailSent(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setInviteVisible(false), 2000);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setInviteSending(false);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Join me on Pariverse — the app for organised Indian families! Download it and we can manage chores and meals together.",
        title: "Join Pariverse",
      });
    } catch {}
  };

  const handleDeleteMember = (member: FamilyMember) => {
    const confirm = () => {
      deleteMember(member.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Remove ${member.name} from your family?`)) confirm();
    } else {
      Alert.alert("Remove Member", `Remove ${member.name} from your family?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: confirm },
      ]);
    }
  };

  const handleSignOut = () => {
    const confirm = () => signOut();
    if (Platform.OS === "web") {
      if (window.confirm("Sign out of Pariverse?")) confirm();
    } else {
      Alert.alert("Sign Out", "Sign out of Pariverse?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: confirm },
      ]);
    }
  };

  const userInitial = profile?.name?.charAt(0).toUpperCase() ?? "?";
  const updatedInviteMember = inviteMember
    ? members.find((m) => m.id === inviteMember.id) ?? inviteMember
    : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>Profile</Text>

        {/* User card */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.userCardRow}>
            <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.userAvatarText}>{userInitial}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                {profile?.name ?? "—"}
              </Text>
              <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
                {session?.user?.email ?? profile?.email ?? "No email"}
              </Text>
              <Text style={[styles.userFamily, { color: colors.mutedForeground }]}>
                {profile?.familyName ?? ""}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.muted }]}
              onPress={() => {
                setEditName(profile?.name ?? "");
                setEditFamilyName(profile?.familyName ?? "");
                setEditVisible(true);
              }}
            >
              <Feather name="edit-2" size={15} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Family section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Family</Text>
          <TouchableOpacity
            style={[styles.addMemberBtn, { backgroundColor: colors.primary }]}
            onPress={() => setAddVisible(true)}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addMemberBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {members.map((member) => (
          <View
            key={member.id}
            style={[styles.memberRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Avatar name={member.name} color={member.color} size={44} />
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: colors.foreground }]}>{member.name}</Text>
              <Text style={[styles.memberRole, { color: colors.mutedForeground }]}>
                {member.role === "parent" ? "Parent" : "Child"}
                {member.invitedEmail && !member.isOnApp
                  ? ` · ${member.invitedEmail}`
                  : ""}
              </Text>
            </View>
            <View style={styles.memberActions}>
              <StatusBadge member={member} onInvitePress={() => openInvite(member)} />
              <TouchableOpacity
                onPress={() => handleDeleteMember(member)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={15} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {members.length === 0 && (
          <View style={[styles.emptyFamily, { backgroundColor: colors.muted }]}>
            <Feather name="users" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyFamilyText, { color: colors.mutedForeground }]}>
              No family members yet. Tap Add to get started.
            </Text>
          </View>
        )}

        {/* Sign out */}
        <TouchableOpacity
          style={[styles.signOutBtn, { borderColor: colors.destructive + "40" }]}
          onPress={handleSignOut}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <Modal visible={editVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setEditVisible(false)} />
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Edit Profile</Text>

            <Text style={[styles.label, { color: colors.foreground }]}>Your name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />

            <Text style={[styles.label, { color: colors.foreground }]}>Family name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              value={editFamilyName}
              onChangeText={setEditFamilyName}
              placeholder="e.g. The Sharma Family"
              placeholderTextColor={colors.mutedForeground}
            />

            <TouchableOpacity
              style={[styles.sheetBtn, { backgroundColor: colors.primary, opacity: editName.trim() ? 1 : 0.5 }]}
              onPress={handleSaveProfile}
              disabled={!editName.trim() || editSaving}
            >
              {editSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sheetBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Add Member Modal ── */}
      <Modal visible={addVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setAddVisible(false)} />
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Add Family Member</Text>

            <Text style={[styles.label, { color: colors.foreground }]}>Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholder="e.g. Ananya"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />

            <Text style={[styles.label, { color: colors.foreground }]}>Role</Text>
            <View style={styles.rolePicker}>
              {(["parent", "child"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleBtn,
                    {
                      backgroundColor:
                        newMemberRole === role ? colors.primary : colors.muted,
                    },
                  ]}
                  onPress={() => setNewMemberRole(role)}
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      { color: newMemberRole === role ? "#fff" : colors.mutedForeground },
                    ]}
                  >
                    {role === "parent" ? "Parent" : "Child"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.sheetBtn, { backgroundColor: colors.primary, opacity: newMemberName.trim() ? 1 : 0.5 }]}
              onPress={handleAddMember}
              disabled={!newMemberName.trim() || addSaving}
            >
              {addSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sheetBtnText}>Add Member</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Invite Modal ── */}
      <Modal visible={inviteVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setInviteVisible(false)} />
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.sheetHandle} />

            {inviteMember && (
              <View style={styles.inviteHeader}>
                <Avatar name={inviteMember.name} color={inviteMember.color} size={48} />
                <View>
                  <Text style={[styles.sheetTitle, { color: colors.foreground, marginBottom: 2 }]}>
                    Invite {inviteMember.name}
                  </Text>
                  <Text style={[styles.inviteSubtitle, { color: colors.mutedForeground }]}>
                    Enter their email to invite them to Pariverse
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.label, { color: colors.foreground }]}>Email address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              value={inviteEmail}
              onChangeText={(t) => { setInviteEmail(t); setInviteSaved(false); }}
              placeholder="family@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            {/* Status result after checking */}
            {inviteSaved && updatedInviteMember && (
              <View
                style={[
                  styles.inviteResult,
                  { backgroundColor: updatedInviteMember.isOnApp ? "#D1FAE5" : "#FEF3C7" },
                ]}
              >
                <Feather
                  name={updatedInviteMember.isOnApp ? "check-circle" : "clock"}
                  size={16}
                  color={updatedInviteMember.isOnApp ? "#059669" : "#92400E"}
                />
                <Text
                  style={[
                    styles.inviteResultText,
                    { color: updatedInviteMember.isOnApp ? "#059669" : "#92400E" },
                  ]}
                >
                  {updatedInviteMember.isOnApp
                    ? `${inviteMember?.name} is already on Pariverse!`
                    : `${inviteMember?.name} isn't on Pariverse yet — send them an invite!`}
                </Text>
              </View>
            )}

            {/* Email sent confirmation */}
            {inviteEmailSent && (
              <View style={[styles.inviteResult, { backgroundColor: "#D1FAE5" }]}>
                <Feather name="send" size={16} color="#059669" />
                <Text style={[styles.inviteResultText, { color: "#059669" }]}>
                  Invite sent to {inviteEmail}!
                </Text>
              </View>
            )}

            {/* Primary action: Check & Save → then Send Invite Email */}
            {!inviteSaved ? (
              <TouchableOpacity
                style={[styles.sheetBtn, { backgroundColor: colors.primary, opacity: inviteEmail.trim() ? 1 : 0.5 }]}
                onPress={handleSaveInvite}
                disabled={!inviteEmail.trim() || inviteChecking}
              >
                {inviteChecking ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.sheetBtnText}>Check & Save</Text>
                )}
              </TouchableOpacity>
            ) : updatedInviteMember && !updatedInviteMember.isOnApp && !inviteEmailSent ? (
              <TouchableOpacity
                style={[styles.sheetBtn, { backgroundColor: colors.primary, opacity: inviteSending ? 0.6 : 1 }]}
                onPress={handleSendInviteEmail}
                disabled={inviteSending}
              >
                {inviteSending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="send" size={16} color="#fff" />
                    <Text style={styles.sheetBtnText}>Send Invite Email</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Share link as secondary action when not yet sent */}
            {inviteSaved && updatedInviteMember && !updatedInviteMember.isOnApp && !inviteEmailSent && (
              <TouchableOpacity
                style={[styles.shareBtn, { borderColor: colors.border }]}
                onPress={handleShareApp}
              >
                <Feather name="share-2" size={15} color={colors.foreground} />
                <Text style={[styles.shareBtnText, { color: colors.foreground }]}>
                  Share App Link Instead
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 20 },

  userCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 28,
  },
  userCardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold" },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 2 },
  userEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 1 },
  userFamily: { fontSize: 12, fontFamily: "Inter_400Regular" },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  addMemberBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addMemberBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  memberRole: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  memberActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteBtn: { padding: 4 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  inviteBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  emptyFamily: {
    alignItems: "center",
    padding: 28,
    borderRadius: 14,
    gap: 10,
    marginBottom: 20,
  },
  emptyFamilyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },

  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },

  // Modals
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 16 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  input: {
    borderWidth: 1,
    borderRadius: 11,
    padding: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  sheetBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  sheetBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },

  rolePicker: { flexDirection: "row", gap: 10, marginBottom: 20 },
  roleBtn: {
    flex: 1,
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  roleBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  inviteHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  inviteSubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, maxWidth: 220 },
  inviteResult: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  inviteResultText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 18 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  shareBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});

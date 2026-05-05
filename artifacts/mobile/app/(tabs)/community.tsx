import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
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
import { useCommunity, type PostCategory } from "@/context/CommunityContext";
import { PostCard } from "@/components/PostCard";
import { ProfileButton } from "@/components/ProfileButton";

const CATEGORIES: { key: PostCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "recipe", label: "Recipes" },
  { key: "parenting", label: "Parenting" },
  { key: "health", label: "Health" },
  { key: "general", label: "General" },
];

const POST_CATEGORIES: { key: PostCategory; label: string; color: string }[] = [
  { key: "recipe", label: "Recipe", color: "#E07B39" },
  { key: "parenting", label: "Parenting", color: "#7B5EA7" },
  { key: "health", label: "Health", color: "#2D6A4F" },
  { key: "general", label: "General", color: "#2E86AB" },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts, addPost, likePost, savePost, deletePost } = useCommunity();
  const [filter, setFilter] = useState<PostCategory | "all">("all");
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<PostCategory>("general");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const handlePost = () => {
    if (!newContent.trim()) return;
    addPost(newContent.trim(), newCategory);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewContent("");
    setNewCategory("general");
    setPostModalVisible(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Mom's Corner</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.newPostBtn, { backgroundColor: colors.primary }]}
            onPress={() => setPostModalVisible(true)}
            testID="new-post-btn"
          >
            <Feather name="edit-2" size={16} color="#fff" />
          </TouchableOpacity>
          <ProfileButton />
        </View>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = filter === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.filterChip, { backgroundColor: isActive ? colors.primary : colors.muted }]}
              onPress={() => setFilter(cat.key)}
            >
              <Text style={[styles.filterChipText, { color: isActive ? "#fff" : colors.mutedForeground }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredPosts.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="users" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No posts yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.mutedForeground }]}>Be the first to share!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={() => likePost(item.id)}
              onSave={() => savePost(item.id)}
              onDelete={item.isOwn ? () => deletePost(item.id) : undefined}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filteredPosts.length > 0}
        />
      )}

      {/* New Post Modal */}
      <Modal visible={postModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setPostModalVisible(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Share with the community</Text>
              <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.textArea, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              placeholder="Share a tip, recipe, or experience..."
              placeholderTextColor={colors.mutedForeground}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              autoFocus
              testID="post-content-input"
            />

            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Category</Text>
            <View style={styles.categoryRow}>
              {POST_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: newCategory === cat.key ? cat.color : colors.muted },
                  ]}
                  onPress={() => setNewCategory(cat.key)}
                  testID={`category-${cat.key}`}
                >
                  <Text style={[styles.categoryChipText, { color: newCategory === cat.key ? "#fff" : colors.mutedForeground }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: colors.primary, opacity: newContent.trim() ? 1 : 0.5 }]}
              onPress={handlePost}
              disabled={!newContent.trim()}
              testID="submit-post-btn"
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  newPostBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  filterRow: { marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { flex: 1 },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingTop: 12 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#ccc", alignSelf: "center", marginBottom: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 100, marginBottom: 16 },
  inputLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  categoryChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  postBtn: { padding: 14, borderRadius: 12, alignItems: "center" },
  postBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

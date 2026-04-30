import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Post, PostCategory } from "@/context/CommunityContext";

interface Props {
  post: Post;
  onLike: () => void;
  onSave: () => void;
  onDelete?: () => void;
}

const CATEGORY_COLORS: Record<PostCategory, string> = {
  recipe: "#E07B39",
  parenting: "#7B5EA7",
  health: "#2D6A4F",
  general: "#2E86AB",
};

const CATEGORY_LABELS: Record<PostCategory, string> = {
  recipe: "Recipe",
  parenting: "Parenting",
  health: "Health",
  general: "General",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function PostCard({ post, onLike, onSave, onDelete }: Props) {
  const colors = useColors();
  const catColor = CATEGORY_COLORS[post.category];

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: post.authorColor }]}>
          <Text style={styles.avatarText}>{post.authorName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.foreground }]}>{post.authorName}</Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{timeAgo(post.createdAt)}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: catColor + "20" }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>
            {CATEGORY_LABELS[post.category]}
          </Text>
        </View>
      </View>

      <Text style={[styles.content, { color: colors.foreground }]}>{post.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} testID={`like-${post.id}`}>
          <Feather
            name="heart"
            size={18}
            color={post.liked ? "#DC2626" : colors.mutedForeground}
            style={post.liked ? { opacity: 1 } : {}}
          />
          <Text style={[styles.actionCount, { color: post.liked ? "#DC2626" : colors.mutedForeground }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleSave} testID={`save-${post.id}`}>
          <Feather
            name="bookmark"
            size={18}
            color={post.saved ? colors.primary : colors.mutedForeground}
          />
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
            <Feather name="trash-2" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  content: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});

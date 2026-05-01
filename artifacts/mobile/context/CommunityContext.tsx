import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type PostCategory = "recipe" | "parenting" | "health" | "general";

export interface Post {
  id: string;
  authorName: string;
  authorColor: string;
  content: string;
  category: PostCategory;
  likes: number;
  liked: boolean;
  saved: boolean;
  createdAt: string;
  isOwn?: boolean;
}

interface CommunityContextValue {
  posts: Post[];
  loading: boolean;
  addPost: (content: string, category: PostCategory) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  savePost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

const SEED_POSTS: Post[] = [
  { id: "seed1", authorName: "Sunita Sharma", authorColor: "#E07B39", content: "My 3-year-old has been refusing vegetables for weeks. Finally cracked the code — blend spinach into his dal! He has no idea and finishes everything. Game changer for picky eaters.", category: "parenting", likes: 24, liked: false, saved: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "seed2", authorName: "Kavitha R.", authorColor: "#2D6A4F", content: "Sharing my protein-rich tiffin box recipe for school kids: moong dal chilla with mint chutney, boiled egg, mixed fruit. My son's teacher said he's more focused in afternoon class now!", category: "recipe", likes: 41, liked: true, saved: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "seed3", authorName: "Ananya M.", authorColor: "#7B5EA7", content: "Paediatrician confirmed — screen time guidelines for under-2s: zero. For 2-5: max 1 hour/day of quality content. Our new rule: no screens during meals and 1 hour before bed. Already seeing calmer bedtimes!", category: "health", likes: 56, liked: false, saved: false, createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "seed4", authorName: "Divya Nair", authorColor: "#2E86AB", content: "Anyone else dealing with separation anxiety when dropping off at daycare? What worked for us: a special goodbye ritual — one hug, one high-five, one wave from the window. Consistency was key. Took 2 weeks but now she walks in happily.", category: "parenting", likes: 38, liked: false, saved: true, createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "seed5", authorName: "Meena Kulkarni", authorColor: "#D45087", content: "Quick weeknight recipe: Palak paneer in 20 minutes. Blanch spinach, blend with 1 onion + 2 tomatoes. Saute with ghee, cumin, garam masala. Add paneer cubes. Perfect with roti. Kids love the color!", category: "recipe", likes: 67, liked: false, saved: false, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "seed6", authorName: "Lakshmi P.", authorColor: "#E8A838", content: "Varicella vaccination reminder: if your child hasn't had chickenpox or the vaccine, the second dose is due between 4-6 years. Our local PHC gives it free under Universal Immunization. Don't skip boosters!", category: "health", likes: 29, liked: false, saved: false, createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
];

const STORAGE_KEY = "parivaar_community_v2";
const LIKES_KEY = "parivaar_likes_v2";
const SAVES_KEY = "parivaar_saves_v2";
const USER_ID_KEY = "parivaar_device_id";

let _deviceId: string | null = null;
async function getDeviceId(): Promise<string> {
  if (_deviceId) return _deviceId;
  let id = await AsyncStorage.getItem(USER_ID_KEY);
  if (!id) { id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`; await AsyncStorage.setItem(USER_ID_KEY, id); }
  _deviceId = id;
  return id;
}

const OWN_COLORS = ["#C44B2B", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromSupabase();
  }, []);

  async function loadFromSupabase() {
    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      const [{ data: postsData }, { data: likesData }, { data: savesData }] = await Promise.all([
        supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("post_likes").select("post_id").eq("user_id", deviceId),
        supabase.from("post_saves").select("post_id").eq("user_id", deviceId),
      ]);

      const liked = new Set<string>((likesData ?? []).map((l) => l.post_id));
      const saved = new Set<string>((savesData ?? []).map((s) => s.post_id));
      setLikedIds(liked);
      setSavedIds(saved);

      if (postsData && postsData.length > 0) {
        const mapped: Post[] = postsData.map((p) => ({
          id: p.id,
          authorName: p.author_name,
          authorColor: p.author_color,
          content: p.content,
          category: p.category as PostCategory,
          likes: p.likes,
          liked: liked.has(p.id),
          saved: saved.has(p.id),
          createdAt: p.created_at,
        }));
        setPosts(mapped);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      } else {
        // Fall back to cached or seeds
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) setPosts(JSON.parse(cached));
        else setPosts(SEED_POSTS);
      }
    } catch {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) setPosts(JSON.parse(cached));
      else setPosts(SEED_POSTS);
    } finally {
      setLoading(false);
    }
  }

  const addPost = useCallback(async (content: string, category: PostCategory) => {
    const color = OWN_COLORS[Math.floor(Math.random() * OWN_COLORS.length)];
    const optimistic: Post = {
      id: `opt_${Date.now()}`,
      authorName: "You",
      authorColor: color,
      content,
      category,
      likes: 0,
      liked: false,
      saved: false,
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
    setPosts((prev) => [optimistic, ...prev]);

    try {
      const { data } = await supabase
        .from("community_posts")
        .insert({ author_name: "You", author_color: color, content, category })
        .select("id,created_at")
        .single();
      if (data) {
        setPosts((prev) => prev.map((p) => p.id === optimistic.id ? { ...p, id: data.id, createdAt: data.created_at } : p));
      }
    } catch {}
  }, []);

  const likePost = useCallback(async (id: string) => {
    const deviceId = await getDeviceId();
    const isLiked = likedIds.has(id);

    setLikedIds((prev) => { const s = new Set(prev); isLiked ? s.delete(id) : s.add(id); return s; });
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, liked: !isLiked, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));

    try {
      if (isLiked) {
        await supabase.from("post_likes").delete().eq("post_id", id).eq("user_id", deviceId);
        await supabase.from("community_posts").update({ likes: (posts.find(p => p.id === id)?.likes ?? 1) - 1 }).eq("id", id);
      } else {
        await supabase.from("post_likes").insert({ post_id: id, user_id: deviceId });
        await supabase.from("community_posts").update({ likes: (posts.find(p => p.id === id)?.likes ?? 0) + 1 }).eq("id", id);
      }
    } catch {}
  }, [likedIds, posts]);

  const savePost = useCallback(async (id: string) => {
    const deviceId = await getDeviceId();
    const isSaved = savedIds.has(id);

    setSavedIds((prev) => { const s = new Set(prev); isSaved ? s.delete(id) : s.add(id); return s; });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, saved: !isSaved } : p));

    try {
      if (isSaved) {
        await supabase.from("post_saves").delete().eq("post_id", id).eq("user_id", deviceId);
      } else {
        await supabase.from("post_saves").insert({ post_id: id, user_id: deviceId });
      }
    } catch {}
  }, [savedIds]);

  const deletePost = useCallback(async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from("community_posts").delete().eq("id", id);
    } catch {}
  }, []);

  return (
    <CommunityContext.Provider value={{ posts, loading, addPost, likePost, savePost, deletePost }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}

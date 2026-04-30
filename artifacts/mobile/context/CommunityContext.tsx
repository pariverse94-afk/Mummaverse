import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  addPost: (content: string, category: PostCategory) => void;
  likePost: (id: string) => void;
  savePost: (id: string) => void;
  deletePost: (id: string) => void;
}

const SEED_POSTS: Post[] = [
  {
    id: "p1",
    authorName: "Sunita Sharma",
    authorColor: "#E07B39",
    content: "My 3-year-old has been refusing vegetables for weeks. Finally cracked the code — blend spinach into his dal! He has no idea and finishes everything. Game changer for picky eaters.",
    category: "parenting",
    likes: 24,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p2",
    authorName: "Kavitha R.",
    authorColor: "#2D6A4F",
    content: "Sharing my protein-rich tiffin box recipe for school kids: moong dal chilla with mint chutney, boiled egg, mixed fruit. My son's teacher said he's more focused in afternoon class now!",
    category: "recipe",
    likes: 41,
    liked: true,
    saved: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p3",
    authorName: "Ananya M.",
    authorColor: "#7B5EA7",
    content: "Paediatrician confirmed — screen time guidelines for under-2s: zero. For 2-5: max 1 hour/day of quality content. Our new rule: no screens during meals and 1 hour before bed. Already seeing calmer bedtimes!",
    category: "health",
    likes: 56,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p4",
    authorName: "Divya Nair",
    authorColor: "#2E86AB",
    content: "Anyone else dealing with separation anxiety when dropping off at daycare? What worked for us: a special goodbye ritual — one hug, one high-five, one wave from the window. Consistency was key. Took 2 weeks but now she walks in happily.",
    category: "parenting",
    likes: 38,
    liked: false,
    saved: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p5",
    authorName: "Meena Kulkarni",
    authorColor: "#D45087",
    content: "Quick weeknight recipe: Palak paneer in 20 minutes. Blanch spinach, blend with 1 onion + 2 tomatoes. Saute with ghee, cumin, garam masala. Add paneer cubes. Perfect with roti. Kids love the color!",
    category: "recipe",
    likes: 67,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p6",
    authorName: "Lakshmi P.",
    authorColor: "#E8A838",
    content: "Varicella vaccination reminder: if your child hasn't had chickenpox or the vaccine, the second dose is due between 4-6 years. Our local PHC gives it free under Universal Immunization. Don't skip boosters!",
    category: "health",
    likes: 29,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const STORAGE_KEY = "parivaar_community";

const CommunityContext = createContext<CommunityContextValue | null>(null);

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const OWN_COLORS = ["#C44B2B", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setPosts(JSON.parse(stored));
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts, loaded]);

  const addPost = useCallback((content: string, category: PostCategory) => {
    const color = OWN_COLORS[Math.floor(Math.random() * OWN_COLORS.length)];
    const newPost: Post = {
      id: generateId(),
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
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const likePost = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }, []);

  const savePost = useCallback((id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <CommunityContext.Provider value={{ posts, addPost, likePost, savePost, deletePost }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}

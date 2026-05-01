export interface Database {
  public: {
    Tables: {
      parivaar_users: {
        Row: {
          id: string;
          name: string;
          family_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          family_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          family_name?: string;
          created_at?: string;
        };
      };
      family_members: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: "parent" | "child";
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role: "parent" | "child";
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          role?: "parent" | "child";
          color?: string;
          created_at?: string;
        };
      };
      chores: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          assigned_to: string;
          completed: boolean;
          category: "cleaning" | "cooking" | "shopping" | "childcare" | "other";
          recurring: "daily" | "weekly" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          assigned_to: string;
          completed?: boolean;
          category: "cleaning" | "cooking" | "shopping" | "childcare" | "other";
          recurring?: "daily" | "weekly" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          assigned_to?: string;
          completed?: boolean;
          category?: "cleaning" | "cooking" | "shopping" | "childcare" | "other";
          recurring?: "daily" | "weekly" | null;
          created_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          day_key: string;
          slot: "breakfast" | "lunch" | "dinner";
          meal_name: string;
          meal_name_hindi: string | null;
          description: string;
          ingredients: string[];
          prep_time: string;
          nutrition_highlights: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_key: string;
          slot: "breakfast" | "lunch" | "dinner";
          meal_name: string;
          meal_name_hindi?: string | null;
          description: string;
          ingredients: string[];
          prep_time: string;
          nutrition_highlights?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          day_key?: string;
          slot?: "breakfast" | "lunch" | "dinner";
          meal_name?: string;
          meal_name_hindi?: string | null;
          description?: string;
          ingredients?: string[];
          prep_time?: string;
          nutrition_highlights?: string | null;
          created_at?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          author_name: string;
          author_color: string;
          content: string;
          category: "recipe" | "parenting" | "health" | "general";
          likes: number;
          is_seed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_color: string;
          content: string;
          category: "recipe" | "parenting" | "health" | "general";
          likes?: number;
          is_seed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_color?: string;
          content?: string;
          category?: "recipe" | "parenting" | "health" | "general";
          likes?: number;
          is_seed?: boolean;
          created_at?: string;
        };
      };
      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
        };
        Update: {
          post_id?: string;
          user_id?: string;
        };
      };
      post_saves: {
        Row: {
          post_id: string;
          user_id: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
        };
        Update: {
          post_id?: string;
          user_id?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  
  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };

  const addBookmark = async (title: string, url: string) => {
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      return { success: false, error: "Title and URL are required." };
    }

    if (!isValidUrl(trimmedUrl)) {
      return {
        success: false,
        error: "Invalid URL. Must start with http:// or https://",
      };
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: trimmedTitle,
        url: trimmedUrl,
        user_id: userData.user.id,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  useEffect(() => {
    let channel: any;

    const init = async () => {
      await fetchBookmarks();

      channel = supabase
        .channel("bookmarks-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          fetchBookmarks
        )
        .subscribe();

      setLoading(false);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return {
    bookmarks,
    loading,
    addBookmark,
    deleteBookmark,
  };
}
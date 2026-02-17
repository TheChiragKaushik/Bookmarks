import { supabase } from "./supabaseClient";
import { Bookmark } from "./interfaces";

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Bookmark[];
};

export const insertBookmark = async (
  title: string,
  url: string,
  userId: string,
) => {
  return await supabase.from("bookmarks").insert({
    title,
    url,
    user_id: userId,
  });
};

export const removeBookmark = async (id: string) => {
  return await supabase.from("bookmarks").delete().eq("id", id);
};

export const updateBookmark = async (
  id: string,
  title: string,
  url: string,
  userId: string,
) => {
  return await supabase
    .from("bookmarks")
    .update({ title, url })
    .eq("id", id)
    .eq("user_id", userId);
};

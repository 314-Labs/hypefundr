import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const getGameCover = (supabase: SupabaseClient<Database>, id: number) =>
    supabase.storage.from('games').getPublicUrl(`images/${id}/cover.jpg`).data.publicUrl;

export const getAvatar = (supabase: SupabaseClient<Database>, userId: string) => {
    return supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar`).data.publicUrl;
}
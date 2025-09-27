import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";

import { supabase } from "./supabaseClient";

export interface BackupData {
  id: string;
  user_id: string;
  data: ExcalidrawInitialDataState;
  updated_at: string;
}

export const loadBackup = async (
  userId: string,
): Promise<ExcalidrawInitialDataState | null> => {
  // Debug logging removed for production

  if (!supabase || !userId) {
    return null;
  }

  try {
    // Get the most recent backup for the user
    const { data, error } = await supabase
      .from("backups")
      .select("data")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No backup found - this is fine for new users
        return null;
      }
      if (error.code === "42P01") {
        console.error("❌ Database table 'backups' does not exist!");
        console.error("💡 Please run the SQL script you provided");
        throw new Error(
          "Database not set up. Please run the SQL setup script.",
        );
      }
      console.error("❌ Error loading backup:", error);
      return null;
    }

    if (data?.data) {
      return data.data as ExcalidrawInitialDataState;
    }

    return null;
  } catch (error) {
    console.error("Unexpected error loading backup:", error);
    return null;
  }
};

export const saveBackup = async (
  userId: string,
  drawingData: ExcalidrawInitialDataState,
): Promise<boolean> => {
  if (!supabase || !userId) {
    return false;
  }

  try {
    // Delete any existing backups for this user, then insert new one
    // This ensures we only keep the latest backup per user
    await supabase.from("backups").delete().eq("user_id", userId);

    const { error } = await supabase
      .from("backups")
      .insert({
        user_id: userId,
        data: drawingData,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      if (error.code === "42P01") {
        console.error("❌ Database table 'backups' does not exist!");
        console.error("💡 Please run the SQL script you provided");
        throw new Error(
          "Database not set up. Please run the SQL setup script.",
        );
      }
      console.error("❌ Error saving backup:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error saving backup:", error);
    return false;
  }
};

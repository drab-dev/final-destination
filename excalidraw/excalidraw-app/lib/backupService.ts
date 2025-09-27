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
  console.log("🔍 loadBackup called with userId:", userId);
  console.log("🔍 Supabase client available:", !!supabase);

  if (!supabase || !userId) {
    console.warn("❌ Supabase client not available or no user ID provided", {
      supabase: !!supabase,
      userId,
    });
    return null;
  }

  try {
    console.log("🔄 Attempting to load backup from database...");
    // Get the most recent backup for the user
    const { data, error } = await supabase
      .from("backups")
      .select("data")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    console.log("📊 Database response:", { data: !!data, error });

    if (error) {
      if (error.code === "PGRST116") {
        // No backup found - this is fine for new users
        console.log("ℹ️ No backup found for user:", userId);
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
      console.log("✅ Backup loaded successfully for user:", userId);
      return data.data as ExcalidrawInitialDataState;
    }

    console.log("ℹ️ No backup data found");
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
  console.log("💾 saveBackup called with userId:", userId);
  console.log(
    "💾 Drawing data elements count:",
    drawingData.elements?.length || 0,
  );
  console.log("💾 Supabase client available:", !!supabase);

  if (!supabase || !userId) {
    console.warn("❌ Supabase client not available or no user ID provided", {
      supabase: !!supabase,
      userId,
    });
    return false;
  }

  try {
    console.log("🔄 Attempting to save backup to database...");

    // Delete any existing backups for this user, then insert new one
    // This ensures we only keep the latest backup per user
    await supabase.from("backups").delete().eq("user_id", userId);

    const { data, error } = await supabase
      .from("backups")
      .insert({
        user_id: userId,
        data: drawingData,
        updated_at: new Date().toISOString(),
      })
      .select();

    console.log("📊 Save response:", { data, error });

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

    console.log("✅ Backup saved successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Unexpected error saving backup:", error);
    return false;
  }
};

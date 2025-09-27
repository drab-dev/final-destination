import { supabase } from "./supabaseClient";

export const ensureBackupTableExists = async (): Promise<boolean> => {
  if (!supabase) {
    return false;
  }

  try {
    // Try to create the table - this will fail if it already exists, which is fine
    const { error } = await supabase.rpc("create_backup_table", {});

    if (error && !error.message.includes("already exists")) {
      console.error("❌ Failed to create backup table:", error);

      // Fallback: try a simple select to test if table exists
      const { error: testError } = await supabase
        .from("backups")
        .select("count")
        .limit(0);

      if (testError) {
        console.error(
          "❌ Backup table does not exist and cannot be created:",
          testError,
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error checking backup table:", error);
    return false;
  }
};

// Auto-run table check
ensureBackupTableExists();

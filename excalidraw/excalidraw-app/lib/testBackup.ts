// Simple test to verify backup functionality
import { supabase } from "./supabaseClient";

export const testBackupSystem = async () => {
  console.log("🧪 Testing backup system...");

  // Test 1: Check if Supabase client exists
  if (!supabase) {
    console.error("❌ Supabase client is not available");
    return false;
  }
  console.log("✅ Supabase client is available");

  try {
    // Test 2: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from("backups")
      .select("count")
      .limit(0);

    if (testError) {
      console.error("❌ Database connection failed:", testError);
      if (testError.code === "42P01") {
        console.error(
          "💡 Table 'backups' does not exist. Please run the SQL script.",
        );
      }
      return false;
    }

    console.log("✅ Database connection successful");

    // Test 3: Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Authentication check failed:", authError);
      return false;
    }

    if (user) {
      console.log("✅ User is authenticated:", user.id);

      // Test 4: Try to perform a backup operation
      const testBackupData = {
        elements: [
          {
            id: "test",
            type: "rectangle",
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
        ],
      };

      const { error: saveError } = await supabase.from("backups").upsert(
        {
          user_id: user.id,
          data: testBackupData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

      if (saveError) {
        console.error("❌ Test backup save failed:", saveError);
        return false;
      }

      console.log("✅ Test backup save successful");

      // Test 5: Try to load the backup
      const { data: loadData, error: loadError } = await supabase
        .from("backups")
        .select("data")
        .eq("user_id", user.id)
        .single();

      if (loadError) {
        console.error("❌ Test backup load failed:", loadError);
        return false;
      }

      console.log("✅ Test backup load successful");
      console.log("🎉 All backup system tests passed!");
      return true;
    }
    console.log("ℹ️ No user authenticated - login required for full test");
    return true; // Connection works, just no user
  } catch (error) {
    console.error("❌ Unexpected error during backup test:", error);
    return false;
  }
};

// Auto-run test when this module is imported
testBackupSystem();

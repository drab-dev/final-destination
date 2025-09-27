import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Expect the following environment variables to be defined (e.g. in a .env.local file):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// Vite exposes them to the client when prefixed with VITE_.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

console.log("🔧 Supabase config check:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "undefined",
});

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw to avoid hard crashing the whole app build/runtime.
  // Instead, log a clear warning so auth UI can present a message.
  // (Supabase-dependent code should gracefully handle undefined client.)
  // eslint-disable-next-line no-console
  console.warn(
    "❌ Supabase credentials are missing. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.",
  );
}

export const supabase: SupabaseClient | undefined =
  supabaseUrl && supabaseAnonKey
    ? (() => {
        console.log("✅ Creating Supabase client...");
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        });
        console.log("✅ Supabase client created successfully");
        return client;
      })()
    : (() => {
        console.log("❌ Supabase client not created - missing credentials");
        return undefined;
      })();

export type SupabaseClientType = SupabaseClient | undefined;

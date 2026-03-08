import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// ── Example DB helpers ──────────────────────────────────────────────────────

export async function logFoodSearch(foodName: string, userId?: string) {
  const { error } = await supabase.from("food_searches").insert({
    food_name: foodName,
    user_id: userId ?? null,
    searched_at: new Date().toISOString(),
  });
  if (error) console.error("[Supabase] logFoodSearch error:", error.message);
}

export async function getFoodFromCache(foodName: string) {
  const { data, error } = await supabase
    .from("food_cache")
    .select("*")
    .ilike("name", foodName.trim())
    .maybeSingle();

  if (error) console.error("[Supabase] getFoodFromCache error:", error.message);
  return data;
}

export async function saveFoodToCache(foodData: Record<string, unknown>) {
  const { error } = await supabase.from("food_cache").upsert(foodData, {
    onConflict: "name",
  });
  if (error) console.error("[Supabase] saveFoodToCache error:", error.message);
}

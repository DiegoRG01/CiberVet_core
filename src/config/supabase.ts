import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL no está definida en las variables de entorno");
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_ANON_KEY no está definida en las variables de entorno",
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  },
);

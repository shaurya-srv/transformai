import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client using @supabase/ssr.
 * Uses cookies (not localStorage) for session persistence,
 * so server-side auth (middleware, callback route) and client-side auth share the same session.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 * Only use in API routes and server actions — never expose to the client.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Create a Supabase client that reads the user's session from cookies.
 * Use this in middleware and server components that need the user's identity.
 */
export function createServerClientWithCookies(
  getAll: () => { name: string; value: string }[],
  setAll: (cookies: { name: string; value: string; options?: Record<string, unknown> }[]) => void
) {
  const { createServerClient: createSSRClient } = require("@supabase/ssr");
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll,
        setAll,
      },
    }
  );
}

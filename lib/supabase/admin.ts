import { createServerClient } from '@supabase/ssr'

// Admin client with service role for server-side operations
// This file does NOT import next/headers, so it can be used in any context
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}

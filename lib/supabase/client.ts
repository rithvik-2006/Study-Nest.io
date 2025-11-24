import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("[v0] Supabase environment variables not configured. Some features will not work.")
    // Return a dummy client that won't crash - will fail gracefully when methods are called
    return createBrowserClient("https://placeholder.supabase.co", "placeholder-key")
  }

  return createBrowserClient(url, key)
}

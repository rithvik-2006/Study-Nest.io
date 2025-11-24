import { createClient } from "@/lib/supabase/server"
import type { Deck } from "@/lib/types/database"

export async function createDeck(
  title: string,
  description: string,
  tags: string[],
  visibility: "private" | "public",
): Promise<Deck | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("decks")
    .insert({
      owner_id: user.id,
      title,
      description,
      tags,
      visibility,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserDecks(limit = 50, offset = 0) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getPublicDecks(limit = 50, offset = 0) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getDeckById(deckId: string): Promise<Deck | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("decks").select("*").eq("id", deckId).single()

  if (error) throw error
  return data
}

export async function updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Verify ownership
  const { data: deck } = await supabase.from("decks").select("owner_id").eq("id", deckId).single()

  if (deck?.owner_id !== user.id) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("decks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", deckId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDeck(deckId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Verify ownership
  const { data: deck } = await supabase.from("decks").select("owner_id").eq("id", deckId).single()

  if (deck?.owner_id !== user.id) throw new Error("Unauthorized")

  const { error } = await supabase.from("decks").delete().eq("id", deckId)
  if (error) throw error
}

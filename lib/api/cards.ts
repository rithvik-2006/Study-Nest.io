import { createClient } from "@/lib/supabase/server"
import type { Card } from "@/lib/types/database"

export async function createCard(
  deckId: string,
  front: string,
  back: string,
  hint?: string,
  mediaPath?: string,
): Promise<Card | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cards")
    .insert({
      deck_id: deckId,
      front,
      back,
      hint,
      media_path: mediaPath,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCardsByDeck(deckId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", deckId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function updateCard(cardId: string, updates: Partial<Card>): Promise<Card | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cards")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", cardId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCard(cardId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("cards").delete().eq("id", cardId)
  if (error) throw error
}

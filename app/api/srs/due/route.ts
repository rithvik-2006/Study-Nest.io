//api/srs/due/route.ts
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { deck_id } = body

  if (!deck_id) {
    return NextResponse.json({ error: "Deck ID is required" }, { status: 400 })
  }

  // Get cards from the deck
  const { data: cards, error: cardsError } = await supabase
  .from("cards")
  .select("id")
  .eq("deck_id", deck_id)

if (cardsError) {
  console.error("POST /api/srs/due cards error:", cardsError)
  return NextResponse.json({ error: cardsError.message }, { status: 500 })
}

  if (!cards || cards.length === 0) {
    return NextResponse.json([])
  }

  const cardIds = cards.map((c) => c.id)

  // Get due cards (today or earlier) and new cards
  const today = new Date().toISOString().split("T")[0]

  const { data: dueCards, error: dueError } = await supabase
  .from("srs_states")
  .select("card_id")
  .eq("user_id", user.id)
  .in("card_id", cardIds)
  .lte("due_date", today)
  .order("due_date", { ascending: true })

  if (dueError) {
    console.error("POST /api/srs/due dueCards error:", dueError)
    return NextResponse.json({ error: dueError.message }, { status: 500 })
  }

  // Get new cards (not in SRS states)
  const dueCardIds = dueCards?.map((c) => c.card_id) || []
  const newCardIds = cardIds.filter((id) => !dueCardIds.includes(id))

  const reviewCards = [...dueCardIds, ...newCardIds.slice(0, 10)]

  const { data: fullCards, error: fullCardsError } = await supabase
  .from("cards")
  .select("*")
  .in("id", reviewCards)

if (fullCardsError) {
  console.error("POST /api/srs/due fullCards error:", fullCardsError)
  return NextResponse.json({ error: fullCardsError.message }, { status: 500 })
}


  return NextResponse.json(fullCards || [])
}

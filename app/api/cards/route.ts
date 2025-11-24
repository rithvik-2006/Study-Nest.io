//api/cards/route.ts
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error("auth.getUser error in /api/cards:", userError)
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { deck_id, front, back, hint } = body

  if (!deck_id || !front || !back) {
    return NextResponse.json(
      { error: "Deck ID, front, and back are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("cards")
    .insert({
      deck_id,
      front,
      back,
      hint: hint || null,
      // optionally, if you have an owner/user_id column:
      // user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("POST /api/cards insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

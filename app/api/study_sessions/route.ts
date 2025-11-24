//api/study_sessions/route.ts
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

  const { data, error } = await supabase
  .from("study_sessions")
  .insert({
    user_id: user.id,
    deck_id,
    stats: {
      cards_reviewed: 0,
      percent_correct: 0,
      avg_response_time: 0,
    },
  })
  .select()
  .single()

if (error) {
  console.error("POST /api/study_sessions error:", error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}


  return NextResponse.json(data)
}

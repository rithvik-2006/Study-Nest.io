import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { updateSRS } from "@/lib/srs"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: sessionId } = await params
  const body = await request.json()
  const { card_id, quality } = body

  if (!card_id || quality === undefined) {
    return NextResponse.json({ error: "Card ID and quality are required" }, { status: 400 })
  }

  // Get or create SRS state
  const { data: existingSRS } = await supabase
    .from("srs_states")
    .select("*")
    .eq("user_id", user.id)
    .eq("card_id", card_id)
    .single()

  const currentState = existingSRS || {
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
  }

  const updated = updateSRS(currentState, quality)

  if (existingSRS) {
    await supabase
      .from("srs_states")
      .update({
        easiness: updated.easiness,
        interval: updated.interval,
        repetitions: updated.repetitions,
        due_date: updated.dueDate.toISOString().split("T")[0],
        last_reviewed: new Date().toISOString(),
      })
      .eq("id", existingSRS.id)
  } else {
    await supabase.from("srs_states").insert({
      user_id: user.id,
      card_id,
      easiness: updated.easiness,
      interval: updated.interval,
      repetitions: updated.repetitions,
      due_date: updated.dueDate.toISOString().split("T")[0],
      last_reviewed: new Date().toISOString(),
    })
  }

  return NextResponse.json({ success: true })
}

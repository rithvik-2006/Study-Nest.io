//api/decks/[id]/cards/route.ts

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

type Params = Promise<{ id: string }>

export async function GET(request: NextRequest, context: { params: Params }) {
  const supabase = await createClient()
  const { id } = await context.params

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("GET /api/decks/[id]/cards error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}


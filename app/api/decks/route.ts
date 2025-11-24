//api/decks/route.ts

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
  const { title, description, tags, visibility } = body

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("decks")
    .insert({
      owner_id: user.id,
      title,
      description,
      tags: tags || [],
      visibility: visibility || "private",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const isPublic = searchParams.get("public") === "true"

  let query = supabase.from("decks").select("*")

  if (isPublic) {
    query = query.eq("visibility", "public")
  } else {
    query = query.eq("owner_id", user.id)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

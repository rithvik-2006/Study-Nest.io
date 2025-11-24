//api/decks/[id]/route.ts
// import { createClient } from "@/lib/supabase/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   const supabase = await createClient()
//   const { id } = await params

//   const { data, error } = await supabase.from("decks").select("*").eq("id", id).single()

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   return NextResponse.json(data)
// }

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

type Params = Promise<{ id: string }>

export async function GET(request: NextRequest, context: { params: Params }) {
  const supabase = await createClient()
  const { id } = await context.params

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("GET /api/decks/[id] error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}


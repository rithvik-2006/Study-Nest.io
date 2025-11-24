
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
  const { target_type, target_id, reason } = body

  if (!target_type || !target_id || !reason) {
    return NextResponse.json({ error: "target_type, target_id, and reason are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("flags")
    .insert({
      reporter_id: user.id,
      target_type,
      target_id,
      reason,
      status: "pending",
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

  // For MVP, only get flags for admin (hardcoded check)
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
  const isAdmin = adminEmails.includes(user.email || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("flags")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if admin
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
  const isAdmin = adminEmails.includes(user.email || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { action } = body // 'delete' or 'dismiss'

  if (!action || !["delete", "dismiss"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  // Get the flag
  const { data: flag, error: flagError } = await supabase.from("flags").select("*").eq("id", id).single()

  if (flagError) {
    return NextResponse.json({ error: flagError.message }, { status: 500 })
  }

  // If delete action, delete the flagged content
  if (action === "delete") {
    if (flag.target_type === "deck") {
      await supabase.from("decks").delete().eq("id", flag.target_id)
    } else if (flag.target_type === "card") {
      await supabase.from("cards").delete().eq("id", flag.target_id)
    }
  }

  // Update flag status
  const { error: updateError } = await supabase
    .from("flags")
    .update({
      status: "resolved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

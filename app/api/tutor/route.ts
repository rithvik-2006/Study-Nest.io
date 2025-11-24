import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 60 // requests per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000 // 24 hours in ms

// In-memory rate limiting (for MVP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Rate limiting
  const now = Date.now()
  const userLimit = rateLimitMap.get(user.id) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

  if (now > userLimit.resetTime) {
    userLimit.count = 0
    userLimit.resetTime = now + RATE_LIMIT_WINDOW
  }

  if (userLimit.count >= RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  userLimit.count += 1
  rateLimitMap.set(user.id, userLimit)

  const body = await request.json()
  const { deck_id, card_id, message, context } = body

  // Get card data for context
  let cardData = null
  if (card_id) {
    const { data } = await supabase.from("cards").select("*").eq("id", card_id).single()
    cardData = data
  }

  // Generate fallback response using rule-based logic
  let response = "I'm ready to help you study! "

  if (message.toLowerCase().includes("explain")) {
    if (cardData) {
      response = `The key concept is: ${cardData.front}. Simply put, ${cardData.back}. `
    } else {
      response = "I'd be happy to explain! Please select a card first."
    }
  } else if (message.toLowerCase().includes("example")) {
    if (cardData) {
      const backWords = cardData.back.split(" ")
      const keywords = backWords.slice(0, 3).join(" ")
      response = `Here's an example related to this topic: ${keywords} is a fundamental concept. When you understand this, you'll see how it applies to many real-world situations.`
    } else {
      response = "Let me know which card you'd like an example for!"
    }
  } else if (message.toLowerCase().includes("hint")) {
    if (cardData?.hint) {
      response = `Hint: ${cardData.hint}`
    } else {
      response = "No hint available for this card."
    }
  } else {
    response =
      "I don't know the answer to that yet — I'll provide detailed tutor replies when the model is deployed. For now, try asking me to 'explain' or give an 'example'!"
  }

  // Store chat log
  try {
    await supabase.from("chat_logs").insert({
      user_id: user.id,
      deck_id: deck_id || null,
      card_id: card_id || null,
      message,
      response,
      model_version: "v1-fallback",
    })
  } catch (error) {
    console.error("Failed to log chat:", error)
  }

  return NextResponse.json({
    reply: response,
    model_version: "v1-fallback",
  })
}

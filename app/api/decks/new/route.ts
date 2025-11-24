//api/decks/new/route.ts 
import { CircleArrowOutDownLeftIcon } from "lucide-react"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    title: "",
    description: "",
    tags: [],
    visibility: "private",
  })
}


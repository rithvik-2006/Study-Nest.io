import { createClient } from "@/lib/supabase/server"
import { DeckList } from "@/components/deck-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {profile?.display_name || user.email}!</h1>
            <p className="text-muted-foreground mt-2">Start studying or create a new deck</p>
          </div>
          <Link href="/deck/new">
            <Button size="lg">Create Deck</Button>
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Decks</h2>
          <DeckList userDecks={true} />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Public Decks</h2>
          <DeckList userDecks={false} />
        </div>
      </div>
    </main>
  )
}

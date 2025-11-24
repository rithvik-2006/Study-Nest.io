"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Deck } from "@/lib/types/database"

export function DeckList({ userDecks = true }: { userDecks?: boolean }) {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch(`/api/decks?public=${!userDecks}`)
        if (!response.ok) throw new Error("Failed to fetch decks")
        const data = await response.json()
        setDecks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch decks")
      } finally {
        setLoading(false)
      }
    }

    fetchDecks()
  }, [userDecks])

  if (loading) return <div className="text-center py-12">Loading decks...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No decks yet</p>
        {userDecks && (
          <Link href="/deck/new">
            <Button>Create your first deck</Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Card key={deck.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg truncate">{deck.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{deck.description || "No description"}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {deck.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/deck/${deck.id}`}>
              <Button className="w-full bg-transparent" variant="outline">
                Open Deck
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

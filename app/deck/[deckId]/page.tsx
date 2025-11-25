

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card as CardComponent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Card as CardType, Deck } from "@/lib/types/database"

export default function DeckPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    hint: "",
  })

  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        const deckResponse = await fetch(`/api/decks/${deckId}`)
        if (!deckResponse.ok) throw new Error("Failed to fetch deck")
        const deckData = await deckResponse.json()
        setDeck(deckData)

        const cardsResponse = await fetch(`/api/decks/${deckId}/cards`)
        if (!cardsResponse.ok) throw new Error("Failed to fetch cards")
        const cardsData = await cardsResponse.json()
        setCards(cardsData)
      } catch (error) {
        console.error("Failed to fetch deck:", error)
      } finally {
        setLoading(false)
      }
    }

    if (deckId) fetchDeckData()
  }, [deckId])

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck_id: deckId, ...formData }),
      })

      if (!response.ok) throw new Error("Failed to add card")
      const newCard = await response.json()
      setCards([...cards, newCard])
      setFormData({ front: "", back: "", hint: "" })
      setShowAddCard(false)
    } catch (error) {
      console.error("Failed to add card:", error)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-[#ECDFCC] bg-[#181C14]">
        Loading...
      </div>
    )

  if (!deck)
    return (
      <div className="flex items-center justify-center min-h-screen text-[#ECDFCC] bg-[#181C14]">
        Deck not found
      </div>
    )

  return (
    <main className="min-h-screen bg-[#181C14] p-6">
      <div className="max-w-4xl mx-auto text-[#ECDFCC]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{deck.title}</h1>
          <p className="text-[#697565]">{deck.description}</p>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => router.push(`/study/${deckId}`)}
              className="bg-[#697565] hover:bg-[#586454] text-[#ECDFCC]"
            >
              Start Study Session
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border border-[#697565] text-[#181C14] hover:bg-[#697565]"
            >
              Back
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Cards ({cards.length})</h2>
            <Button
              onClick={() => setShowAddCard(!showAddCard)}
              className="bg-[#697565] hover:bg-[#586454] text-[#ECDFCC]"
            >
              {showAddCard ? "Cancel" : "Add Card"}
            </Button>
          </div>

          {showAddCard && (
            <CardComponent className="p-6 mb-6 bg-[#3C3D37] border-none">
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <Label htmlFor="front" className="text-[#ECDFCC]">
                    Front (Question)
                  </Label>
                  <Input
                    id="front"
                    value={formData.front}
                    onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                    placeholder="What is the capital of France?"
                    className="bg-[#181C14] border-[#697565] text-[#ECDFCC]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="back" className="text-[#ECDFCC]">
                    Back (Answer)
                  </Label>
                  <Input
                    id="back"
                    value={formData.back}
                    onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                    placeholder="Paris"
                    className="bg-[#181C14] border-[#697565] text-[#ECDFCC]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hint" className="text-[#ECDFCC]">
                    Hint (optional)
                  </Label>
                  <Input
                    id="hint"
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    placeholder="The city of love"
                    className="bg-[#181C14] border-[#697565] text-[#ECDFCC]"
                  />
                </div>

                <Button type="submit" className="bg-[#697565] hover:bg-[#586454] text-[#ECDFCC]">
                  Add Card
                </Button>
              </form>
            </CardComponent>
          )}

          <div className="space-y-3">
            {cards.map((card) => (
              <CardComponent key={card.id} className="p-4 bg-[#3C3D37] border-none">
                <p className="font-semibold text-[#ECDFCC] mb-2">{card.front}</p>
                <p className="text-sm text-[#ECDFCC]">{card.back}</p>
              </CardComponent>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

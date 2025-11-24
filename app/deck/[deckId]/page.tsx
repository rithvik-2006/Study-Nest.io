//app/deck/[deckId]/page.tsx
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
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(deckId)
  // useEffect(() => {
  //   const fetchDeckData = async () => {
  //     try {
  //       // Fetch deck details
  //       const deckResponse = await fetch(`/api/decks/${deckId}`)
  //       if (!deckResponse.ok) throw new Error("Failed to fetch deck")
  //       const deckData = await deckResponse.json()
  //       setDeck(deckData)

  //       // Fetch cards
  //       const cardsResponse = await fetch(`/api/decks/${deckId}/cards`)
  //       if (!cardsResponse.ok) throw new Error("Failed to fetch cards")
  //       const cardsData = await cardsResponse.json()
  //       setCards(cardsData)
  //     } catch (error) {
  //       console.error("Failed to fetch deck:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (deckId) {
  //     fetchDeckData()
  //   }
  // }, [deckId])

  // const handleAddCard = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     const response = await fetch("/api/cards", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         deck_id: deckId,
  //         ...formData,
  //       }),
  //     })

  //     if (!response.ok) throw new Error("Failed to add card")
  //     const newCard = await response.json()
  //     setCards([...cards, newCard])
  //     setFormData({ front: "", back: "", hint: "" })
  //     setShowAddCard(false)
  //   } catch (error) {
  //     console.error("Failed to add card:", error)
  //   }
  // }
  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        // Bail out if deckId is "new" - this route is for existing decks only
        if (deckId === "new" || !isValidUuid) {
          console.error("Invalid deck ID for this page:", deckId)
          router.push("/dashboard") // or wherever you want to redirect
          return
        }
  
        // Fetch deck details
        const deckResponse = await fetch(`/api/decks/${deckId}`)
        if (!deckResponse.ok) throw new Error("Failed to fetch deck")
        const deckData = await deckResponse.json()
        setDeck(deckData)
  
        // Fetch cards
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
  
    if (deckId) {
      fetchDeckData()
    }
  }, [deckId, isValidUuid, router])
  
  

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!isValidUuid) {
      console.error("Cannot add card: deckId is not a valid UUID", deckId)
      return
    }
  
    try {
      // Call /api/cards to add a card, NOT /api/decks
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_id: deckId,
          ...formData,
        }),
      })
  
      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error("Add card failed:", response.status, err)
        throw new Error("Failed to add card")
      }
  
      const newCard = await response.json()
      setCards((prev) => [...prev, newCard])
      setFormData({ front: "", back: "", hint: "" })
      setShowAddCard(false)
    } catch (error) {
      console.error("Failed to add card:", error)
    }
  }
  
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!deck) {
    return <div className="flex items-center justify-center min-h-screen">Deck not found</div>
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{deck.title}</h1>
          <p className="text-muted-foreground">{deck.description}</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => router.push(`/study/${deckId}`)}>Start Study Session</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Cards ({cards.length})</h2>
            <Button onClick={() => setShowAddCard(!showAddCard)}>{showAddCard ? "Cancel" : "Add Card"}</Button>
          </div>

          {showAddCard && (
            <CardComponent className="p-6 mb-6">
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <Label htmlFor="front">Front (Question)</Label>
                  <Input
                    id="front"
                    value={formData.front}
                    onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                    placeholder="What is the capital of France?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="back">Back (Answer)</Label>
                  <Input
                    id="back"
                    value={formData.back}
                    onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                    placeholder="Paris"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hint">Hint (optional)</Label>
                  <Input
                    id="hint"
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    placeholder="The city of love"
                  />
                </div>
                <Button type="submit">Add Card</Button>
              </form>
            </CardComponent>
          )}

          <div className="space-y-3">
            {cards.map((card) => (
              <CardComponent key={card.id} className="p-4">
                <p className="font-semibold mb-2">{card.front}</p>
                <p className="text-muted-foreground text-sm">{card.back}</p>
              </CardComponent>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

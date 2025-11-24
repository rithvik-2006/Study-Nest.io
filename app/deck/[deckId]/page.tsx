// app/study/[deckId]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card as CardComponent } from "@/components/ui/card"
import type { Card as CardType, Deck } from "@/lib/types/database"

export default function StudySession() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<CardType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deckResponse = await fetch(`/api/decks/${deckId}`)
        const deckData = await deckResponse.json()
        setDeck(deckData)

        const cardsResponse = await fetch(`/api/decks/${deckId}/cards`)
        const cardsData = await cardsResponse.json()
        setCards(cardsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [deckId])

  const nextCard = () => {
    setShowAnswer(false)
    setCurrentIndex((prev) => (prev + 1 < cards.length ? prev + 1 : prev))
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (!deck) return <div className="flex justify-center items-center min-h-screen">Deck not found</div>

  const card = cards[currentIndex]

  return (
    <main className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: "#181C14" }}>
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#ECDFCC" }}>{deck.title}</h1>

      <CardComponent className="p-8 w-full max-w-2xl text-center"
        style={{ backgroundColor: "#3C3D37", color: "#ECDFCC" }}
      >
        <h2 className="text-2xl font-semibold mb-4">{card.front}</h2>

        {showAnswer && (
          <p className="text-lg mt-4" style={{ color: "#697565" }}>
            {card.back}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <Button
            style={{ backgroundColor: "#697565", color: "#ECDFCC" }}
            className="hover:opacity-90"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>

          <Button
            style={{ borderColor: "#697565", color: "#ECDFCC" }}
            className="hover:opacity-90"
            variant="outline"
            onClick={nextCard}
          >
            Next
          </Button>
        </div>
      </CardComponent>

      <Button
        className="mt-8 hover:opacity-90"
        style={{ borderColor: "#697565", color: "#ECDFCC" }}
        variant="outline"
        onClick={() => router.push(`/deck/${deckId}`)}
      >
        Back to Deck
      </Button>

      <p className="mt-4" style={{ color: "#697565" }}>
        Card {currentIndex + 1} of {cards.length}
      </p>
    </main>
  )
}

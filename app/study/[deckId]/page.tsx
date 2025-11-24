//app/study/[deckId]/page.tsx
"use client"

import { StudyCard } from "@/components/study-card"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "@/lib/types/database"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const [cards, setCards] = useState<CardType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cardCount, setCardCount] = useState(0)

  useEffect(() => {
    const initStudySession = async () => {
      try {
        // Create study session
        const sessionResponse = await fetch("/api/study_sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deck_id: deckId }),
        })
        const session = await sessionResponse.json()
        setSessionId(session.id)

        // Get due cards
        const cardsResponse = await fetch("/api/srs/due", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deck_id: deckId }),
        })
        const dueCards = await cardsResponse.json()
        setCards(dueCards)
        setCardCount(dueCards.length)
      } catch (error) {
        console.error("Failed to initialize study session:", error)
      } finally {
        setLoading(false)
      }
    }

    initStudySession()
  }, [deckId])

  const handleReview = async (quality: number) => {
    if (!sessionId) return
    if (!cards[currentIndex]) return  // extra safety
  
    try {
      await fetch(`/api/study_sessions/${sessionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_id: cards[currentIndex].id,
          quality,
        }),
      })
  
      setCurrentIndex((prev) => {
        if (prev < cards.length - 1) {
          return prev + 1
        } else {
          router.push("/dashboard")
          return prev
        }
      })
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading study session...</div>
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">No cards to review!</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">No more cards to review!</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Study Session</h1>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {cardCount}
          </p>
        </div>

        <div className="w-full bg-secondary h-1 rounded mb-8">
          <div
            className="bg-primary h-1 rounded transition-all"
            style={{ width: `${((currentIndex + 1) / cardCount) * 100}%` }}
          />
        </div>

        // after const currentCard = cards[currentIndex]

{/* return (
  <main className="min-h-screen bg-background p-6">
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Session</h1>
        <p className="text-muted-foreground">
          Card {currentIndex + 1} of {cardCount}
        </p>
      </div>

      <div className="w-full bg-secondary h-1 rounded mb-8">
        <div
          className="bg-primary h-1 rounded transition-all"
          style={{ width: `${((currentIndex + 1) / cardCount) * 100}%` }}
        />
      </div>

      <StudyCard
        card={currentCard}
        onReview={handleReview}
        isLoading={loading}
      />
    </div>
  </main>
) */}


      </div>
    </main>
  )
}

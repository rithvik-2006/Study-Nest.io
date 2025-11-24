//components/study-card.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import type { Card as CardType } from "@/lib/types/database"

interface StudyCardProps {
  card: CardType
  onReview: (quality: number) => Promise<void>
  isLoading?: boolean
}

export function StudyCard({ card, onReview, isLoading }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  const handleReview = async (quality: number) => {
    setReviewing(true)
    try {
      await onReview(quality)
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className="p-12 min-h-48 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{isFlipped ? "Back" : "Front"}</p>
          <p className="text-2xl font-semibold whitespace-pre-wrap">{isFlipped ? card.back : card.front}</p>
          {isFlipped && card.hint && <p className="text-sm text-muted-foreground mt-4 italic">Hint: {card.hint}</p>}
        </div>
      </Card>

      {isFlipped && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Button onClick={() => handleReview(0)} disabled={reviewing || isLoading} variant="destructive">
            Again
          </Button>
          <Button onClick={() => handleReview(1)} disabled={reviewing || isLoading} variant="outline">
            Hard
          </Button>
          <Button onClick={() => handleReview(3)} disabled={reviewing || isLoading} variant="outline">
            Good
          </Button>
          <Button onClick={() => handleReview(4)} disabled={reviewing || isLoading} variant="default">
            Easy
          </Button>
        </div>
      )}
    </div>
  )
}

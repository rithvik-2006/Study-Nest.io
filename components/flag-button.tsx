"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FlagButtonProps {
  targetType: "deck" | "card"
  targetId: string
}

export function FlagButton({ targetType, targetId }: FlagButtonProps) {
  const [flagged, setFlagged] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFlag = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason: `Inappropriate ${targetType}`,
        }),
      })

      if (response.ok) {
        setFlagged(true)
      }
    } catch (error) {
      console.error("Failed to flag content:", error)
    } finally {
      setLoading(false)
    }
  }

  if (flagged) {
    return (
      <Button disabled variant="outline" size="sm">
        Flagged for review
      </Button>
    )
  }

  return (
    <Button onClick={handleFlag} disabled={loading} variant="ghost" size="sm">
      Report
    </Button>
  )
}

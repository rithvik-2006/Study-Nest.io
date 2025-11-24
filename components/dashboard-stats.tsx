"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalDecks: 0,
    cardsReviewed: 0,
    streak: 0,
    dueCards: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Get total decks
        const { data: decks } = await supabase.from("decks").select("id", { count: "exact" }).eq("owner_id", user.id)

        // Get cards reviewed today
        const today = new Date().toISOString().split("T")[0]
        const { data: sessions } = await supabase
          .from("study_sessions")
          .select("stats")
          .eq("user_id", user.id)
          .gte("created_at", today)

        const totalCardsReviewed = sessions?.reduce((sum, s) => sum + (s.stats?.cards_reviewed || 0), 0) || 0

        setStats({
          totalDecks: decks?.length || 0,
          cardsReviewed: totalCardsReviewed,
          streak: 0, // TODO: implement streak tracking
          dueCards: 0, // TODO: implement due cards count
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    { label: "Decks", value: stats.totalDecks },
    { label: "Cards Reviewed Today", value: stats.cardsReviewed },
    { label: "Current Streak", value: stats.streak },
    { label: "Cards Due", value: stats.dueCards },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

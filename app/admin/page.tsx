"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type { Flag } from "@/lib/types/database"

export default function AdminPage() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolving, setResolving] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch("/api/flags")
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("You don't have admin access")
          }
          throw new Error("Failed to fetch flags")
        }
        const data = await response.json()
        setFlags(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch flags")
      } finally {
        setLoading(false)
      }
    }

    fetchFlags()
  }, [])

  const handleResolve = async (flagId: string, action: "delete" | "dismiss") => {
    setResolving(flagId)
    try {
      const response = await fetch(`/api/flags/${flagId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setFlags(flags.filter((f) => f.id !== flagId))
      }
    } catch (error) {
      console.error("Failed to resolve flag:", error)
    } finally {
      setResolving(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Flagged Content ({flags.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {flags.length === 0 ? (
              <p className="text-muted-foreground">No pending flags</p>
            ) : (
              <div className="space-y-4">
                {flags.map((flag) => (
                  <div key={flag.id} className="p-4 border rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">
                        {flag.target_type === "deck" ? "Deck" : "Card"}: {flag.target_id}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Reason: {flag.reason}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Reported on {new Date(flag.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleResolve(flag.id, "dismiss")}
                        disabled={resolving === flag.id}
                        variant="outline"
                        size="sm"
                      >
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => handleResolve(flag.id, "delete")}
                        disabled={resolving === flag.id}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

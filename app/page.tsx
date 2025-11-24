"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          if (error.message.includes("Supabase") || error.message.includes("URL")) {
            setError("Supabase not configured. Please add environment variables.")
          }
          setUser(null)
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.warn("[v0] Could not check user:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4 text-yellow-600">Configuration Required</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <p className="text-sm text-muted-foreground">
            Add your Supabase environment variables in the Vars section of the sidebar.
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome back!</h1>
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">StudyNest</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Powerful flashcard learning with intelligent spaced repetition. Study smarter, remember longer.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Spaced Repetition</h3>
            <p className="text-muted-foreground">Intelligent algorithms optimize your learning schedule</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Smart Tutoring</h3>
            <p className="text-muted-foreground">AI-powered hints and explanations for your cards</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">Monitor your learning with detailed analytics</p>
          </div>
        </div>
      </div>
    </main>
  )
}

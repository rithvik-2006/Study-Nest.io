// "use client"

// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useRouter } from "next/navigation"
// import { useState } from "react"

// export default function NewDeckPage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     tags: [] as string[],
//     visibility: "private" as "public" | "private",
//   })

//   const handleCreateDeck = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch("/api/decks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const err = await response.json().catch(() => null)
//         console.error("Create deck failed:", response.status, err)
//         throw new Error("Failed to create deck")
//       }

//       const newDeck = await response.json()
//       // Navigate to the newly created deck's page with its real UUID
//       router.push(`/deck/${newDeck.id}`)
//     } catch (error) {
//       console.error("Failed to create deck:", error)
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-background p-6">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">Create New Deck</h1>

//         <Card className="p-6">
//           <form onSubmit={handleCreateDeck} className="space-y-4">
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 placeholder="My Awesome Flashcard Deck"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Input
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Learn vocabulary, concepts, etc."
//               />
//             </div>

//             <div>
//               <Label htmlFor="visibility">Visibility</Label>
//               <select
//                 id="visibility"
//                 value={formData.visibility}
//                 onChange={(e) =>
//                   setFormData({ ...formData, visibility: e.target.value as "public" | "private" })
//                 }
//                 className="w-full px-3 py-2 border rounded-md"
//               >
//                 <option value="private">Private</option>
//                 <option value="public">Public</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Creating..." : "Create Deck"}
//               </Button>
//               <Button type="button" variant="outline" onClick={() => router.back()}>
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </Card>
//       </div>
//     </main>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewDeckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    visibility: "private" as "public" | "private",
  })

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error("Create deck failed:", response.status, err)
        throw new Error("Failed to create deck")
      }

      const newDeck = await response.json()
      router.push(`/deck/${newDeck.id}`)
    } catch (error) {
      console.error("Failed to create deck:", error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: "#181C14" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#ECDFCC" }}>
          Create New Deck
        </h1>

        <Card className="p-6" style={{ backgroundColor: "#3C3D37", color: "#ECDFCC" }}>
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div>
              <Label htmlFor="title" style={{ color: "#ECDFCC" }}>Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="My Awesome Flashcard Deck"
                required
                style={{ backgroundColor: "#3C3D37", color: "#ECDFCC", borderColor: "#697565" }}
              />
            </div>

            <div>
              <Label htmlFor="description" style={{ color: "#ECDFCC" }}>Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Learn vocabulary, concepts, etc."
                style={{ backgroundColor: "#3C3D37", color: "#ECDFCC", borderColor: "#697565" }}
              />
            </div>

            <div>
              <Label htmlFor="visibility" style={{ color: "#ECDFCC" }}>Visibility</Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value as "public" | "private" })
                }
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: "#3C3D37",
                  color: "#ECDFCC",
                  border: "1px solid #697565",
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="hover:opacity-90"
                style={{ backgroundColor: "#697565", color: "#ECDFCC" }}
              >
                {loading ? "Creating..." : "Create Deck"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="hover:opacity-90"
                style={{ borderColor: "#697565", color: "#ECDFCC" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}

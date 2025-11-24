// // import { createClient } from "@/lib/supabase/server"
// // import { DeckList } from "@/components/deck-list"
// // import { Button } from "@/components/ui/button"
// // import Link from "next/link"
// // import { redirect } from "next/navigation"

// // export default async function DashboardPage() {
// //   const supabase = await createClient()
// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser()

// //   if (!user) {
// //     redirect("/auth/login")
// //   }

// //   const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

// //   return (
// //     <main className="min-h-screen bg-background">
// //       <div className="max-w-7xl mx-auto p-6 md:p-10">
// //         <div className="flex justify-between items-center mb-8">
// //           <div>
// //             <h1 className="text-4xl font-bold">Welcome back, {profile?.display_name || user.email}!</h1>
// //             <p className="text-muted-foreground mt-2">Start studying or create a new deck</p>
// //           </div>
// //           <Link href="/deck/new">
// //             <Button size="lg">Create Deck</Button>
// //           </Link>
// //         </div>

// //         <div className="mb-12">
// //           <h2 className="text-2xl font-bold mb-6">Your Decks</h2>
// //           <DeckList userDecks={true} />
// //         </div>

// //         <div className="mb-12">
// //           <h2 className="text-2xl font-bold mb-6">Public Decks</h2>
// //           <DeckList userDecks={false} />
// //         </div>
// //       </div>
// //     </main>
// //   )
// // }


// import { createClient } from "@/lib/supabase/server"
// import { DeckList } from "@/components/deck-list"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { redirect } from "next/navigation"

// export default async function DashboardPage() {
//   const supabase = await createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/auth/login")
//   }

//   const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

//   return (
//     <main className="min-h-screen bg-[#0A192F] text-white">
//       <div className="max-w-7xl mx-auto p-6 md:p-10">
//         <div className="flex justify-between items-center mb-12">
//           <div>
//             <h1 className="text-4xl font-bold text-white">
//               Welcome back, {profile?.display_name || user.email}!
//             </h1>
//             <p className="text-[#8892B0] mt-2">
//               Start studying or create a new deck
//             </p>
//           </div>
//           <Link href="/deck/new">
//             <Button
//               size="lg"
//               className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#5ae6c5] font-semibold shadow-lg"
//             >
//               Create Deck
//             </Button>
//           </Link>
//         </div>

//         {/* Your Decks Section */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold mb-4 text-white">Your Decks</h2>

//           <div className="backdrop-blur-lg bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl">
//             <DeckList userDecks={true} />
//           </div>
//         </div>

//         {/* Public Decks Section */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold mb-4 text-white">Public Decks</h2>

//           <div className="backdrop-blur-lg bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl">
//             <DeckList userDecks={false} />
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

import { createClient } from "@/lib/supabase/server"
import { DeckList } from "@/components/deck-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#181C14" }}>
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: "#ECDFCC" }}>
              Welcome back, {profile?.display_name || user.email}!
            </h1>
            <p className="mt-2" style={{ color: "#697565" }}>
              Start studying or create a new deck
            </p>
          </div>

          <Link href="/deck/new">
            <Button
              size="lg"
              className="hover:opacity-90"
              style={{ backgroundColor: "#697565", color: "#ECDFCC" }}
            >
              Create Deck
            </Button>
          </Link>
        </div>

        {/* Your Decks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#ECDFCC" }}>
            Your Decks
          </h2>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "#3C3D37",
              boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              border: "1px solid #697565",
            }}
          >
            <DeckList userDecks={true} />
          </div>
        </div>

        {/* Public Decks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#ECDFCC" }}>
            Public Decks
          </h2>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "#3C3D37",
              boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              border: "1px solid #697565",
            }}
          >
            <DeckList userDecks={false} />
          </div>
        </div>
      </div>
    </main>
  )
}

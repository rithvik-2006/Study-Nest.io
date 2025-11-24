

# 📚 StudyNest — Smart Study App (MVP)

StudyNest is a modern, AI-ready study application built with **Next.js**, **Supabase**, and a pluggable tutor API.
This MVP focuses on fast studying, spaced repetition (SRS), easy deck/card creation, and a future-proof structure for integrating a custom AI tutor.

---

## 🚀 Features (MVP)

### ✅ Core Features

* **User Authentication**
  Email/password login powered by Supabase Auth.

* **Deck Management**
  Create, edit, delete study decks with titles, descriptions & tags.

* **Flashcards**
  Add cards with front/back text, hints, and optional images.

* **Spaced Repetition System (SRS)**
  Simple SM-2 algorithm: *Again / Hard / Good / Easy* review workflow.

* **Study Sessions**
  Due-card prioritization, progress tracking, streak updates.

* **CSV Import**
  Import flashcards from a formatted CSV file.

### 🤖 Tutor (Mock / Future-Ready)

* Basic rule-based tutor for now.
* Future AI integration via `TUTOR_ENDPOINT` environment variable.

### 📊 Dashboard

* Tracks daily activity, streaks, study progress, and due cards.

### ⚙️ Admin Tools

* Content moderation via flags on decks or cards.

---

## 🏗️ Tech Stack

* **Next.js 14+** (App Router, React Server Components)
* **TypeScript**
* **Tailwind CSS**
* **Supabase** (Auth, Postgres, Storage)
* **TanStack React Query**
* **Jest + RTL** (Unit/Component tests)
* **Playwright** (E2E tests)
* **GitHub Actions** (CI/CD)
* **Vercel** (Deployment)

---

## 📦 Project Structure

```
/app
  /dashboard
  /decks
  /study
  /api
/lib
/components
/supabase
/tests
```

---

## 🔧 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service role key used only for server tasks / migrations (never sent to client)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI tutor endpoint (placeholder for now)
TUTOR_ENDPOINT=NONE
```

### `TUTOR_ENDPOINT` explained

* `NONE` → always use fallback mock tutor
* URL (e.g., `https://example.com/inference`) → use real model
* Local test: `http://localhost:3000/api/mock-tutor`

---

## 🗄️ Database Schema (Supabase)

### Tables

* `profiles`
* `decks`
* `cards`
* `srs_states`
* `study_sessions`
* `chat_logs`
* `flags`

(Each table includes UUID PKs and timestamps.)

### RLS Policies

* Users can only view/modify their own decks & cards (unless public).
* Admin-only access to flagged content.

---

## ▶️ Running Locally

### 1. Install dependencies

```
pnpm install
```

or

```
npm install
```

### 2. Start dev server

```
pnpm dev
```

App runs at: **[http://localhost:3000](http://localhost:3000)**

### 3. Run tests

```
pnpm test
```

### 4. E2E Tests

```
pnpm exec playwright test
```

---

## 🚢 Deployment (Vercel + Supabase)

1. Deploy Supabase project
2. Add environment variables inside Vercel → Project Settings → Environment Variables
3. Push code to GitHub
4. Vercel auto-deploys
5. Update Supabase Auth redirect URLs in Dashboard

---

## 💡 How the Tutor Works

The `/api/tutor` route behaves like this:

1. If `TUTOR_ENDPOINT="NONE"`
   → Use mock rule-based responses.

2. If `TUTOR_ENDPOINT` is a URL
   → Forward request `{ message, deck_id, card_id, user_id }`
   → Show AI response if endpoint is reachable.
   → If endpoint fails → fallback to mock tutor.

---

## 🧪 Demo Flow (for testers)

1. Sign up with email/password
2. Create a new deck
3. Add 3–5 cards
4. Start study session
5. Mark each card (Again / Good / Easy)
6. View updated streak and progress in Dashboard
7. Open Tutor modal and ask a question (mock response)
8. Flag a card → check Admin panel

---

## 🛠️ Future Roadmap

### Coming Soon

* AI-powered tutor using your custom trained model
* Auto-generated flashcards from notes/PDFs
* Collaborative decks
* Mobile PWA
* Advanced analytics + personalized study plans
* Premium tier with unlimited tutor access

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome.
Please open an issue before major changes.

---

## 📄 License

MIT License (or add your preferred license here)

---

## ✨ Credits

Built with ❤️ using Next.js, Supabase, and a vision for smarter studying.

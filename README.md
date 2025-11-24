# StudyNest MVP

StudyNest is a lightweight, intelligent study app built with Next.js and Supabase. It features spaced repetition flashcards, an AI tutor placeholder, and admin moderation tools.

## Features

- **Authentication**: Email/password signup and login via Supabase Auth
- **Decks & Cards**: Create, edit, and organize flashcard decks
- **Spaced Repetition**: SM-2 algorithm for optimal review scheduling
- **Study Sessions**: Interactive study interface with card review buttons
- **Tutor Chat**: Rule-based tutor placeholder (ready for model integration)
- **Dashboard**: Track progress with stats and analytics
- **Admin Panel**: Moderation tools for managing user-generated content
- **RLS Security**: Row-level security policies protect user data

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Storage)
- **State**: React Query (TanStack Query) for data fetching
- **Testing**: Jest + React Testing Library (Playwright for E2E)

## Getting Started

### Prerequisites

- Node.js 16+
- Supabase account and project
- Vercel account (for deployment)

### Local Development

1. **Clone and install**:
   \`\`\`bash
   git clone <repo>
   cd studynest
   npm install
   \`\`\`

2. **Set up environment variables** (`.env.local`):
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

3. **Run database migrations**:
   - In Supabase dashboard, run SQL scripts from `scripts/` in order:
     - `001_create_profiles.sql`
     - `002_create_decks.sql`
     - `003_create_cards.sql`
     - `004_create_srs_states.sql`
     - `005_create_study_sessions.sql`
     - `006_create_chat_logs.sql`
     - `007_create_flags.sql`
     - `008_create_trigger_profile.sql`

4. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Visit http://localhost:3000

### Demo Scenario

1. **Sign up**: Go to `/auth/sign-up`, create an account
2. **Create deck**: Click "Create Deck" on dashboard
3. **Add cards**: Click "Open Deck", then "Add Card"
4. **Study**: Click "Start Study Session"
5. **Review**: Click review buttons (Again/Hard/Good/Easy)
6. **Chat**: During study, ask the tutor "explain" or "example"

### Admin Access

Set `ADMIN_EMAILS` environment variable with comma-separated admin emails:
\`\`\`
ADMIN_EMAILS=admin@example.com,moderator@example.com
\`\`\`

Admins can access `/admin` to view and moderate flagged content.

## API Endpoints

### Auth (Supabase)
- `POST /api/auth/sign-up`
- `POST /api/auth/login`

### Decks
- `GET /api/decks` — list user decks
- `POST /api/decks` — create deck
- `GET /api/decks/:id` — get deck details
- `PUT /api/decks/:id` — update deck
- `DELETE /api/decks/:id` — delete deck

### Cards
- `POST /api/cards` — add card
- `PUT /api/cards/:id` — update card
- `DELETE /api/cards/:id` — delete card

### Study & SRS
- `POST /api/study_sessions` — start session
- `POST /api/study_sessions/:id/review` — submit review
- `POST /api/srs/due` — get due cards

### Tutor
- `POST /api/tutor` — send message to tutor (rate limited: 60/day)

### Flags & Moderation
- `POST /api/flags` — flag content
- `GET /api/flags` — list flags (admin only)
- `POST /api/flags/:id/resolve` — resolve flag (admin only)

## Testing

\`\`\`bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
\`\`\`

## Deployment

### Deploy to Vercel

1. Push repo to GitHub
2. Connect repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Configure Supabase for Production

1. Set up email confirmation in Supabase Auth settings
2. Configure custom SMTP for email verification
3. Enable RLS on all tables
4. Set up backups in Supabase dashboard

## Extending with Your Model

To integrate your trained tutor model:

1. **Update `/api/tutor`**:
   \`\`\`typescript
   if (process.env.TUTOR_ENDPOINT) {
     const response = await fetch(process.env.TUTOR_ENDPOINT, {
       method: "POST",
       body: JSON.stringify({
         user_id: user.id,
         deck_id,
         card_id,
         message,
       }),
     });
     const modelReply = await response.json();
     response = modelReply.reply;
   }
   \`\`\`

2. **Add environment variable**:
   \`\`\`
   TUTOR_ENDPOINT=https://your-model-api.com/chat
   \`\`\`

3. **Update model_version** in chat_logs to track which model generated each response.

## Security Considerations

- **RLS Enabled**: All tables use Row-Level Security
- **Secrets**: No secrets in code; use environment variables
- **CORS**: API routes validate Supabase auth
- **Rate Limiting**: Tutor endpoint limited to 60 requests/day per user
- **Data Export/Delete**: Users can request data export and account deletion

## Performance

- **Page loads**: <1s for core pages
- **API responses**: <500ms for DB-only endpoints
- **Database**: Indexed by user_id, deck_id, due_date for fast queries

## Architecture

\`\`\`
app/
  ├── auth/                  # Authentication pages
  ├── dashboard/             # Main dashboard
  ├── deck/                  # Deck management
  ├── study/                 # Study sessions
  ├── admin/                 # Admin panel
  └── api/                   # API routes
lib/
  ├── supabase/              # Supabase clients
  ├── types/                 # TypeScript types
  ├── srs.ts                 # SRS algorithm
  └── api/                   # API utilities
components/
  ├── ui/                    # shadcn/ui components
  ├── deck-list.tsx          # Deck browser
  ├── study-card.tsx         # Study card component
  ├── tutor-chat.tsx         # Tutor chat interface
  └── flag-button.tsx        # Content flagging
scripts/
  ├── 001-008_*.sql          # Database migrations
  └── 009_seed_demo_data.sql # Demo data
\`\`\`

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Submit PR

## License

MIT

## Support

For issues or questions, open an issue in the GitHub repository or contact support@studynest.dev

---

**Next Steps After MVP**:
- Integrate your trained tutor model
- Add analytics (PostHog or similar)
- Implement CSV import for bulk card creation
- Add spaced repetition visualization
- Mobile app (React Native)
- Deck sharing and collaboration
- Premium features (unlimited storage, advanced stats)
\`\`\`

```env.example file=".env.example"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: for development email redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard

# Optional: Admin emails (comma-separated)
ADMIN_EMAILS=admin@example.com

# Optional: Tutor model endpoint (future)
TUTOR_ENDPOINT=

# Optional: Sentry error tracking
SENTRY_DSN=

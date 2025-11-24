# StudyNest Architecture

## High-Level Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components (Pages, Forms, Study Interface)   │   │
│  │  - Auth pages                                        │   │
│  │  - Dashboard                                         │   │
│  │  - Study sessions                                    │   │
│  │  - Deck management                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Supabase Client (@supabase/ssr)                   │   │
│  │   - Browser-based auth                              │   │
│  │   - Real-time subscriptions                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Server / Edge                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware (middleware.ts)                          │   │
│  │  - Auth token refresh                               │   │
│  │  - Session management                               │   │
│  │  - Route protection                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/*)                                 │   │
│  │  - Decks CRUD                                        │   │
│  │  - Cards CRUD                                        │   │
│  │  - Study sessions                                    │   │
│  │  - Tutor chat                                        │   │
│  │  - Admin moderation                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Supabase Server Client (@supabase/ssr)             │   │
│  │  - Secure database queries                           │   │
│  │  - Server-side auth checks                           │   │
│  │  - RLS enforcement                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                 │   │
│  │  - profiles, decks, cards, srs_states                │   │
│  │  - study_sessions, chat_logs, flags                  │   │
│  │  - Row-Level Security enabled                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth System                                         │   │
│  │  - Email/password authentication                     │   │
│  │  - JWT tokens                                        │   │
│  │  - Session management                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Storage (for future media uploads)                  │   │
│  │  - Flashcard images                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Components

### Authentication Flow

1. User signs up → Supabase Auth creates auth.users record
2. Trigger fires → profiles table auto-populated
3. Email sent → user confirms email
4. Session created → JWT token in cookies
5. Middleware → refreshes token on each request

### Study Flow

1. User starts session → POST /api/study_sessions
2. SRS queries → due cards + new cards fetched
3. User reviews card → POST /api/study_sessions/:id/review
4. SM-2 algorithm → updates srs_states
5. Session ends → stats saved in study_sessions

### Data Protection

- **RLS Policies** on all tables ensure users only access their own data
- **Server Components** verify auth before rendering
- **Middleware** redirects unauthenticated users to login
- **API Routes** validate Supabase auth on each request

## File Structure

\`\`\`
studynest/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── deck/              # Deck management
│   ├── study/             # Study sessions
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── layout.tsx
│   ├── page.tsx           # Landing page
│   └── globals.css
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── api/               # API utilities
│   ├── types/             # TypeScript types
│   ├── srs.ts             # SRS algorithm
│   └── __tests__/         # Unit tests
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── deck-list.tsx
│   ├── study-card.tsx
│   ├── tutor-chat.tsx
│   └── navbar.tsx
├── scripts/
│   ├── 001-008_*.sql      # Database migrations
│   └── 009_seed_demo.sql
├── middleware.ts
├── jest.config.js
├── jest.setup.js
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
└── package.json
\`\`\`

## Security Model

### Row-Level Security (RLS)

Every table has RLS enabled:

\`\`\`sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_only_own" ON table_name 
  FOR SELECT USING (auth.uid() = user_id);
\`\`\`

### Authentication

- Supabase handles password hashing (bcrypt)
- JWT tokens stored in secure HTTP-only cookies
- Refresh tokens automatically rotated
- Sessions tied to user browser via cookies

### Data Validation

- TypeScript for compile-time checking
- Zod for runtime validation (future enhancement)
- API rate limiting for tutor endpoint
- SQL injection protection via parameterized queries

## Performance Optimizations

- **Database Indexes**: on user_id, deck_id, due_date
- **Query Optimization**: minimal SELECT fields, pagination
- **Client Caching**: React Query for client-side cache
- **Lazy Loading**: code splitting with Next.js dynamic imports
- **CDN**: Vercel Edge Network for static assets

## Future Enhancements

- [ ] CSV import for bulk card creation
- [ ] Deck sharing and collaboration
- [ ] Image/audio support for cards
- [ ] Advanced statistics and charts
- [ ] Mobile app (React Native)
- [ ] Integrated model API
- [ ] Premium subscriptions

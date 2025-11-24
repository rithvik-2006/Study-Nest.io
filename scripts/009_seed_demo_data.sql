-- Seed demo data for testing
-- Note: This script is for demonstration and documentation purposes.
-- In production, use your application UI to create decks/cards through authenticated requests.

-- The seed script demonstrates the schema by showing INSERT statements
-- Once users sign up through the UI, they will have auth.users entries,
-- and the trigger will automatically create corresponding profiles.
-- Then, authenticated API calls can create decks/cards using the application.

-- Example of creating a profile (this happens automatically via trigger on auth.users signup):
-- INSERT INTO public.profiles (id, display_name, timezone, created_at, updated_at)
-- VALUES (
--   'user-uuid-here'::uuid,
--   'Demo User',
--   'UTC',
--   now(),
--   now()
-- );

-- Example of creating a deck (once a profile exists):
-- INSERT INTO public.decks (owner_id, title, description, tags, visibility, created_at, updated_at)
-- VALUES (
--   'user-uuid-here'::uuid,
--   'Organic Chemistry - Reactions',
--   'Common organic chemistry reactions and mechanisms',
--   ARRAY['chemistry', 'organic', 'reactions'],
--   'public',
--   now(),
--   now()
-- );

-- Example of creating a card (once a deck exists):
-- INSERT INTO public.cards (deck_id, front, back, hint, media_path, created_at, updated_at)
-- VALUES (
--   (SELECT id FROM public.decks LIMIT 1),
--   'What is esterification?',
--   'Esterification is a reaction between a carboxylic acid and an alcohol to form an ester and water.',
--   'Think about combining two molecules to form a new bond',
--   NULL,
--   now(),
--   now()
-- );

-- To test with actual data, sign up a user through the app UI,
-- then create decks/cards through the application API endpoints.

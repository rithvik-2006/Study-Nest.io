export interface Profile {
  id: string
  display_name: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Deck {
  id: string
  owner_id: string
  title: string
  description: string
  tags: string[]
  visibility: "private" | "public"
  created_at: string
  updated_at: string
}

export interface Card {
  id: string
  deck_id: string
  front: string
  back: string
  hint?: string
  media_path?: string
  created_at: string
  updated_at: string
}

export interface SRSState {
  id: string
  user_id: string
  card_id: string
  easiness: number
  interval: number
  repetitions: number
  due_date: string
  last_reviewed?: string
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  deck_id: string
  started_at: string
  ended_at?: string
  stats: {
    cards_reviewed: number
    percent_correct: number
    avg_response_time: number
  }
  created_at: string
}

export interface ChatLog {
  id: string
  user_id: string
  deck_id?: string
  card_id?: string
  message: string
  response: string
  model_version: string
  created_at: string
}

export interface Flag {
  id: string
  reporter_id: string
  target_type: "deck" | "card"
  target_id: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  created_at: string
  updated_at: string
}

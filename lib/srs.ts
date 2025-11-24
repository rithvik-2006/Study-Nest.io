// Simplified SM-2 algorithm implementation

export interface ReviewResult {
  quality: number // 0-4: Again(0), Hard(1), Good(3), Easy(4)
}

export interface SRSUpdate {
  easiness: number
  interval: number
  repetitions: number
  dueDate: Date
}

export function updateSRS(
  current: {
    easiness: number
    interval: number
    repetitions: number
  },
  quality: number,
): SRSUpdate {
  let { easiness, interval, repetitions } = current

  // Simplified SM-2 algorithm
  easiness = Math.max(1.3, easiness + 0.1 - (5 - quality) * 0.08)

  if (quality < 3) {
    // Failed review
    repetitions = 0
    interval = 1
  } else {
    // Passed review
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 3
    } else {
      interval = Math.round(interval * easiness)
    }
    repetitions += 1
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    easiness,
    interval,
    repetitions,
    dueDate,
  }
}

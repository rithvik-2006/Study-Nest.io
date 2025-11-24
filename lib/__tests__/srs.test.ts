import { updateSRS } from "@/lib/srs"

describe("SRS Algorithm", () => {
  it("should handle failed review (quality < 3)", () => {
    const current = { easiness: 2.5, interval: 5, repetitions: 2 }
    const result = updateSRS(current, 0)

    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(0)
    expect(result.easiness).toBeLessThan(current.easiness)
  })

  it("should handle passing review (quality >= 3)", () => {
    const current = { easiness: 2.5, interval: 1, repetitions: 0 }
    const result = updateSRS(current, 3)

    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.easiness).toBeGreaterThan(current.easiness)
  })

  it("should maintain minimum easiness of 1.3", () => {
    const current = { easiness: 1.5, interval: 1, repetitions: 0 }
    const result = updateSRS(current, 0)

    expect(result.easiness).toBeGreaterThanOrEqual(1.3)
  })

  it("should calculate correct interval for second repetition", () => {
    const current = { easiness: 2.5, interval: 1, repetitions: 1 }
    const result = updateSRS(current, 3)

    expect(result.interval).toBe(3)
    expect(result.repetitions).toBe(2)
  })
})

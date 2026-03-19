// Standard ELO rating calculation
// https://en.wikipedia.org/wiki/Elo_rating_system

const K_FACTOR = 32 // standard K factor for new/casual players

/**
 * Calculate expected score for player A against player B
 */
export const expectedScore = (ratingA: number, ratingB: number): number => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

/**
 * Calculate new ELO rating
 * @param currentRating - player's current ELO
 * @param opponentRating - opponent's ELO (use 1200 for AI)
 * @param result - 1 = win, 0.5 = draw, 0 = loss
 */
export const calculateNewElo = (
    currentRating: number,
    opponentRating: number,
    result: 1 | 0.5 | 0
): { newRating: number; change: number } => {
    const expected = expectedScore(currentRating, opponentRating)
    const change = Math.round(K_FACTOR * (result - expected))
    const newRating = Math.max(100, currentRating + change) // floor at 100

    return { newRating, change }
}

/**
 * Get numeric result value from game result string
 */
export const getResultValue = (
    result: 'win' | 'loss' | 'draw'
): 1 | 0.5 | 0 => {
    if (result === 'win') return 1
    if (result === 'draw') return 0.5
    return 0
}

/**
 * AI ELO by difficulty level
 * Used when calculating ELO change after PvC game
 */
export const AI_ELO: Record<number, number> = {
    2: 800,   // Easy
    6: 1200,  // Medium
    12: 1800,  // Hard
    20: 2500,  // Master
}
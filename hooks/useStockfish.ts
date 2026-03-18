'use client'

import { useCallback, useState } from 'react'

// Lichess Stockfish API — free, no key needed
// Docs: https://lichess.org/api#tag/Analysis/operation/apiCloudEval
const STOCKFISH_API = 'https://stockfish.online/api/s/v2.php'

// Map our difficulty levels to Stockfish depth
const DEPTH_MAP: Record<number, number> = {
    2: 1,   // Easy
    6: 5,   // Medium
    12: 10,  // Hard
    20: 15,  // Master
}

interface StockfishResult {
    bestMove: string | null  // e.g. "e2e4", "g1f3"
    loading: boolean
    error: string | null
}

export const useStockfish = (difficulty: number) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getBestMove = useCallback(async (fen: string): Promise<string | null> => {
        setLoading(true)
        setError(null)

        try {
            const depth = DEPTH_MAP[difficulty] ?? 5
            const url = `${STOCKFISH_API}?fen=${encodeURIComponent(fen)}&depth=${depth}`

            const res = await fetch(url)
            const data = await res.json()

            if (!data.success) {
                throw new Error(data.error ?? 'Stockfish API error')
            }

            // Response format: { success: true, bestmove: "bestmove e2e4 ponder d7d5" }
            // Extract just the move e.g. "e2e4"
            const parts = data.bestmove?.split(' ')
            const bestMove = parts?.[1] ?? null

            if (!bestMove || bestMove === '(none)') return null

            return bestMove // format: "e2e4" (from-to)

        } catch (err: any) {
            console.error('Stockfish error:', err)
            setError(err.message ?? 'Failed to get AI move')
            return null
        } finally {
            setLoading(false)
        }
    }, [difficulty])

    return { getBestMove, loading, error }
}
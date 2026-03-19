'use client'

import { useCallback, useState } from 'react'

interface MoveRecord {
    san: string
    fen: string
    timeSpentMs: number
}

interface SaveGameParams {
    mode: 'pvp' | 'pvc'
    result: 'win' | 'loss' | 'draw'
    reason: string
    pgn: string
    moves: MoveRecord[]
    timeControl: string
    aiDifficulty?: number
    opponentId?: string
    playerColor: 'white' | 'black'
}

interface SaveGameResult {
    gameId: string
    eloChange: number
    newElo: number
    oldElo: number
}

export const useSaveGame = () => {
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState<SaveGameResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const saveGame = useCallback(async (params: SaveGameParams): Promise<SaveGameResult | null> => {
        setSaving(true)
        setError(null)

        try {
            const res = await fetch('/api/games/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error ?? 'Failed to save game')
                return null
            }

            setSaved(data)
            return data

        } catch (err: any) {
            setError(err.message ?? 'Failed to save game')
            return null
        } finally {
            setSaving(false)
        }
    }, [])

    return { saveGame, saving, saved, error }
}
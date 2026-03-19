import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { calculateNewElo, getResultValue, AI_ELO } from '@/lib/elo'

export const POST = async (req: NextRequest) => {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
        mode,           // 'pvp' | 'pvc'
        result,         // 'win' | 'loss' | 'draw'
        reason,         // 'checkmate' | 'resign' | 'timeout' | 'stalemate' | 'draw_agreed'
        pgn,            // full PGN string
        moves,          // array of { san, fen, timeSpentMs }
        timeControl,    // e.g. '10+0'
        aiDifficulty,   // number (pvc only)
        opponentId,     // uuid (pvp only)
        playerColor,    // 'white' | 'black'
    } = await req.json()

    const userId = session.user.id
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // ── 1. Get current player ELO ──
        const userResult = await client.query(
            'SELECT elo_rating FROM public.users WHERE id = $1',
            [userId]
        )
        const currentElo = userResult.rows[0]?.elo_rating ?? 1200

        // ── 2. Calculate ELO change ──
        let opponentElo = 1200
        if (mode === 'pvc') {
            opponentElo = AI_ELO[aiDifficulty] ?? 1200
        } else if (mode === 'pvp' && opponentId) {
            const oppResult = await client.query(
                'SELECT elo_rating FROM public.users WHERE id = $1',
                [opponentId]
            )
            opponentElo = oppResult.rows[0]?.elo_rating ?? 1200
        }

        const resultValue = getResultValue(result)
        const { newRating, change } = calculateNewElo(currentElo, opponentElo, resultValue)

        // ── 3. Generate room code ──
        const roomCodeResult = await client.query(
            'SELECT public.generate_room_code() as code'
        )
        const roomCode = roomCodeResult.rows[0].code

        // ── 4. Determine white/black player IDs ──
        const whitePlayerId = playerColor === 'white' ? userId : (opponentId ?? null)
        const blackPlayerId = playerColor === 'black' ? userId : (opponentId ?? null)

        // ── 5. Determine DB result format ──
        const dbResult =
            result === 'draw' ? 'draw' :
                result === 'win' ? playerColor :
                    playerColor === 'white' ? 'black' : 'white'

        // ── 6. Insert game ──
        const gameInsert = await client.query(
            `INSERT INTO public.games (
        room_code, white_player_id, black_player_id,
        game_mode, ai_difficulty, status, result,
        winner_id, time_control, pgn, current_turn,
        started_at, ended_at, last_activity_at
      ) VALUES (
        $1, $2, $3, $4, $5, 'completed', $6,
        $7, $8, $9, 'white',
        now() - interval '10 minutes', now(), now()
      ) RETURNING id`,
            [
                roomCode,
                whitePlayerId,
                blackPlayerId,
                mode,
                mode === 'pvc' ? aiDifficulty : null,
                dbResult,
                result === 'win' ? userId :
                    result === 'loss' ? (opponentId ?? null) : null,
                timeControl,
                pgn ?? '',
            ]
        )
        const gameId = gameInsert.rows[0].id

        // ── 7. Insert moves ──
        if (moves && moves.length > 0) {
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]
                const moveColor = i % 2 === 0 ? 'white' : 'black'
                const movPlayerId =
                    moveColor === playerColor ? userId : (opponentId ?? null)

                await client.query(
                    `INSERT INTO public.moves (
            game_id, player_id, move_number, san, fen_after, time_spent_ms
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        gameId,
                        movPlayerId,
                        Math.floor(i / 2) + 1,
                        move.san,
                        move.fen,
                        move.timeSpentMs ?? 0,
                    ]
                )
            }
        }

        // ── 8. Insert ELO history ──
        await client.query(
            `INSERT INTO public.elo_history (
        user_id, game_id, elo_before, elo_after, elo_change
      ) VALUES ($1, $2, $3, $4, $5)`,
            [userId, gameId, currentElo, newRating, change]
        )

        // ── 9. Update user stats ──
        await client.query(
            `UPDATE public.users SET
        elo_rating  = $1,
        total_games = total_games + 1,
        wins        = wins   + $2,
        losses      = losses + $3,
        draws       = draws  + $4,
        updated_at  = now()
       WHERE id = $5`,
            [
                newRating,
                result === 'win' ? 1 : 0,
                result === 'loss' ? 1 : 0,
                result === 'draw' ? 1 : 0,
                userId,
            ]
        )

        await client.query('COMMIT')

        return NextResponse.json({
            success: true,
            gameId,
            eloChange: change,
            newElo: newRating,
            oldElo: currentElo,
        })

    } catch (err: any) {
        await client.query('ROLLBACK')
        console.error('Save game error:', err)
        return NextResponse.json(
            { error: 'Failed to save game' },
            { status: 500 }
        )
    } finally {
        client.release()
    }
}
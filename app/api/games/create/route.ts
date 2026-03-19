import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

export const POST = async (req: NextRequest) => {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { timeControl } = await req.json()

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Generate unique room code
        let roomCode: string = ''
        let attempts = 0
        while (attempts < 10) {
            const result = await client.query(
                'SELECT public.generate_room_code() as code'
            )
            roomCode = result.rows[0].code

            // check it's unique
            const existing = await client.query(
                `SELECT id FROM public.games 
         WHERE room_code = $1 AND status IN ('waiting', 'active')`,
                [roomCode]
            )
            if (existing.rows.length === 0) break
            attempts++
        }

        // Parse time control to milliseconds
        const minutes = parseInt(timeControl?.split('+')?.[0] ?? '10')
        const timeMs = minutes * 60 * 1000

        // Create game — creator is white
        const gameResult = await client.query(
            `INSERT INTO public.games (
        room_code,
        white_player_id,
        black_player_id,
        game_mode,
        status,
        time_control,
        white_time_remaining,
        black_time_remaining,
        current_turn,
        started_at
      ) VALUES ($1, $2, null, 'pvp', 'waiting', $3, $4, $4, 'white', now())
      RETURNING id, room_code`,
            [roomCode, session.user.id, timeControl ?? '10+0', timeMs]
        )

        const game = gameResult.rows[0]
        await client.query('COMMIT')

        return NextResponse.json({
            gameId: game.id,
            roomCode: game.room_code,
        })

    } catch (err: any) {
        await client.query('ROLLBACK')
        console.error('Create game error:', err)
        return NextResponse.json(
            { error: 'Failed to create game' },
            { status: 500 }
        )
    } finally {
        client.release()
    }
}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

export const POST = async (req: NextRequest) => {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roomCode } = await req.json()
    if (!roomCode) {
        return NextResponse.json({ error: 'Room code required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Find the game
        const gameResult = await client.query(
            `SELECT id, room_code, white_player_id, black_player_id, status
       FROM public.games
       WHERE room_code = $1`,
            [roomCode.toUpperCase()]
        )

        if (gameResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Game not found. Check your room code.' },
                { status: 404 }
            )
        }

        const game = gameResult.rows[0]

        // Can't join your own game as both players
        if (game.white_player_id === session.user.id) {
            // Creator rejoining their own game
            await client.query('COMMIT')
            return NextResponse.json({
                gameId: game.id,
                roomCode: game.room_code,
                playerColor: 'white',
                status: game.status,
            })
        }

        // Game already has two players
        if (game.black_player_id && game.black_player_id !== session.user.id) {
            return NextResponse.json(
                { error: 'This game is already full.' },
                { status: 409 }
            )
        }

        // Game already completed
        if (game.status === 'completed' || game.status === 'abandoned') {
            return NextResponse.json(
                { error: 'This game has already ended.' },
                { status: 409 }
            )
        }

        // Rejoin as black if already joined
        if (game.black_player_id === session.user.id) {
            await client.query('COMMIT')
            return NextResponse.json({
                gameId: game.id,
                roomCode: game.room_code,
                playerColor: 'black',
                status: game.status,
            })
        }

        // Join as black player
        await client.query(
            `UPDATE public.games
       SET black_player_id = $1, status = 'active', last_activity_at = now()
       WHERE id = $2`,
            [session.user.id, game.id]
        )

        await client.query('COMMIT')

        return NextResponse.json({
            gameId: game.id,
            roomCode: game.room_code,
            playerColor: 'black',
            status: 'active',
        })

    } catch (err: any) {
        await client.query('ROLLBACK')
        console.error('Join game error:', err)
        return NextResponse.json(
            { error: 'Failed to join game' },
            { status: 500 }
        )
    } finally {
        client.release()
    }
}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ roomCode: string }> }
) => {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roomCode } = await params

    const result = await pool.query(
        `SELECT
      g.id,
      g.room_code,
      g.white_player_id,
      g.black_player_id,
      g.status,
      g.game_mode,
      g.time_control,
      g.white_time_remaining,
      g.black_time_remaining,
      g.current_turn,
      g.fen,
      g.pgn,
      -- white player info
      wu.username as white_username,
      wu.elo_rating as white_elo,
      -- black player info
      bu.username as black_username,
      bu.elo_rating as black_elo
     FROM public.games g
     LEFT JOIN public.users wu ON wu.id = g.white_player_id
     LEFT JOIN public.users bu ON bu.id = g.black_player_id
     WHERE g.room_code = $1`,
        [roomCode.toUpperCase()]
    )

    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
}
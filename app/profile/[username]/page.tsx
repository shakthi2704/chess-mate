import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProfileClient from '@/components/profile/ProfileClient'

interface Props {
    params: { username: string }
}

const getProfileData = async (username: string) => {
    // Get user profile
    const userResult = await pool.query(
        `SELECT
      u.id,
      u.username,
      u.avatar_url,
      u.elo_rating,
      u.total_games,
      u.wins,
      u.losses,
      u.draws,
      u.created_at,
      case when u.total_games > 0
        then round((u.wins::numeric / u.total_games) * 100, 1)
        else 0
      end as win_rate
     FROM public.users u
     WHERE u.username = $1`,
        [username]
    )

    if (!userResult.rows[0]) return null
    const user = userResult.rows[0]

    // Get ELO history (last 30 entries)
    const eloResult = await pool.query(
        `SELECT
      elo_after,
      elo_change,
      created_at
     FROM public.elo_history
     WHERE user_id = $1
     ORDER BY created_at ASC
     LIMIT 30`,
        [user.id]
    )

    // Get full game history
    const gamesResult = await pool.query(
        `SELECT
      g.id,
      g.game_mode,
      g.time_control,
      g.ai_difficulty,
      g.ended_at,
      CASE
        WHEN g.result = 'draw' THEN 'draw'
        WHEN (g.result = 'white' AND g.white_player_id = $1) THEN 'win'
        WHEN (g.result = 'black' AND g.black_player_id = $1) THEN 'win'
        ELSE 'loss'
      END as user_result,
      CASE
        WHEN g.white_player_id = $1 THEN g.black_player_id
        ELSE g.white_player_id
      END as opponent_id,
      eh.elo_before,
      eh.elo_after,
      eh.elo_change
     FROM public.games g
     LEFT JOIN public.elo_history eh
       ON eh.game_id = g.id AND eh.user_id = $1
     WHERE
       (g.white_player_id = $1 OR g.black_player_id = $1)
       AND g.status = 'completed'
     ORDER BY g.ended_at DESC
     LIMIT 20`,
        [user.id]
    )

    // fetch opponent names
    const games = await Promise.all(
        gamesResult.rows.map(async (game: any) => {
            let opponentName = 'Stockfish'
            let opponentInitials = 'AI'
            let opponentElo = 0

            if (game.game_mode === 'pvp' && game.opponent_id) {
                const opp = await pool.query(
                    'SELECT username, elo_rating FROM public.users WHERE id = $1',
                    [game.opponent_id]
                )
                if (opp.rows[0]) {
                    opponentName = opp.rows[0].username
                    opponentInitials = opp.rows[0].username.slice(0, 2).toUpperCase()
                    opponentElo = opp.rows[0].elo_rating
                }
            } else if (game.game_mode === 'pvc') {
                opponentName = `Stockfish (Lvl ${game.ai_difficulty ?? '?'})`
                opponentInitials = 'AI'
            }

            return {
                id: game.id,
                mode: game.game_mode,
                timeControl: game.time_control,
                result: game.user_result,
                opponentName,
                opponentInitials,
                opponentElo,
                eloBefore: game.elo_before ?? 0,
                eloAfter: game.elo_after ?? 0,
                eloChange: game.elo_change ?? 0,
                playedAt: game.ended_at
                    ? new Date(game.ended_at).toLocaleDateString()
                    : 'Unknown',
            }
        })
    )

    return {
        user,
        eloHistory: eloResult.rows,
        games,
    }
}

const ProfilePage = async ({ params }: Props) => {
    const session = await auth()
    const { username } = await params        // ← await params
    const data = await getProfileData(username)
    if (!data) notFound()

    const isOwnProfile = session?.user?.id === data.user.id

    return (
        <ProfileClient
            user={data.user}
            eloHistory={data.eloHistory}
            games={data.games}
            isOwnProfile={isOwnProfile}
        />
    )
}

export default ProfilePage
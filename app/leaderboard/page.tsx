import LeaderboardClient from '@/components/leaderboard/LeaderboardClient'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'


const getLeaderboard = async (currentUserId: string | null) => {
    const result = await pool.query(
        `SELECT
      u.id,
      u.username,
      u.avatar_url,
      u.elo_rating,
      u.total_games,
      u.wins,
      u.losses,
      u.draws,
      case when u.total_games > 0
        then round((u.wins::numeric / u.total_games) * 100, 1)
        else 0
      end as win_rate,
      rank() over (order by u.elo_rating desc) as rank
     FROM public.users u
     WHERE u.total_games >= 0
     ORDER BY u.elo_rating DESC
     LIMIT 50`
    )

    return result.rows.map((row: any) => ({
        ...row,
        isCurrentUser: row.id === currentUserId,
    }))
}

export default async function LeaderboardPage() {

    const session = await auth()
    const players = await getLeaderboard(session?.user?.id ?? null)

    return (
        <LeaderboardClient players={players} />
    )
}

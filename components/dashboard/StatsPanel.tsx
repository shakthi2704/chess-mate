import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { StatsPanelClient } from './Statspanelclient'

const StatsPanel = async () => {
    const session = await auth()
    if (!session?.user?.id) return null

    const [statsResult, historyResult] = await Promise.all([
        pool.query(
            `SELECT
        elo_rating,
        total_games,
        wins,
        losses,
        draws,
        case when total_games > 0
          then round((wins::numeric / total_games) * 100, 1)
          else 0
        end as win_rate
       FROM public.users
       WHERE id = $1`,
            [session.user.id]
        ),
        pool.query(
            `SELECT elo_after
       FROM public.elo_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
            [session.user.id]
        ),
    ])

    const stats = statsResult.rows[0]
    if (!stats) return null

    // reverse so oldest → newest for sparkline
    const eloHistory = historyResult.rows
        .map((r: any) => r.elo_after)
        .reverse()

    const lastChange = historyResult.rows.length >= 2
        ? historyResult.rows[0].elo_after - historyResult.rows[1].elo_after
        : 0

    return (
        <StatsPanelClient
            stats={stats}
            eloHistory={eloHistory}
            lastChange={lastChange}
        />
    )
}

export default StatsPanel
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { DashboardTopbarClient } from './DashboardTopbarClient'

const DashboardTopbar = async () => {
    const session = await auth()
    if (!session?.user?.id) return null

    const result = await pool.query(
        `SELECT 
      username,
      avatar_url,
      elo_rating,
      (
        SELECT elo_change 
        FROM public.elo_history 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 1
      ) as last_elo_change
     FROM public.users
     WHERE id = $1`,
        [session.user.id]
    )

    const user = result.rows[0]
    if (!user) return null

    return <DashboardTopbarClient user={user} />
}

export default DashboardTopbar
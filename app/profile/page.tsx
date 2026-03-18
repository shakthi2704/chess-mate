import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function ProfileRedirectPage() {
    const session = await auth()

    if (!session?.user?.id) redirect('/login')

    const result = await pool.query(
        'SELECT username FROM public.users WHERE id = $1',
        [session.user.id]
    )

    const username = result.rows[0]?.username
    if (!username) redirect('/dashboard')

    redirect(`/profile/${username}`)
}



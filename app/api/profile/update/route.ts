import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

export const PATCH = async (req: NextRequest) => {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = await req.json()

    if (!username || username.length < 3 || username.length > 20) {
        return NextResponse.json(
            { error: 'Username must be between 3 and 20 characters' },
            { status: 400 }
        )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
            { error: 'Username can only contain letters, numbers and underscores' },
            { status: 400 }
        )
    }

    // check if username is taken by someone else
    const existing = await pool.query(
        'SELECT id FROM public.users WHERE username = $1 AND id != $2',
        [username, session.user.id]
    )

    if (existing.rows.length > 0) {
        return NextResponse.json(
            { error: 'This username is already taken' },
            { status: 409 }
        )
    }

    await pool.query(
        'UPDATE public.users SET username = $1 WHERE id = $2',
        [username, session.user.id]
    )

    return NextResponse.json(
        { message: 'Profile updated successfully', username },
        { status: 200 }
    )
}
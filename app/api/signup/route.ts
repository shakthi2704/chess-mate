import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    // ── Validate input ──
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      )
    }

    if (username.length < 3 || username.length > 20) {
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // ── Check if email already exists ──
    // const emailCheck = await pool.query(
    //   'SELECT id FROM auth.users WHERE email = $1',
    //   [email]
    // )
    const emailCheck = await pool.query(
      'SELECT id FROM public.users WHERE username = $1',
      [username]
    )
    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // ── Check if username already exists ──
    const usernameCheck = await pool.query(
      'SELECT id FROM public.users WHERE username = $1',
      [username]
    )
    if (usernameCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      )
    }

    // ── Hash password ──
    const passwordHash = await bcrypt.hash(password, 12)

    // ── Create user in transaction ──
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Insert into auth.users
      // Trigger on_auth_user_created will auto-create public.users
      const authResult = await client.query(
        `INSERT INTO auth.users (id, email, password_hash, raw_user_meta_data)
         VALUES (uuid_generate_v4(), $1, $2, $3)
         RETURNING id`,
        [
          email,
          passwordHash,
          JSON.stringify({ name: username, avatar_url: null }),
        ]
      )

      const userId = authResult.rows[0].id

      // Update username in public.users
      // Trigger may use email prefix — we correct it with the chosen username
      await client.query(
        `UPDATE public.users SET username = $1 WHERE id = $2`,
        [username, userId]
      )

      await client.query('COMMIT')

      return NextResponse.json(
        { message: 'Account created successfully', userId },
        { status: 201 }
      )

    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
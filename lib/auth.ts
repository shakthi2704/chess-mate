import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// ── PostgreSQL connection pool ──
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ── Google OAuth ──
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email / Password ──
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Find user in auth.users
          const result = await pool.query(
            `SELECT au.id, au.email, au.password_hash, pu.username, pu.avatar_url, pu.elo_rating
             FROM auth.users au
             JOIN public.users pu ON pu.id = au.id
             WHERE au.email = $1`,
            [credentials.email]
          )

          const user = result.rows[0]
          if (!user) return null

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          )
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.avatar_url,
            elo: user.elo_rating,
          }
        } catch (err) {
          console.error('Auth error:', err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    // ── On sign in — create user profile if first time (Google) ──

    async authorized({ auth }) {
      return !!auth // allow if session exists
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          console.log('Google sign in attempt:', user.email) // add this

          const existing = await pool.query(
            'SELECT id FROM auth.users WHERE email = $1',
            [user.email]
          )

          console.log('Existing user found:', existing.rows.length > 0) // add this

          if (existing.rows.length === 0) {
            console.log('Creating new user for:', user.email) // add this

            await pool.query(
              `INSERT INTO auth.users (id, email, raw_user_meta_data)
           VALUES (uuid_generate_v4(), $1, $2)`,
              [
                user.email,
                JSON.stringify({
                  name: user.name,
                  avatar_url: user.image,
                }),
              ]
            )
            console.log('User created successfully') // add this
          }
        } catch (err) {
          console.error('Google SignIn error DETAILS:', err) // update this
          return false
        }
      }
      return true
    },

    // ── Add extra fields to JWT token ──
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.elo = (user as any).elo ?? 1200
      }

      // Fetch latest ELO from DB on each sign in
      if (account || user) {
        try {
          const result = await pool.query(
            `SELECT pu.id, pu.username, pu.elo_rating, pu.avatar_url
             FROM public.users pu
             JOIN auth.users au ON au.id = pu.id
             WHERE au.email = $1`,
            [token.email]
          )
          if (result.rows[0]) {
            token.id = result.rows[0].id
            token.username = result.rows[0].username
            token.elo = result.rows[0].elo_rating
            token.picture = result.rows[0].avatar_url
          }
        } catch (err) {
          console.error('JWT error:', err)
        }
      }

      return token
    },

    // ── Expose token fields in session ──
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.elo = token.elo as number
        session.user.username = token.username as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
  },
})